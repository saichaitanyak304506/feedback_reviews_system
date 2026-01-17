from app.database import get_db
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt
from app.auth import SECRET_KEY, ALGORITHM
from app.models import User
from types import SimpleNamespace

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    # ADMIN
    if payload.get("role") == "admin":
        return SimpleNamespace(
            id=payload.get("id"),
            role="admin"
        )

    # USER
    user = db.query(User).filter(User.id == payload.get("id")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user"
        )

    return user

def admin_only(user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins only"
        )
    return user
