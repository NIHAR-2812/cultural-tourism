import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

# Fetch variables strictly from environment/Render, no hardcoded secrets!
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
DB_PORT = os.getenv("DB_PORT") # Renamed from PORT to avoid Render conflict
DBNAME = os.getenv("DBNAME")

# Safety check to prevent silent failures if variables are missing
if not all([USER, PASSWORD, HOST, DB_PORT, DBNAME]):
    raise ValueError("Missing one or more database environment variables. Check your .env or Render dashboard.")

# Safely encode the password so special characters (like @) don't break the URL
encoded_password = urllib.parse.quote_plus(PASSWORD)

# Construct the URL using DB_PORT
DATABASE_URL = f"postgresql+psycopg2://{USER}:{encoded_password}@{HOST}:{DB_PORT}/{DBNAME}?sslmode=require"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()