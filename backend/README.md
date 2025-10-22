# UCF Global Administrative Portal - Backend

This is the backend server for the UCF Global Administrative Portal. It's built with FastAPI and provides API endpoints for managing form submissions, file uploads, and user data.

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **SQLite**: Database (for development)
- **Uvicorn**: ASGI server for running the FastAPI application
- **Pydantic**: Data validation and settings management

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
   python update_tables.py
   ```

## Running the Server

Start the development server with:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will run at **http://localhost:8000**

## API Documentation

Once the server is running, you can access the auto-generated API documentation:

- **Swagger UI**: http://localhost:8000/docs (interactive API testing)
- **ReDoc**: http://localhost:8000/redoc (alternative documentation)

## Available Endpoints

### I-20 Requests
- `POST /api/i20-requests/` - Create new I-20 request (JSON)
- `GET /api/i20-requests/` - Get all I-20 requests
- `GET /api/i20-requests/{id}` - Get specific I-20 request
- `DELETE /api/i20-requests/{id}` - Delete specific I-20 request
- `DELETE /api/i20-requests/` - Delete all I-20 requests

### Academic Training Requests
- `POST /api/academic-training/` - Create new Academic Training request (multipart/form-data with files)
- `GET /api/academic-training/` - Get all Academic Training requests
- `GET /api/academic-training/{id}` - Get specific Academic Training request
- `DELETE /api/academic-training/{id}` - Delete specific request (also deletes associated files)
- `DELETE /api/academic-training/` - Delete all requests (also deletes all associated files)

### Utility
- `GET /` - Root endpoint (welcome message)
- `POST /api/debug/` - Debug endpoint for testing connectivity

## File Upload System

The backend handles file uploads for forms like Academic Training:

### Storage Structure
```
backend/
├── uploads/
│   ├── academic_training/
│   │   ├── offer_letters/
│   │   └── training_authorizations/
│   └── README.md
```

### Features
- Files saved with unique UUID filenames
- Supports files up to 20MB+
- Automatic file deletion when request is deleted
- File paths stored in database JSON field
- Original filenames preserved in metadata

### File Upload Configuration
- Upload endpoint: `/api/academic-training/`
- Content-Type: `multipart/form-data`
- File fields: `offer_letter`, `training_authorization`

## Development

### Project Structure

```
backend/
├── main.py                 # Application entry point
├── create_tables.py        # Legacy table creation script
├── update_tables.py        # Table creation/update script
├── requirements.txt        # Python dependencies
├── sql_app.db             # SQLite database file
├── uploads/               # File upload storage
└── app/                   # Main application package
    ├── models.py          # SQLAlchemy database models
    ├── schemas.py         # Pydantic schemas for validation
    ├── database.py        # Database connection setup
    └── routes.py          # API route definitions
```

### Database Models

**I20Request:**
- student_name, student_id, program
- submission_date, status
- form_data (JSON)
- other_reason (Text)

**AcademicTrainingRequest:**
- student_name, student_id, program
- completion_type (pre/post)
- submission_date, status
- form_data (JSON - includes file paths)
- comments (Text)

### Adding New Endpoints

1. Add model to `app/models.py`
2. Add Pydantic schemas to `app/schemas.py`
3. Add routes to `app/routes.py`
4. Run `python update_tables.py` to create tables
5. Test with Swagger UI at http://localhost:8000/docs

## Database Management

### View Database Contents
```bash
sqlite3 sql_app.db
.tables
SELECT * FROM i20_requests;
SELECT * FROM academic_training_requests;
.quit
```

### Reset Database
```bash
rm sql_app.db
python update_tables.py
```

### Backup Database
```bash
cp sql_app.db sql_app_backup_$(date +%Y%m%d).db
```

## CORS Configuration

CORS is configured to allow all origins in development (`main.py`):
```python
allow_origins=["*"]
```

**For production**, update to specific domains:
```python
allow_origins=["https://yourdomain.com"]
```

## Production Deployment

Recommendations for production:

1. **Database**: Switch to PostgreSQL
   ```bash
   # Update database.py with PostgreSQL URL
   SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
   ```

2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
   
3. **Security**:
   - Add authentication/authorization
   - Enable HTTPS
   - Update CORS settings
   - Set file size limits
   - Implement rate limiting
   - Add input sanitization

4. **Server**:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

## Troubleshooting

### Database locked error
- Close all connections to the database
- Restart the server

### File upload failing
- Check `uploads/` directory exists and is writable
- Verify file size is under limit
- Check disk space

### CORS errors
- Verify CORS middleware is configured
- Check allowed origins in `main.py`

## Testing

Test endpoints using the Swagger UI at http://localhost:8000/docs or with curl:

```bash
# Test debug endpoint
curl -X POST http://localhost:8000/api/debug/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Get all I-20 requests
curl http://localhost:8000/api/i20-requests/
```
