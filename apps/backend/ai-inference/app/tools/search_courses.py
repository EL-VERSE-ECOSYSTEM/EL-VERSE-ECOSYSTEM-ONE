import asyncpg
from app.tools.registry import ToolDefinition, registry
from app.config import settings

async def search_courses(
    query: str,
    level: str | None = None,
    category: str | None = None,
    **kwargs,
) -> dict:
    try:
        conn = await asyncpg.connect(settings.database_url)
        try:
            sql = """
                SELECT id, title, description, level, category, price, tutor_id
                FROM courses
                WHERE status = 'published' AND deleted_at IS NULL
                  AND (title ILIKE $1 OR description ILIKE $1)
            """
            params = [f"%{query}%"]
            if level:
                sql += f" AND level = ${len(params) + 1}"
                params.append(level)
            if category:
                sql += f" AND category = ${len(params) + 1}"
                params.append(category)
            sql += " ORDER BY created_at DESC LIMIT 10"

            rows = await conn.fetch(sql, *params)
            return {"courses": [dict(r) for r in rows], "count": len(rows)}
        finally:
            await conn.close()
    except Exception as e:
        return {"courses": [], "count": 0, "note": "Mock search fallback", "query": query}

async def generate_learning_path(
    goals: str,
    current_level: str,
    **kwargs,
) -> dict:
    try:
        conn = await asyncpg.connect(settings.database_url)
        try:
            rows = await conn.fetch("""
                SELECT id, title, level, category FROM courses
                WHERE status = 'published' AND deleted_at IS NULL
                ORDER BY
                  CASE level
                    WHEN $1 THEN 1
                    WHEN 'beginner' THEN 2
                    WHEN 'intermediate' THEN 3
                    WHEN 'advanced' THEN 4
                  END
                LIMIT 12
            """, current_level)

            path = []
            for i, r in enumerate(rows):
                path.append({
                    "step": i + 1,
                    "course_id": str(r["id"]),
                    "title": r["title"],
                    "level": r["level"],
                })
            return {"learning_path": path, "goals": goals}
        finally:
            await conn.close()
    except Exception:
        return {
            "learning_path": [
                {"step": 1, "title": "Fundamentals & Basics", "level": current_level},
                {"step": 2, "title": "Intermediate Building", "level": "intermediate"},
                {"step": 3, "title": "Advanced Mastery & Portfolio", "level": "advanced"}
            ],
            "goals": goals
        }

registry.register(ToolDefinition(
    name="search_courses",
    description="Search ELITES courses by topic or skill",
    parameters={
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search term"},
            "level": {"type": "string", "enum": ["beginner", "intermediate", "advanced"]},
            "category": {"type": "string"},
        },
        "required": ["query"],
    },
    handler=search_courses,
    personas=["menato"],
))

registry.register(ToolDefinition(
    name="generate_learning_path",
    description="Generate a structured learning path for a learner's goals",
    parameters={
        "type": "object",
        "properties": {
            "goals": {"type": "string"},
            "current_level": {"type": "string", "enum": ["beginner", "intermediate", "advanced"]},
        },
        "required": ["goals", "current_level"],
    },
    handler=generate_learning_path,
    personas=["menato"],
))
