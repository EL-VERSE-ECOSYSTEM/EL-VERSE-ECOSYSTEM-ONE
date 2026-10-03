from typing import AsyncIterator
import json
from openai import AsyncOpenAI
from app.tools.registry import registry
from app.config import settings

class BaseAgent:
    persona: str
    system_prompt: str
    model: str

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key or "mock-key")

    async def stream_chat(
        self,
        message: str,
        history: list[dict],
        context: dict,
    ) -> AsyncIterator[dict]:
        messages = [
            {"role": "system", "content": self.system_prompt},
            *history,
            {"role": "user", "content": message},
        ]

        tools = registry.openai_schemas(self.persona)

        if not settings.openai_api_key or settings.openai_api_key == "mock-key":
            yield {"type": "text_delta", "content": f"[{self.persona.upper()}] Response to: {message}"}
            yield {"type": "done"}
            return

        while True:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                stream=True,
            )

            tool_calls = {}
            assistant_content = ""

            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta

                if delta.content:
                    assistant_content += delta.content
                    yield {"type": "text_delta", "content": delta.content}

                if delta.tool_calls:
                    for tc in delta.tool_calls:
                        idx = tc.index
                        if idx not in tool_calls:
                            tool_calls[idx] = {
                                "id": tc.id,
                                "name": tc.function.name,
                                "arguments": "",
                            }
                            yield {
                                "type": "tool_call_start",
                                "tool": tc.function.name,
                            }
                        if tc.function.arguments:
                            tool_calls[idx]["arguments"] += tc.function.arguments

            if tool_calls:
                messages.append({
                    "role": "assistant",
                    "content": assistant_content or None,
                    "tool_calls": [
                        {
                            "id": tc["id"],
                            "type": "function",
                            "function": {
                                "name": tc["name"],
                                "arguments": tc["arguments"],
                            },
                        }
                        for tc in tool_calls.values()
                    ],
                })

                for tc in tool_calls.values():
                    args = json.loads(tc["arguments"] or "{}")
                    result = await registry.execute(
                        tc["name"], args, {**context, "user_id": context.get("user_id")}
                    )
                    yield {
                        "type": "tool_call_result",
                        "tool": tc["name"],
                        "result": result,
                    }
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tc["id"],
                        "content": json.dumps(result, default=str),
                    })
                continue

            yield {"type": "done"}
            break
