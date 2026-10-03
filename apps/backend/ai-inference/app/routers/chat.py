from fastapi import APIRouter, Request, Depends, Header, HTTPException
from fastapi.responses import StreamingResponse
import json
from app.agents.menato import MenatoAgent
from app.agents.spectre import SpectreAgent
from app.agents.nelly import NellyAgent
from app.agents.elly import EllyAgent
from app.config import settings

router = APIRouter()

AGENTS = {
    "menato": MenatoAgent(),
    "spectre": SpectreAgent(),
    "nelly": NellyAgent(),
    "elly": EllyAgent(),
}

def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal key")

@router.post("/chat/stream", dependencies=[Depends(verify_internal_key)])
async def chat_stream(request: Request):
    body = await request.json()
    persona = body.get("persona", "elly")
    message = body["message"]
    history = body.get("history", [])
    context = body.get("context", {})

    agent = AGENTS.get(persona)
    if not agent:
        raise HTTPException(status_code=400, detail=f"Unknown persona: {persona}")

    async def event_generator():
        try:
            async for event in agent.stream_chat(message, history, context):
                yield f"data: {json.dumps(event, default=str)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
