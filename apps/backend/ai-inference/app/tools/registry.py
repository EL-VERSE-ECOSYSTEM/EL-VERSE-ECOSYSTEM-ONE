from typing import Any, Callable, Awaitable
from dataclasses import dataclass, field

@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: dict[str, Any]
    handler: Callable[..., Awaitable[Any]]
    personas: list[str] = field(default_factory=list)
    requires_approval: bool = False

class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, ToolDefinition] = {}

    def register(self, tool: ToolDefinition):
        self._tools[tool.name] = tool

    def get(self, name: str) -> ToolDefinition | None:
        return self._tools.get(name)

    def for_persona(self, persona: str) -> list[ToolDefinition]:
        return [t for t in self._tools.values() if persona in t.personas or not t.personas]

    def openai_schemas(self, persona: str) -> list[dict]:
        return [
            {
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description,
                    "parameters": t.parameters,
                },
            }
            for t in self.for_persona(persona)
        ]

    async def execute(self, name: str, arguments: dict, context: dict) -> Any:
        tool = self.get(name)
        if not tool:
            return {"error": f"Unknown tool: {name}"}

        if tool.requires_approval and not context.get("approved"):
            return {
                "error": "This action requires human approval",
                "tool": name,
                "status": "pending_approval",
                "required_approval": True,
            }

        try:
            return await tool.handler(**arguments, **context)
        except Exception as e:
            return {"error": str(e), "tool": name}

registry = ToolRegistry()
