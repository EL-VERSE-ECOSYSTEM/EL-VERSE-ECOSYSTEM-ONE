import asyncpg
from app.rag.embedder import embedder
from app.config import settings

class Retriever:
    async def hybrid_search(
        self,
        query: str,
        tenant_id: str | None = None,
        limit: int = 5,
    ) -> list[dict]:
        embedding = await embedder.generate_embedding(query)
        try:
            conn = await asyncpg.connect(settings.database_url)
            try:
                # pgvector search query
                sql = """
                    SELECT id, content, metadata,
                           1 - (embedding <=> $1::vector) AS similarity
                    FROM rag_documents
                    WHERE 1=1
                """
                params = [str(embedding)]
                if tenant_id:
                    sql += f" AND (metadata->>'tenant_id' = ${len(params) + 1})"
                    params.append(tenant_id)
                sql += f" ORDER BY similarity DESC LIMIT ${len(params) + 1}"
                params.append(limit)

                rows = await conn.fetch(sql, *params)
                return [dict(r) for r in rows]
            finally:
                await conn.close()
        except Exception:
            return []

retriever = Retriever()
