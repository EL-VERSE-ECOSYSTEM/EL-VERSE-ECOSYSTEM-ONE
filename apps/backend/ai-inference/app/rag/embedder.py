from openai import AsyncOpenAI
from app.config import settings

class Embedder:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key or "mock-key")

    async def generate_embedding(self, text: str) -> list[float]:
        if not settings.openai_api_key or settings.openai_api_key == "mock-key":
            return [0.0] * settings.embedding_dimensions

        resp = await self.client.embeddings.create(
            model=settings.embedding_model,
            input=text,
        )
        return resp.data[0].embedding

embedder = Embedder()
