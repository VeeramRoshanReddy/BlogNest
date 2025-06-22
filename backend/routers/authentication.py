from fastapi import APIRouter, Depends, HTTPException, status
import schemas, models
from database import get_db
from hashing import Hash
from sqlalchemy.orm import Session
from datetime import timedelta
from JWT_token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import Token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    #prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", status_code=status.HTTP_200_OK, response_model=schemas.Token)
def login(request_form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request_form.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if not Hash.verify(user.password, request_form.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Incorrect password"
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
    #return {"message": "Login successful", "user_id": user.id, "username": user.username}