from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from config import settings
from routers import voter, rumour, candidates, notifications, admin, forms, chat, history
from scheduler import setup_scheduler, scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[NAMMA VOTE] {settings.APP_NAME} v{settings.APP_VERSION} starting...")
    Path("static/symbols").mkdir(parents=True, exist_ok=True)
    Path("static/photos").mkdir(parents=True, exist_ok=True)
    # Auto-create all DB tables on startup
    from database import engine
    from models import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[DB] Tables ready")
    from seed import seed_db
    await seed_db()
    print("[Seed] Database seeding complete")
    setup_scheduler()
    yield
    scheduler.shutdown(wait=False)
    print("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="India's Complete Election Intelligence Platform API",
    lifespan=lifespan,
)

# CORS
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/api/static", StaticFiles(directory="static"), name="static")

# Routers
app.include_router(voter.router)
app.include_router(rumour.router)
app.include_router(candidates.router)
app.include_router(notifications.router)
app.include_router(admin.router)
app.include_router(forms.router)
app.include_router(chat.router)
app.include_router(history.router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "tagline": "Every Vote. Informed. Protected.",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}
