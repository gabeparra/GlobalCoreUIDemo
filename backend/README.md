# UCF Global Administrative Portal - Backend

This is the backend server for the UCF Global Administrative Portal. It's built with FastAPI and provides API endpoints for managing form submissions and user data.

## Technology Stack

- FastAPI: Modern, fast web framework for building APIs
- SQLAlchemy: SQL toolkit and Object-Relational Mapping (ORM)
- SQLite: Database (for development)
- Uvicorn: ASGI server for running the FastAPI application

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize the database:
   ```bash
   python create_tables.py
   ```

## Running the Server

Start the development server with:

```bash
uvicorn main:app --reload
```

The server will run at http://localhost:8000

## API Documentation

Once the server is running, you can access the auto-generated API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Available Endpoints

- `GET /`: Welcome message
- `GET /api/i20-requests/`: Get all form submissions
- `POST /api/i20-requests/`: Create a new form submission
- `DELETE /api/i20-requests/`: Delete all form submissions

## Development

### Project Structure

- `main.py`: Application entry point
- `create_tables.py`: Script to initialize database tables
- `app/`: Main application package
  - `models.py`: Database models
  - `schemas.py`: Pydantic schemas for request/response validation
  - `database.py`: Database connection setup
  - `routes.py`: API route definitions

### Database

The application uses SQLite for development. The database file is `sql_app.db` in the root directory.

