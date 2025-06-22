from fastapi import APIRouter, Depends, status
import schemas, oauth2
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from repository import user as user_repository
from repository import blog as blog_repository

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser)
def create_user(request: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_repository.create_user(request, db)

@router.get('/me/blogs', response_model=List[schemas.ShowBlog])
def get_my_blogs(db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.get_blogs_by_user_id(current_user.id, db)

@router.get('/me/liked-blogs', response_model=List[schemas.ShowBlog])
def get_my_liked_blogs(db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return user_repository.get_liked_blogs(current_user.id, db)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowUser)
def get_user(id: int, db: Session = Depends(get_db)):
    return user_repository.get_user(id, db)