import asyncpg
from app.tools.registry import ToolDefinition, registry
from app.config import settings

async def find_freelancers(
    skill: str,
    max_rate: float | None = None,
    availability: str | None = None,
    **kwargs,
) -> dict:
    try:
        conn = await asyncpg.connect(settings.database_url)
        try:
            sql = """
                SELECT f.user_id, p.full_name, p.avatar_url,
                       f.skills, f.hourly_rate, f.rating, f.completed_projects
                FROM freelancer_profiles f
                JOIN profiles p ON p.id = f.user_id
                WHERE $1 = ANY(f.skills)
                  AND f.available = true
            """
            params = [skill]
            if max_rate:
                sql += f" AND f.hourly_rate <= ${len(params) + 1}"
                params.append(max_rate)
            sql += " ORDER BY f.rating DESC LIMIT 10"

            rows = await conn.fetch(sql, *params)
            return {"freelancers": [dict(r) for r in rows], "count": len(rows)}
        finally:
            await conn.close()
    except Exception:
        return {"freelancers": [], "count": 0, "skill": skill}

async def draft_proposal(
    job_id: str,
    freelancer_id: str,
    **kwargs,
) -> dict:
    return {
        "job_id": job_id,
        "freelancer_id": freelancer_id,
        "draft": f"I am excited to submit my proposal for job {job_id}. I bring extensive expertise in software development...",
    }

async def estimate_project(
    scope: str,
    tech_stack: list[str],
    complexity: str,
    **kwargs,
) -> dict:
    base_hours = {"simple": 20, "moderate": 60, "complex": 160}.get(complexity, 50)
    stack_multiplier = 1.0 + (len(tech_stack) - 1) * 0.15
    hours = int(base_hours * stack_multiplier)
    avg_rate = 45

    return {
        "estimated_hours": hours,
        "estimated_budget_usd": hours * avg_rate,
        "estimated_weeks": max(1, hours // 30),
        "complexity": complexity,
    }

registry.register(ToolDefinition(
    name="find_freelancers",
    description="Find ELSPACE freelancers by skill and budget",
    parameters={
        "type": "object",
        "properties": {
            "skill": {"type": "string"},
            "max_rate": {"type": "number"},
            "availability": {"type": "string", "enum": ["full_time", "part_time"]},
        },
        "required": ["skill"],
    },
    handler=find_freelancers,
    personas=["spectre"],
))

registry.register(ToolDefinition(
    name="draft_proposal",
    description="Draft a proposal for a job",
    parameters={
        "type": "object",
        "properties": {
            "job_id": {"type": "string"},
            "freelancer_id": {"type": "string"},
        },
        "required": ["job_id", "freelancer_id"],
    },
    handler=draft_proposal,
    personas=["spectre"],
))

registry.register(ToolDefinition(
    name="estimate_project",
    description="Estimate project budget and timeline",
    parameters={
        "type": "object",
        "properties": {
            "scope": {"type": "string"},
            "tech_stack": {"type": "array", "items": {"type": "string"}},
            "complexity": {"type": "string", "enum": ["simple", "moderate", "complex"]},
        },
        "required": ["scope", "tech_stack", "complexity"],
    },
    handler=estimate_project,
    personas=["spectre"],
))
