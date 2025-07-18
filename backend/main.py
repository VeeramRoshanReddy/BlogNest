from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import engine, SessionLocal, seed_categories, get_db
from routers import blog, user, authentication
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
# Import repository if you have it, otherwise create the functions directly
# import repository

# Pydantic models are called schemas in FastAPI
# SQLAlchemy models are called models in FastAPI

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BlogNest API",
    description="API for a full-featured blogging platform.",
    version="1.0.0",
)

# Add CORS middleware BEFORE any routes
''' 
@app.middleware("http")
async def cors_handler(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "https://blog-nest-seven.vercel.app"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
'''

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"]
    #expose_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    try:
        db = SessionLocal()
        seed_categories(db)
        db.close()
        print("Database seeded successfully")
    except Exception as e:
        print(f"Error during startup: {e}")

# Include routers
app.include_router(authentication.router)
app.include_router(blog.router)
app.include_router(blog.category_router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "BlogNest API is running!"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "BlogNest API is operational"}

# Add a test CORS endpoint
@app.get("/test-cors")
def test_cors():
    return {"message": "CORS is working!", "origin": "allowed"}

# Blog endpoints - separate for cards and full content
@app.get("/blogs", response_model=List[schemas.BlogCardResponse])
def get_blogs(db: Session = Depends(get_db)):
    """Get all blogs for card display (without full body content)"""
    # Query with proper joins to ensure creator and category data is loaded
    blogs = db.query(models.Blog).join(models.User).join(models.Category).all()
    
    # Convert to JSON-serializable format to handle datetime properly
    return jsonable_encoder(blogs)

@app.get("/blogs/{id}", response_model=schemas.BlogResponse)
def get_blog(id: int, db: Session = Depends(get_db)):
    """Get single blog with full content"""
    blog = db.query(models.Blog).join(models.User).join(models.Category).filter(models.Blog.id == id).first()
    if not blog:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Blog not found")
    return jsonable_encoder(blog)

@app.get("/blogs/cards/all", response_model=List[schemas.BlogCardResponse])
def get_blog_cards(db: Session = Depends(get_db)):
    """Explicit endpoint for blog cards with proper joins"""
    blogs = db.query(models.Blog).join(models.User).join(models.Category).all()
    return jsonable_encoder(blogs)

'''
from fastapi import FastAPI, Depends, status, Response, HTTPException
from . import schemas,models,hashing
from .database import engine,get_db
from sqlalchemy.orm import Session
from typing import List

app = FastAPI()

@app.post("/blog", status_code=status.HTTP_201_CREATED, tags=["blogs"])
def create(model: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(id=model.id, title=model.title, body=model.body, published=model.published, user_id=model.user_id)
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

@app.get("/blog", response_model = List[schemas.ShowBlog], tags=["blogs"])
def gel_all(db: Session = Depends(get_db)):
    blogs = db.query(models.Blog).all()
    return blogs

@app.get("/blog/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog, tags=["blogs"])
def get_blog(id: int, db: Session = Depends(get_db), response: Response = None):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    
        #or
        
        #response.status_code = status.HTTP_404_NOT_FOUND
        #return {"error": f"Blog with id {id} not found"}
    return blog

#Case 1 -> 204 No Content response
#@app.delete("/blog/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["blogs"])
#Case 2 -> return a message
@app.delete("/blog/{id}", tags=["blogs"])
def delete_blog(id: int, db: Session = Depends(get_db)):
    #blog = db.query(models.Blog).filter(models.Blog.id == id).delete(synchronize_session=False)
    #db.commit()
    #return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    #or
    
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    blog.delete(synchronize_session=False)
    db.commit()
    #Case 1 -> return 204 No Content response
    #return Response(status_code=status.HTTP_204_NO_CONTENT)
    #Case 2 -> return a message
    return f"Blog with id {id} deleted successfully"

    #or
    #Doesn't work
    #blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    #if not blog:
    #    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    #deleted_blog_data = schemas.ShowBlog.model_validation(blog)
    #db.delete(blog)
    #db.commit()
    #return deleted_blog_data
    
@app.put("/blog/{id}", status_code=status.HTTP_202_ACCEPTED, tags=["blogs"])
def update_blog(id: int, model: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found")
    blog.update(model.model_dump(), synchronize_session=False)
    #or
    #blog.title = model.title
    #blog.body = model.body
    #blog.published = model.published
    db.commit()
    return blog.first()

@app.post("/user", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser, tags=["users"])
def create_user(model: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(id=model.id, username=model.username, email=model.email, password=hashing.Hash.bcrypt(model.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/user/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowUser, tags=["users"])
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {id} not found")
    return user
'''