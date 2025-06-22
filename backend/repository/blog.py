from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status, Response
import models, schemas
from typing import Optional
from sqlalchemy import func

def create(request: schemas.BlogCreate, user_id: int, db: Session):
    # Check if category exists
    category = db.query(models.Category).filter(models.Category.id == request.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    new_blog = models.Blog(
        title=request.title,
        description=request.description,
        body=request.body,
        user_id=user_id,
        category_id=request.category_id
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    
    # Load the blog with relationships and add likes/dislikes count
    blog_with_relations = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).filter(models.Blog.id == new_blog.id).first()
    
    # Add likes and dislikes count
    blog_with_relations.likes = get_interaction_count(new_blog.id, models.Interaction.like, db)
    blog_with_relations.dislikes = get_interaction_count(new_blog.id, models.Interaction.dislike, db)
    
    return blog_with_relations

def get_interaction_count(blog_id: int, interaction_type: models.Interaction, db: Session):
    return db.query(models.BlogInteraction).filter(
        models.BlogInteraction.blog_id == blog_id,
        models.BlogInteraction.interaction == interaction_type
    ).count()

def get_all(db: Session, search: Optional[str] = None):
    query = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    )
    if search:
        query = query.filter(
            models.Blog.title.contains(search) | 
            models.Blog.description.contains(search)
        )
    blogs = query.all()
    
    # Add likes and dislikes count to each blog
    for blog in blogs:
        blog.likes = get_interaction_count(blog.id, models.Interaction.like, db)
        blog.dislikes = get_interaction_count(blog.id, models.Interaction.dislike, db)
    
    return blogs

def get_one(id: int, db: Session):
    blog = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).filter(models.Blog.id == id).first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    # Add likes and dislikes count
    blog.likes = get_interaction_count(blog.id, models.Interaction.like, db)
    blog.dislikes = get_interaction_count(blog.id, models.Interaction.dislike, db)
    
    return blog

def destroy(id: int, user_id: int, db: Session):
    blog_query = db.query(models.Blog).filter(models.Blog.id == id)
    blog = blog_query.first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
        
    if blog.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog"
        )

    # Also delete associated interactions to maintain data integrity
    db.query(models.BlogInteraction).filter(models.BlogInteraction.blog_id == id).delete(synchronize_session=False)

    blog_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

def update(id: int, request: schemas.BlogCreate, user_id: int, db: Session):
    blog_query = db.query(models.Blog).filter(models.Blog.id == id)
    blog = blog_query.first()
    
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    if blog.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog"
        )
    
    # Check if new category exists
    if request.category_id != blog.category_id:
        category = db.query(models.Category).filter(models.Category.id == request.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    blog_query.update({
        'title': request.title,
        'description': request.description,
        'body': request.body,
        'category_id': request.category_id
    })
    db.commit()
    
    # Get updated blog with relationships
    updated_blog = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).filter(models.Blog.id == id).first()
    
    # Add likes and dislikes count
    updated_blog.likes = get_interaction_count(id, models.Interaction.like, db)
    updated_blog.dislikes = get_interaction_count(id, models.Interaction.dislike, db)
    
    return updated_blog

def interact(blog_id: int, user_id: int, interaction_type: models.Interaction, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    # Check if user already interacted with this blog
    existing_interaction = db.query(models.BlogInteraction).filter(
        models.BlogInteraction.blog_id == blog_id,
        models.BlogInteraction.user_id == user_id
    ).first()
    
    if existing_interaction:
        if existing_interaction.interaction == interaction_type:
            # Remove interaction if same type
            db.delete(existing_interaction)
            message = f"{interaction_type.value} removed"
        else:
            # Update interaction type
            existing_interaction.interaction = interaction_type
            message = f"Changed to {interaction_type.value}"
    else:
        # Create new interaction
        new_interaction = models.BlogInteraction(
            blog_id=blog_id,
            user_id=user_id,
            interaction=interaction_type
        )
        db.add(new_interaction)
        message = f"Blog {interaction_type.value}d"
    
    db.commit()
    return {"message": message}

def get_categories(db: Session):
    categories = db.query(models.Category).all()
    
    # Add blog_count to each category
    for category in categories:
        category.blog_count = db.query(models.Blog).filter(models.Blog.category_id == category.id).count()
    
    return categories

def get_blogs_by_user_id(user_id: int, db: Session):
    blogs = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).filter(models.Blog.user_id == user_id).order_by(models.Blog.created_at.desc()).all()
    
    # Add likes and dislikes count to each blog
    for blog in blogs:
        blog.likes = get_interaction_count(blog.id, models.Interaction.like, db)
        blog.dislikes = get_interaction_count(blog.id, models.Interaction.dislike, db)
    
    return blogs

def get_category_blogs(category_id: int, db: Session, search: Optional[str] = None):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    query = db.query(models.Blog).options(
        joinedload(models.Blog.creator),
        joinedload(models.Blog.category)
    ).filter(models.Blog.category_id == category_id)
    
    if search:
        query = query.filter(
            models.Blog.title.contains(search) | 
            models.Blog.description.contains(search)
        )
    
    blogs = query.all()
    
    # Add likes and dislikes count to each blog
    for blog in blogs:
        blog.likes = get_interaction_count(blog.id, models.Interaction.like, db)
        blog.dislikes = get_interaction_count(blog.id, models.Interaction.dislike, db)
    
    return blogs