from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from fastapi import HTTPException, status
from typing import List, Optional
from models import Interaction

def create(request: schemas.BlogCreate, user_id: int, db: Session):
    db_blog = models.Blog(
        title=request.title,
        description=request.description,
        body=request.body,
        category_id=request.category_id,
        user_id=user_id
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def get_all(db: Session, search: Optional[str] = None):
    # Subquery to count likes
    likes_subquery = db.query(
        models.BlogInteraction.blog_id,
        func.count(models.BlogInteraction.id).label("likes_count")
    ).filter(models.BlogInteraction.interaction == 'like').group_by(models.BlogInteraction.blog_id).subquery()

    # Subquery to count dislikes
    dislikes_subquery = db.query(
        models.BlogInteraction.blog_id,
        func.count(models.BlogInteraction.id).label("dislikes_count")
    ).filter(models.BlogInteraction.interaction == 'dislike').group_by(models.BlogInteraction.blog_id).subquery()

    query = db.query(
        models.Blog,
        func.coalesce(likes_subquery.c.likes_count, 0).label("likes"),
        func.coalesce(dislikes_subquery.c.dislikes_count, 0).label("dislikes")
    ).outerjoin(likes_subquery, models.Blog.id == likes_subquery.c.blog_id) \
     .outerjoin(dislikes_subquery, models.Blog.id == dislikes_subquery.c.blog_id)

    if search:
        query = query.join(models.User).filter(
            models.Blog.title.contains(search) |
            models.User.username.contains(search)
        )

    blogs_with_counts = query.order_by(models.Blog.created_at.desc()).all()
    
    # Manually constructing the response to match ShowBlog schema
    result = []
    for blog, likes, dislikes in blogs_with_counts:
        blog.likes = likes
        blog.dislikes = dislikes
        result.append(blog)
        
    return result

def get_one(id: int, db: Session):
    likes_count = db.query(func.count(models.BlogInteraction.id)).filter(models.BlogInteraction.blog_id == id, models.BlogInteraction.interaction == 'like').scalar()
    dislikes_count = db.query(func.count(models.BlogInteraction.id)).filter(models.BlogInteraction.blog_id == id, models.BlogInteraction.interaction == 'dislike').scalar()

    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")

    blog.likes = likes_count or 0
    blog.dislikes = dislikes_count or 0
    return blog

def delete(id: int, user_id: int, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")

    if blog.first().user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this blog")

    blog.delete(synchronize_session=False)
    db.commit()
    return {"detail": "Blog deleted successfully"}

def update(id: int, request: schemas.BlogCreate, user_id: int, db: Session):
    blog_query = db.query(models.Blog).filter(models.Blog.id == id)
    blog = blog_query.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")

    if blog.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this blog")

    blog_query.update(request.dict())
    db.commit()
    return blog_query.first()

def interact(blog_id: int, user_id: int, interaction: Interaction, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {blog_id} not found")
    
    existing_interaction = db.query(models.BlogInteraction).filter(
        models.BlogInteraction.blog_id == blog_id,
        models.BlogInteraction.user_id == user_id
    ).first()

    if existing_interaction:
        if existing_interaction.interaction == interaction:
            # User is clicking the same button again (e.g., unliking)
            db.delete(existing_interaction)
            message = f"Removed {interaction.value}"
        else:
            # User is changing their interaction (e.g., from like to dislike)
            existing_interaction.interaction = interaction
            message = f"Changed interaction to {interaction.value}"
    else:
        # New interaction
        new_interaction = models.BlogInteraction(
            blog_id=blog_id,
            user_id=user_id,
            interaction=interaction
        )
        db.add(new_interaction)
        message = f"Added {interaction.value}"
    
    db.commit()
    return {"detail": message}

def get_categories(db: Session):
    categories = db.query(models.Category).all()
    for category in categories:
        category.blog_count = db.query(models.Blog).filter(models.Blog.category_id == category.id).count()
    return categories

def get_category_blogs(category_id: int, db: Session, search: Optional[str] = None):
    # This is similar to get_all but filtered by category_id
    likes_subquery = db.query(
        models.BlogInteraction.blog_id,
        func.count(models.BlogInteraction.id).label("likes_count")
    ).filter(models.BlogInteraction.interaction == 'like').group_by(models.BlogInteraction.blog_id).subquery()

    dislikes_subquery = db.query(
        models.BlogInteraction.blog_id,
        func.count(models.BlogInteraction.id).label("dislikes_count")
    ).filter(models.BlogInteraction.interaction == 'dislike').group_by(models.BlogInteraction.blog_id).subquery()

    query = db.query(
        models.Blog,
        func.coalesce(likes_subquery.c.likes_count, 0).label("likes"),
        func.coalesce(dislikes_subquery.c.dislikes_count, 0).label("dislikes")
    ).outerjoin(likes_subquery, models.Blog.id == likes_subquery.c.blog_id) \
     .outerjoin(dislikes_subquery, models.Blog.id == dislikes_subquery.c.blog_id) \
     .filter(models.Blog.category_id == category_id)

    if search:
        query = query.join(models.User).filter(
            models.Blog.title.contains(search) |
            models.User.username.contains(search)
        )

    blogs_with_counts = query.order_by(models.Blog.created_at.desc()).all()
    
    result = []
    for blog, likes, dislikes in blogs_with_counts:
        blog.likes = likes
        blog.dislikes = dislikes
        result.append(blog)
        
    return result