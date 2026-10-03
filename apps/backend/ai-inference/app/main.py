from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers import chat, rag, tools, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import tool modules to ensure registration
    import app.tools.search_courses
    import app.tools.enroll_course
    import app.tools.find_freelancers
    import app.tools.moderate_content
    import app.tools.review_code
    import app.tools.create_support_ticket
    yield

app = FastAPI(
    title="EL VERSE AI Inference Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(chat.router)
app.include_router(rag.router)
app.include_router(tools.router)
