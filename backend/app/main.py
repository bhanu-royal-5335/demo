import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.config import config
from app.vector_store import vector_store
from app.layers.layer0_orchestrator import orchestrator

app = FastAPI(
    title=config.PROJECT_NAME,
    version=config.VERSION,
    description="Hierarchical Bounded Intelligence Architecture for Trustworthy Generative AI (HBI-TGA)"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    max_iterations: Optional[int] = config.MAX_CORRECTION_ITERATIONS
    api_key: Optional[str] = ""
    selected_agent: Optional[str] = "auto"

class IngestRequest(BaseModel):
    title: str
    content: str
    author: Optional[str] = "User Ingested"
    category: Optional[str] = "General"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": config.PROJECT_NAME,
        "version": config.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "indexed_documents": len(vector_store.documents),
        "indexed_passages": len(vector_store.passages),
        "max_iterations_cap": config.MAX_CORRECTION_ITERATIONS,
        "verification_threshold": config.VERIFICATION_THRESHOLD
    }

@app.post("/api/query")
def process_query(payload: QueryRequest):
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")
    
    result = orchestrator.run_pipeline(
        query=payload.query.strip(),
        max_iterations=payload.max_iterations,
        api_key=payload.api_key.strip() if payload.api_key else "",
        selected_agent=payload.selected_agent.strip() if payload.selected_agent else "auto"
    )
    return result

@app.get("/api/documents")
def get_documents():
    return {
        "documents": vector_store.documents,
        "passages_count": len(vector_store.passages)
    }

@app.post("/api/ingest")
def ingest_document(payload: IngestRequest):
    if not payload.title.strip() or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Title and content are required.")
        
    doc = vector_store.add_document(
        title=payload.title.strip(),
        content=payload.content.strip(),
        author=payload.author.strip() if payload.author else "User Ingested",
        category=payload.category.strip() if payload.category else "General"
    )
    return {
        "message": "Document ingested successfully.",
        "document": doc,
        "total_documents": len(vector_store.documents),
        "total_passages": len(vector_store.passages)
    }

@app.get("/api/sample-queries")
def get_sample_queries():
    return {
        "samples": [
            {
                "category": "AI Architecture",
                "query": "What is the Hierarchical Bounded Intelligence Architecture (HBI-TGA) and how does Layer 4 verify claims?"
            },
            {
                "category": "Medical & Health",
                "query": "What is the first-line oral medication for Type-2 Diabetes and what is the recommended HbA1c target?"
            },
            {
                "category": "Renewable Energy",
                "query": "What efficiency have Perovskite-Silicon Tandem Solar Cells achieved and what photon wavelengths do they absorb?"
            },
            {
                "category": "Aerospace",
                "query": "What power generation and life support systems are used in the Artemis Lunar Base?"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
