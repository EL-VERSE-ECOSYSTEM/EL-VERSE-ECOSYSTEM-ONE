from fastapi import APIRouter, Depends, Header, HTTPException, Body
from app.tools.registry import registry
from app.config import settings

router = APIRouter()

def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal key")

@router.get("/tools/{persona}", dependencies=[Depends(verify_internal_key)])
async def list_tools(persona: str):
    tools = registry.for_persona(persona)
    return {
        "persona": persona,
        "tools": [
            {"name": t.name, "description": t.description, "requires_approval": t.requires_approval}
            for t in tools
        ],
    }

@router.post("/tools/execute", dependencies=[Depends(verify_internal_key)])
async def execute_tool(payload: dict = Body(...)):
    tool_name = payload.get("name")
    arguments = payload.get("arguments", {})
    context = payload.get("context", {})
    result = await registry.execute(tool_name, arguments, context)
    return {"result": result}
