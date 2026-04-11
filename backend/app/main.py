from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import engine, Base
from .routers import orders, windows, appointments, leads, reviews

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="ЕвроОкна РБ API",
    description="API для сайта установки евроокон в Беларуси",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(windows.router, prefix="/api/windows", tags=["windows"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "EuroWindows API"}