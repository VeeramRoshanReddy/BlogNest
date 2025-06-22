from fastapi import FastAPI
import models
from database import engine, SessionLocal, seed_categories
from routers import blog, user, authentication

#Pydentic models are called schemeas in FastAPI
#SQLAlchemy models are called models in FastAPI

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BlogNest API",
    description="API for a full-featured blogging platform.",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    seed_categories(db)
    db.close()

app.include_router(authentication.router)
app.include_router(blog.router)
app.include_router(blog.category_router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "BlogNest API is running!"}

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