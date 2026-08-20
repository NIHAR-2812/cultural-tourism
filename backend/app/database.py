import os
import urllib.parse  # <-- NEW: Import the URL parser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# 1. Load environment variables from .env
load_dotenv()

# 2. Fetch variables 
USER = os.getenv("USER", "postgres")
PASSWORD = os.getenv("PASSWORD", "your_password_here")
HOST = os.getenv("HOST", "db.etxlklkpfquawyvioknf.supabase.co")
PORT = os.getenv("PORT", "5432")
DBNAME = os.getenv("DBNAME", "postgres")

# 3. Safely encode the password so special characters (like @ or #) don't break the URL
encoded_password = urllib.parse.quote_plus(PASSWORD)

# 4. Construct the Supabase connection string using the encoded password
DATABASE_URL = f"postgresql+psycopg2://{USER}:{encoded_password}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# 5. Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# 6. Create a configured "SessionLocal" class for FastAPI
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 7. Create a Base class for your models
Base = declarative_base()

# 8. Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()