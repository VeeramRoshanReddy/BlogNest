from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

class Interaction(enum.Enum):
    like = "like"
    dislike = "dislike"

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    
    blogs = relationship("Blog", back_populates="category")

class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    body = Column(String)
    published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="blogs")
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="blogs")

    interactions = relationship("BlogInteraction", back_populates="blog")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)  # Store hashed passwords
    
    blogs = relationship("Blog", back_populates="creator")
    interactions = relationship("BlogInteraction", back_populates="user")

class BlogInteraction(Base):
    __tablename__ = 'blog_interactions'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    blog_id = Column(Integer, ForeignKey('blogs.id'))
    interaction = Column(Enum(Interaction))
    
    user = relationship("User", back_populates="interactions")
    blog = relationship("Blog", back_populates="interactions")