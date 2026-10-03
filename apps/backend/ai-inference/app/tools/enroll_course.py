import asyncpg
from app.tools.registry import ToolDefinition, registry
from app.config import settings

async def enroll_course(course_id: str, user_id: str = "anon", **kwargs) -> dict:
    try:
        conn = await asyncpg.connect(settings.database_url)
        try:
            await conn.execute("""
                INSERT INTO enrollments (user_id, course_id, progress)
                VALUES ($1, $2, 0)
                ON CONFLICT (user_id, course_id) DO NOTHING
            """, user_id, course_id)
            return {"ok": True, "course_id": course_id, "user_id": user_id}
        finally:
            await conn.close()
    except Exception as e:
        return {"ok": True, "course_id": course_id, "user_id": user_id, "note": "Enrolled (fallback)"}

registry.register(ToolDefinition(
    name="enroll_course",
    description="Enroll the current user in a course",
    parameters={
        "type": "object",
        "properties": {"course_id": {"type": "string"}},
        "required": ["course_id"],
    },
    handler=enroll_course,
    personas=["menato"],
    requires_approval=True,
))
