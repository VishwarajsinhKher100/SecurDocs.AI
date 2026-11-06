from pathlib import Path
from typing import Iterator, List
from dotenv import load_dotenv

from langchain_community.document_loaders import CSVLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

CHROMA_STORAGE_DIR = "chroma_db"
DOCUMENTS_SOURCE_DIR = "data"

language_model = ChatGroq(model="openai/gpt-oss-120b")
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

DEPARTMENT_ACCESS_PERMISSIONS = {
    "general": ["engineering", "finance", "hr", "marketing", "ceo", "employee"],
    "engineering": ["engineering", "ceo"],
    "finance": ["finance", "ceo"],
    "hr": ["hr", "ceo"],
    "marketing": ["marketing", "ceo"],
}


def ingest_documents_to_vectorstore() -> Chroma:
    """Loads PDFs and CSVs, applies department tags, and persists to ChromaDB."""
    parsed_document_chunks = []
    text_chunker = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    source_folder_path = Path(DOCUMENTS_SOURCE_DIR)

    if not source_folder_path.exists():
        raise FileNotFoundError(
            f"The '{DOCUMENTS_SOURCE_DIR}' directory does not exist."
        )

    for file_path in source_folder_path.rglob("*"):
        if not file_path.is_file():
            continue

        department_category = file_path.parent.name.lower()

        if file_path.suffix.lower() == ".pdf":
            pdf_chunks = text_chunker.split_documents(
                PyPDFLoader(str(file_path)).load()
            )
            for chunk in pdf_chunks:
                chunk.metadata["department"] = department_category
            parsed_document_chunks.extend(pdf_chunks)

        elif file_path.suffix.lower() == ".csv":
            csv_rows = CSVLoader(file_path=str(file_path), encoding="utf-8").load()
            for row in csv_rows:
                row.metadata["department"] = department_category
            parsed_document_chunks.extend(csv_rows)

    if not parsed_document_chunks:
        raise ValueError(
            f"No valid documents found in '{DOCUMENTS_SOURCE_DIR}/' to ingest."
        )

    return Chroma.from_documents(
        documents=parsed_document_chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_STORAGE_DIR,
    )


def get_vectorstore_instance() -> Chroma:
    """Loads existing Chroma vectorstore or builds it if missing."""
    if Path(CHROMA_STORAGE_DIR).exists():
        return Chroma(
            persist_directory=CHROMA_STORAGE_DIR, embedding_function=embedding_model
        )
    return ingest_documents_to_vectorstore()


def query_rag_pipeline(user_role: str, query_text: str) -> Iterator[str]:
    """Retrieves department-filtered context and streams LLM response chunks."""
    vectorstore_instance = get_vectorstore_instance()

    allowed_departments = [
        department
        for department, authorized_roles in DEPARTMENT_ACCESS_PERMISSIONS.items()
        if user_role in authorized_roles
    ]
    if user_role and user_role not in allowed_departments:
        allowed_departments.append(user_role)

    document_retriever = vectorstore_instance.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4, "filter": {"department": {"$in": allowed_departments}}},
    )

    def format_retrieved_documents(documents: List) -> str:
        if not documents:
            return "No authorized context found."
        return "\n\n".join(
            f"[Source: {doc.metadata.get('source', 'Unknown')} | Dept: {doc.metadata.get('department', 'Unknown')}]\n{doc.page_content}"
            for doc in documents
        )

    prompt_template = ChatPromptTemplate.from_template("""
    You are an internal assistant. Answer using ONLY the authorized context below.
    If no context is provided or authorized, state that the user lacks access.
    Context: {context}
    Question: {question}
    Answer:
    """)

    rag_execution_chain = (
        {
            "context": document_retriever | format_retrieved_documents,
            "question": RunnablePassthrough(),
        }
        | prompt_template
        | language_model
        | StrOutputParser()
    )

    return rag_execution_chain.stream(query_text)


if __name__ == "__main__":
    if not Path(CHROMA_STORAGE_DIR).exists():
        print("Initializing ChromaDB ingestion...")
        ingest_documents_to_vectorstore()
        print("Successfully completed ChromaDB ingestion!")
    else:
        print("ChromaDB already exists. Ready to query!")
