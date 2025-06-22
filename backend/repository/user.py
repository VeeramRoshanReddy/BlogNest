import models, schemas, hashing
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from repository import blog as blog_repository

def create_user(request: schemas.UserCreate, db: Session):
    try:
        # Check if user already exists (optional but recommended)
        existing_user = db.query(models.User).filter(
            (models.User.email == request.email) | 
            (models.User.username == request.username)
        ).first()
        
        if existing_user:
            if existing_user.email == request.email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this email already exists"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this username already exists"
                )
        
        # Create new user
        new_user = models.User(
            username=request.username,
            email=request.email,
            password=hashing.Hash.bcrypt(request.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
        
    except IntegrityError as e:
        db.rollback()  # Important: rollback the transaction
        # Handle the case where the pre-check missed a race condition
        if "email" in str(e.orig):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        elif "username" in str(e.orig):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username already exists"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this information already exists"
            )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {str(e)}"
        )

def get_user(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")
    return user

def get_liked_blogs(user_id: int, db: Session):
    liked_blogs = db.query(models.Blog).join(models.BlogInteraction).filter(
        models.BlogInteraction.user_id == user_id,
        models.BlogInteraction.interaction == models.Interaction.like
    ).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).order_by(models.Blog.created_at.desc()).all()
    
    # Manually add interaction counts for liked blogs
    for blog in liked_blogs:
        blog.likes = blog_repository.get_interaction_count(blog.id, models.Interaction.like, db)
        blog.dislikes = blog_repository.get_interaction_count(blog.id, models.Interaction.dislike, db)

    return liked_blogs