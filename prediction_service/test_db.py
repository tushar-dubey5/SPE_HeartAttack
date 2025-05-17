from sqlalchemy import create_engine, inspect
from database import init_db, Base, HeartAttackPrediction
import os
from dotenv import load_dotenv

def test_connection():
    load_dotenv()
    
    # Database connection URL
    DB_URL = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    
    try:
        # Connect to the existing database
        engine = create_engine(DB_URL)
        
        # Check if we can connect
        with engine.connect() as conn:
            print(f"Successfully connected to database '{os.getenv('DB_NAME')}'")
            
            # Check if our table exists
            inspector = inspect(engine)
            if HeartAttackPrediction.__tablename__ in inspector.get_table_names():
                print(f"Table '{HeartAttackPrediction.__tablename__}' already exists")
            else:
                # Create only our table
                Base.metadata.create_all(engine, tables=[HeartAttackPrediction.__table__])
                print(f"Created table '{HeartAttackPrediction.__tablename__}'")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection() 