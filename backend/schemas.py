from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

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

class ShowBlog(BaseModel):
    id: int
    title: str
    description: str
    body: str
    created_at: datetime
    creator: User
    category: Category
    likes: int
    dislikes: int
    model_config = ConfigDict(from_attributes=True)

class ShowCategory(Category):
    blogs: List[ShowBlog] = []
    blog_count: int
    model_config = ConfigDict(from_attributes=True)

class ShowUser(User):
    blogs: List[ShowBlog] = []
    model_config = ConfigDict(from_attributes=True)

class BlogInteractionBase(BaseModel):
    blog_id: int
    interaction: str

class LikedBlog(BaseModel):
    blog: ShowBlog
    model_config = ConfigDict(from_attributes=True)

class UserProfile(ShowUser):
    liked_blogs: List[LikedBlog] = []
    model_config = ConfigDict(from_attributes=True)