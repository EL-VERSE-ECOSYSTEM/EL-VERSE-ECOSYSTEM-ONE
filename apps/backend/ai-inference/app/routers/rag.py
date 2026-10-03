from fastapi import APIRouter, Depends, Header, HTTPException, Body
from app.rag.retriever import retriever
from app.rag.ingest import ingestor
from app.config import settings

router = APIRouter()

def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal key")

@router.post("/rag/search", dependencies=[Depends(verify_internal_key)])
async def rag_search(payload: dict = Body(...)):
    query = payload.get("query", "")
    tenant_id = payload.get("tenant_id")
    limit = payload.get("limit", 5)
    results = await retriever.hybrid_search(query, tenant_id=tenant_id, limit=limit)
    return {"results": results}

@router.post("/rag/ingest", dependencies=[Depends(verify_internal_key)])
async def rag_ingest(payload: dict = Body(...)):
    doc_id = payload.get("document_id", "doc-1")
    text = payload.get("text", "")
    metadata = payload.get("metadata", {})
    count = await ingestor.ingest_document(doc_id, text, metadata)
    return {"status": "ok", "chunks_ingested": count}
