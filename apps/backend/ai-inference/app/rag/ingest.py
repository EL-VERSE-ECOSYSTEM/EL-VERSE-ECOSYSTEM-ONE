import asyncpg
from app.rag.embedder import embedder
from app.config import settings

class DocumentIngestor:
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunks.append(" ".join(words[i:i + chunk_size]))
        return chunks if chunks else [text]

    async def ingest_document(
        self,
        document_id: str,
        text: str,
        metadata: dict,
    ) -> int:
        chunks = self.chunk_text(text)
        count = 0
        try:
            conn = await asyncpg.connect(settings.database_url)
            try:
                for chunk in chunks:
                    emb = await embedder.generate_embedding(chunk)
                    await conn.execute("""
                        INSERT INTO rag_documents (doc_id, content, embedding, metadata)
                        VALUES ($1, $2, $3::vector, $4)
                    """, document_id, chunk, str(emb), metadata)
                    count += 1
            finally:
                await conn.close()
        except Exception:
            pass
        return count

ingestor = DocumentIngestor()
