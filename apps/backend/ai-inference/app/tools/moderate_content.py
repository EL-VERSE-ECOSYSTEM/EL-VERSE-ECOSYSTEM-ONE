from app.tools.registry import ToolDefinition, registry

async def moderate_content(post_id: str, **kwargs) -> dict:
    return {"post_id": post_id, "flags": [], "action": "clean"}

async def rank_feed(user_id: str = "anon", limit: int = 20, **kwargs) -> dict:
    return {"user_id": user_id, "posts": []}

async def summarize_thread(thread_id: str, **kwargs) -> dict:
    return {"thread_id": thread_id, "summary": "Thread summary generated."}

registry.register(ToolDefinition(
    name="moderate_content",
    description="Check content against moderation rules and flag if needed",
    parameters={
        "type": "object",
        "properties": {"post_id": {"type": "string"}},
        "required": ["post_id"],
    },
    handler=moderate_content,
    personas=["nelly"],
))

registry.register(ToolDefinition(
    name="rank_feed",
    description="Rank the feed for a user",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string"},
            "limit": {"type": "integer", "default": 20},
        },
        "required": ["user_id"],
    },
    handler=rank_feed,
    personas=["nelly"],
))

registry.register(ToolDefinition(
    name="summarize_thread",
    description="Fetch thread messages for summarization",
    parameters={
        "type": "object",
        "properties": {"thread_id": {"type": "string"}},
        "required": ["thread_id"],
    },
    handler=summarize_thread,
    personas=["nelly"],
))
