import asyncpg
import json
from app.config import settings

class MemoryStore:
    async def get_history(self, conversation_id: str, limit: int = 10) -> list[dict]:
        try:
            conn = await asyncpg.connect(settings.database_url)
            try:
                row = await conn.fetchrow("""
                    SELECT messages FROM ai_conversations WHERE id = $1
                """, conversation_id)
                if row and row["messages"]:
                    msgs = json.loads(row["messages"]) if isinstance(row["messages"], str) else row["messages"]
                    return msgs[-limit:]
                return []
            finally:
                await conn.close()
        except Exception:
            return []

    async def save_message(self, conversation_id: str, user_id: str, persona: str, user_msg: str, assistant_msg: str):
        try:
            conn = await asyncpg.connect(settings.database_url)
            try:
                history = await self.get_history(conversation_id, limit=20)
                history.append({"role": "user", "content": user_msg})
                history.append({"role": "assistant", "content": assistant_msg})

                await conn.execute("""
                    INSERT INTO ai_conversations (id, user_id, persona, messages)
                    VALUES ($1, $2, $3, $4::jsonb)
                    ON CONFLICT (id) DO UPDATE
                    SET messages = EXCLUDED.messages, updated_at = now()
                """, conversation_id, user_id, persona, json.dumps(history))
            finally:
                await conn.close()
        except Exception:
            pass

memory_store = MemoryStore()
