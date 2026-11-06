# 🔒 SecurDocs AI — Role-Based Access Control (RBAC) RAG Platform

**SecurDocs AI** is an enterprise-ready **Retrieval-Augmented Generation (RAG)** platform designed with **Role-Based Access Control (RBAC)**. It enforces strict document access boundaries based on user roles and departments, ensuring users can only retrieve information they are explicitly authorized to access.

The system features a **FastAPI backend** handling document ingestion, vector storage, context filtering, and response streaming, alongside a modern **React + Tailwind CSS frontend** tailored with a sleek dark theme.

## 🌟 Key Features

* **Role-Based Document Authorization (RBAC):** Restricts document retrieval in ChromaDB based on department metadata and user permissions.

* **Streaming AI Responses:** Real-time chunk-by-chunk answer streaming via LangChain, FastAPI `StreamingResponse`, and Groq LLMs (`openai/gpt-oss-120b`).

* **Multi-Format Ingestion:** Automatic chunking and ingestion of `.pdf` and `.csv` files tagged with department metadata.

* **Vector Store & Embeddings:** HuggingFace `all-MiniLM-L6-v2` embeddings stored locally in ChromaDB.

* **FastAPI Backend:** Lightweight REST & Streaming APIs for authentication and RAG processing.

* **Modern React Interface:** UI inspired by customer support portals, complete with pre-configured sample question shortcuts and persistent chat states.

## 🏗 System Architecture

```
               +----------------------------------+
               |   SecurDocs AI React Frontend    |
               | (Tailwind CSS, Lucide Icons)     |
               +----------------------------------+
                                |
               HTTP POST /login | POST /chat (Stream)
                                v
               +----------------------------------+
               |         FastAPI Backend          |
               +----------------------------------+
                  /                            \
                 v                              v
      +---------------------+        +---------------------+
      |   SQLite Database   |        |   ChromaDB Vector   |
      |   (User Roles)      |        |   Store (Filtered)  |
      +---------------------+        +---------------------+
                                                |
                                                v
                                     +--------------------+
                                     |  Groq LLM Engine   |
                                     +--------------------+
```

## 👥 Department Access Matrix

| Role | Accessible Department Contexts | 
| ----- | ----- | 
| **CEO** | `engineering`, `finance`, `hr`, `marketing`, `general`, `employee` | 
| **Engineering** | `engineering`, `general` | 
| **Finance** | `finance`, `general` | 
| **HR** | `hr`, `general` | 
| **Marketing** | `marketing`, `general` | 
| **Employee** | `general` | 

## 🔑 Default Credentials (Seed Users)

| Username | Password | Role | 
| ----- | ----- | ----- | 
| `alice` | `pass135` | `ceo` | 
| `bob` | `bobhr093` | `hr` | 
| `victoria` | `clarapass234` | `finance` | 
| `david` | `davm03` | `marketing` | 
| `maya` | `empass934` | `engineering` | 
| `jack` | `jakepas123` | `employee` | 

## 📁 Repository Structure

```
.
├── backend/
│   ├── data/                   # Document folders grouped by department (e.g., /data/finance/)
│   ├── database.py             # SQLite user setup and verification
│   ├── rag.py                  # LangChain RAG pipeline & ChromaDB management
│   ├── main.py                 # FastAPI endpoints
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (GROQ_API_KEY)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Auth form
    │   │   ├── Sidebar.jsx     # Navigation and sample questions
    │   │   └── ChatArea.jsx    # Streaming message view and prompt box
    │   ├── App.jsx             # Root layout and global state
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Tailwind directives
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

* **Python:** 3.10+
* **Node.js:** 18+
* **Groq API Key:** Obtain from [Groq Console](https://console.groq.com/)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install sentence-transformers
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Place documents:**
   Organize your data into department folders within `backend/data/`:
   ```
   backend/data/
   ├── general/
   ├── engineering/
   ├── finance/
   ├── hr/
   └── marketing/
   ```

6. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will automatically initialize `users.db` and ingest documents into `chroma_db` on start.*

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node packages:**
   ```bash
   npm install
   npm install lucide-react
   ```

3. **Run the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Lucide React Icons
* **Backend:** FastAPI, Uvicorn, Pydantic, SQLite
* **AI & RAG:** LangChain, ChromaDB, HuggingFace Transformers (`all-MiniLM-L6-v2`), Groq API
