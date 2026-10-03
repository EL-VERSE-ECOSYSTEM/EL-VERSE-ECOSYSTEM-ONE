from app.tools.registry import ToolDefinition, registry

async def review_code(code: str, language: str, context: str | None = None, **kwargs) -> dict:
    return {
        "language": language,
        "code_length": len(code),
        "suggestions": [
            {"severity": "info", "rule": "Code style", "message": "Code looks well-structured."},
        ]
    }

async def match_internship(skills: list[str], location: str | None = None, **kwargs) -> dict:
    return {"skills": skills, "internships": []}

registry.register(ToolDefinition(
    name="review_code",
    description="Fetch code review guidelines for a language",
    parameters={
        "type": "object",
        "properties": {
            "code": {"type": "string"},
            "language": {"type": "string"},
            "context": {"type": "string"},
        },
        "required": ["code", "language"],
    },
    handler=review_code,
    personas=["elly"],
))

registry.register(ToolDefinition(
    name="match_internship",
    description="Find internships matching the user's skills",
    parameters={
        "type": "object",
        "properties": {
            "skills": {"type": "array", "items": {"type": "string"}},
            "location": {"type": "string"},
        },
        "required": ["skills"],
    },
    handler=match_internship,
    personas=["elly"],
))
