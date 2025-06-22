from fastapi import APIRouter, Depends, status, Response, HTTPException
from .. import schemas, oauth2, models
from typing import List, Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..repository import blog as blog_repository

router = APIRouter(
    tags=["Blogs"]
)

category_router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@router.post("/blog", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowBlog)
def create_blog(request: schemas.BlogCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.create(request, current_user.id, db)

@router.get("/blogs", response_model=List[schemas.ShowBlog])
def get_all_blogs(db: Session = Depends(get_db), search: Optional[str] = None, current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.get_all(db, search)

@router.get("/blog/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog)
def get_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.get_one(id, db)

@router.delete("/blog/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.delete(id, current_user.id, db)

@router.put("/blog/{id}", status_code=status.HTTP_202_ACCEPTED, response_model=schemas.ShowBlog)
def update_blog(id: int, request: schemas.BlogCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.update(id, request, current_user.id, db)

@router.post("/blog/{id}/like", status_code=status.HTTP_200_OK)
def like_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.interact(id, current_user.id, models.Interaction.like, db)

@router.post("/blog/{id}/dislike", status_code=status.HTTP_200_OK)
def dislike_blog(id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.interact(id, current_user.id, models.Interaction.dislike, db)

@category_router.get("/", response_model=List[schemas.ShowCategory])
def get_categories(db: Session = Depends(get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.get_categories(db)

@category_router.get("/{id}/blogs", response_model=List[schemas.ShowBlog])
def get_blogs_in_category(id: int, db: Session = Depends(get_db), search: Optional[str] = None, current_user: schemas.User = Depends(oauth2.get_current_user)):
    return blog_repository.get_category_blogs(id, db, search)