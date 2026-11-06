import os
from pathlib import Path
from typing import Iterator, List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .database import verify_user_credentials, initialize_user_database
from .rag import query_rag_pipeline, ingest_documents_to_vectorstore, CHROMA_STORAGE_DIR

load_dotenv()

app = FastAPI(title="ContextGuard RBAC RAG API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    initialize_user_database()
    if not Path(CHROMA_STORAGE_DIR).exists():
        ingest_documents_to_vectorstore()


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    username: str
    role: str


class QueryRequest(BaseModel):
    username: str
    role: str
    query: str


@app.post("/api/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    is_valid, role = verify_user_credentials(
        credentials.username.strip(), credentials.password.strip()
    )
    if not is_valid or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    return LoginResponse(username=credentials.username, role=role)


@app.post("/api/chat")
def chat_stream(request: QueryRequest):
    def event_stream():
        try:
            stream = query_rag_pipeline(
                user_role=request.role, query_text=request.query
            )
            for chunk in stream:
                yield chunk
        except Exception as e:
            yield f"\n[Error: {str(e)}]"

    return StreamingResponse(event_stream(), media_type="text/plain")
