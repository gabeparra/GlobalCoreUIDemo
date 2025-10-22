#!/usr/bin/env python3
"""
Script to create/update database tables for Academic Training requests
"""

from app.database import engine
from app import models

if __name__ == "__main__":
    print("Creating/updating database tables...")
    
    # Create all tables (this will create new tables if they don't exist)
    models.Base.metadata.create_all(bind=engine)
    
    print("Database tables created/updated successfully!")
    print("Available tables:")
    for table_name in models.Base.metadata.tables.keys():
        print(f"  - {table_name}")
