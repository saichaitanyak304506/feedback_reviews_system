from fastapi import APIRouter,Depends,HTTPException,status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import UserCreate,UserLogin,FeedbackCreate,FeedbackResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User,Feedback,FeedbackStatus
from app.auth import verify_password,hash_password,create_access_token
from app.dependencies import get_current_user,admin_only


ADMIN_EMAIL = "admin@feedback.com"
ADMIN_PASSWORD = "admin123"



router = APIRouter(prefix="/api", tags=["user"])


@router.post("/register")
def user_register(user:UserCreate,db:Session = Depends(get_db)):

    check_existing_user = db.query(User).filter(User.email == user.email).first()

    if check_existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="User already exits")
    
    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role ="user"
    )

    db.add(new_user)
    db.commit()

    return {"message":"User registered successfully"}



@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # -------- ADMIN LOGIN (DEFAULT) --------
    if (
        form_data.username == ADMIN_EMAIL
        and form_data.password == ADMIN_PASSWORD
    ):
        token = create_access_token(
            {"id": 0, "role": "admin"}
        )
        return {
            "access_token": token,
            "token_type": "bearer"
        }

    # -------- USER LOGIN --------
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user or not verify_password(
        form_data.password,
        str(user.password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {"id": user.id, "role": user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ---- User -----

@router.post("/feedback")
def create_feedback(feedback:FeedbackCreate,db:Session=Depends(get_db),user=Depends(get_current_user)):
    fb = Feedback(
        message=feedback.message,
        rating= feedback.rating,
        user_id = user.id
    )

    db.add(fb)
    db.commit()
    return fb



@router.get("/my-feedback")
def my_feedback(db:Session=Depends(get_db),user= Depends(get_current_user)):
    return db.query(Feedback).filter(Feedback.user_id== user.id).all()



@router.get("/all-feedback")
def all_feedback(
    db: Session = Depends(get_db),
    admin = Depends(admin_only)
):
    return db.query(Feedback).all()



@router.put("/feedback/{id}/review")
def review_feedback(
    id: int,
    db: Session = Depends(get_db),
    admin = Depends(admin_only)
):
    fb = db.query(Feedback).filter(Feedback.id == id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")

    fb.status = FeedbackStatus.REVIEWED # type: ignore
    db.commit()
    return fb

