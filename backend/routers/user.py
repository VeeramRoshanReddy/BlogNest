from fastapi import APIRouter, Depends, status
import schemas
from sqlalchemy.orm import Session
from database import get_db
from repository import user as user_repository

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser)
def create_user(request: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_repository.create_user(request, db)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowUser)
def get_user(id: int, db: Session = Depends(get_db)):
    return user_repository.get_user(id, db)