from datetime import datetime,timedelta,timezone
from jose import jwt,JWTError
from passlib.context import CryptContext


pwd_context= CryptContext(schemes=['argon2'],deprecated="auto")

SECRET_KEY = "#FEEDBACK##REVIEW##SYSTEM#"
ALGORITHM ="HS256"


def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(password:str,hashed_password:str) -> bool:
    return pwd_context.verify(password,hashed_password)


def create_access_token(data:dict):
    to_encode = data.copy()
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode.update({'exp':expiry_time})
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)






# ACCESS_TOKEN_EXPIRE_MINUTES  = 30 

# def create_auth_token(data:dict):
#     to_encode = data.copy()
#     expiry_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({'exp':expiry_time})
#     return jwt.encode(to_encode,SECRET_KET,algorithm=ALGORITHM)

