from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import models

SQLALCHEMY_DATABASE_URL = "sqlite:////data/blog.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

CATEGORIES = [
    {"name": "Personal Blog", "description": "Life updates, stories, thoughts, and reflections from an individual."},
    {"name": "Tech Blog", "description": "Tutorials, news, and discussions around programming, gadgets, and tech trends."},
    {"name": "Travel Blog", "description": "Travel guides, itineraries, cultural experiences, and destination reviews."},
    {"name": "Food Blog", "description": "Recipes, cooking tips, restaurant reviews, and culinary experiences."},
    {"name": "Finance Blog", "description": "Personal finance, investing, saving tips, and budgeting."},
    {"name": "Health & Fitness Blog", "description": "Exercise routines, nutrition advice, wellness strategies."},
    {"name": "Educational Blog", "description": "Teach academic or skill-based topics (math, coding, languages, etc.)."},
    {"name": "Fashion Blog", "description": "Outfit ideas, fashion trends, clothing reviews, and styling tips."},
    {"name": "Parenting Blog", "description": "Tips, experiences, and support for raising children."},
    {"name": "DIY/Crafts Blog", "description": "Step-by-step projects for home decor, art, or crafting."},
    {"name": "Photography Blog", "description": "Showcase photography, tutorials, gear reviews, and inspiration."},
    {"name": "Lifestyle Blog", "description": "A mix of daily life, routines, productivity, home, and personal development."},
    {"name": "Productivity Blog", "description": "Time management, goal-setting, tools, and personal effectiveness tips."},
    {"name": "Gaming Blog", "description": "Game reviews, news, guides, walkthroughs, and gaming culture."},
    {"name": "Book/Reading Blog", "description": "Book reviews, reading challenges, author insights, literary discussions."},
    {"name": "Career/Job Blog", "description": "Resume tips, interview strategies, workplace advice, career paths."},
    {"name": "Coding/Dev Blog", "description": "Tutorials, tools, frameworks, and software engineering topics."},
    {"name": "Environmental Blog", "description": "Climate change, sustainability, eco-living, and green tech."},
    {"name": "Political/Opinion Blog", "description": "Commentary, analysis, or discussion on politics and current affairs."},
    {"name": "Pop Culture Blog", "description": "TV, movies, music, celebrity news, fandom theories."},
    {"name": "Mental Health Blog", "description": "Coping strategies, therapy insights, self-care advice."},
    {"name": "History Blog", "description": "Deep dives into historical events, people, and timelines."},
    {"name": "Marketing/SEO Blog", "description": "Digital marketing strategies, content SEO, analytics, advertising tips."},
    {"name": "Nonprofit/Cause Blog", "description": "Promote social good, awareness, fundraising, or volunteering opportunities."},
    {"name": "Startup/Entrepreneur Blog", "description": "Building a business, startup journeys, fundraising, and innovation strategies."}
]

def seed_categories(db: Session):
    if db.query(models.Category).count() == 0:
        for category in CATEGORIES:
            db.add(models.Category(name=category["name"], description=category["description"]))
        db.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()