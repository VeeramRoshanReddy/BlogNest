# Forward reference to avoid circular imports
from __future__ import annotations
from pydantic import BaseModel, ConfigDict, computed_field
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    pass

class Login(BaseModel):
    username: str
    password: str
    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    model_config = ConfigDict(from_attributes=True)

class TokenData(BaseModel):
    email: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class CategoryBase(BaseModel):
    name: str
    description: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BlogBase(BaseModel):
    title: str
    description: str
    body: str
    category_id: int

class BlogCreate(BlogBase):
    pass

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# New Response Models
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class BlogResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    body: str
    published: bool = True  # Added default value
    created_at: datetime
    likes: int = 0
    dislikes: int = 0
    creator: UserResponse
    category: CategoryResponse
    model_config = ConfigDict(from_attributes=True)

class ShowBlog(BaseModel):
    id: int
    title: str
    description: str
    body: str
    created_at: datetime
    creator: User
    category: Category
    likes: int = 0
    dislikes: int = 0
    model_config = ConfigDict(from_attributes=True)

# Simple category response without blogs list to avoid circular reference
class ShowCategory(Category):
    blog_count: int = 0
    model_config = ConfigDict(from_attributes=True)

# Detailed category with blogs (use only when needed)
class ShowCategoryWithBlogs(Category):
    blogs: List[ShowBlog] = []
    blog_count: int = 0
    model_config = ConfigDict(from_attributes=True)

class ShowUser(User):
    blogs: List[ShowBlog] = []
    model_config = ConfigDict(from_attributes=True)

class BlogInteractionBase(BaseModel):
    blog_id: int
    interaction: str
    model_config = ConfigDict(from_attributes=True)

class LikedBlog(BaseModel):
    blog: ShowBlog
    model_config = ConfigDict(from_attributes=True)

class UserProfile(ShowUser):
    liked_blogs: List[LikedBlog] = []
    model_config = ConfigDict(from_attributes=True)