from sqlalchemy import String,Column,Integer,ForeignKey,Enum
from .database import Base
import enum

class FeedbackStatus(str,enum.Enum):
    NEW ="New"
    REVIEWED = "Reviewed"


class User(Base):
    __tablename__ = "users"

    id=Column(Integer,primary_key=True,index=True)
    username =Column(String,nullable=False)
    email=Column(String,unique=True,nullable=False)
    password=Column(String,nullable=False)
    role=Column(String,default="user")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer,primary_key=True,index=True)
    message=Column(String,nullable=False)
    rating= Column(Integer,nullable=False)
    status = Column(Enum(FeedbackStatus),default=FeedbackStatus.NEW)
    user_id=Column(Integer,ForeignKey("users.id"))


