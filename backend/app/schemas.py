from pydantic import BaseModel,ConfigDict

# --------- users -------------



class UserCreate(BaseModel):
    username:str
    email:str
    password:str


class UserLogin(BaseModel):
    email:str
    password:str



# ------- Feedback ------------

class FeedbackCreate(BaseModel):
    message:str
    rating:int


class FeedbackResponse(BaseModel):
    id:int
    message:str
    rating:int
    status:str
    user_id:int

    model_config=ConfigDict(
        from_attributes=True
    )
    