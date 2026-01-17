from fastapi import FastAPI
from app.models import Base
from app.database import engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Feedback Review System")


Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)

@app.get("/")
def greet():
    return "Welcome to Feedback and review system project !!!"

