# UCF Global Administrative Portal

A comprehensive web application for UCF Global that manages various administrative forms and requests for international students. Built with React, CoreUI, and FastAPI.

## Project Structure

```
CoreUI-demo-UCF/
├── frontend/          # React + CoreUI application
│   ├── src/
│   │   ├── views/forms/    # Form components
│   │   ├── _nav.js         # Navigation config
│   │   └── routes.js       # Route definitions
│   ├── .env.example        # Environment variables template
│   └── vite.config.mjs     # Vite configuration (port 3000)
├── backend/           # FastAPI server
│   ├── app/
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── routes.py       # API endpoints
│   ├── uploads/            # File upload storage
│   └── sql_app.db         # SQLite database
└── README.md          # This file
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **CoreUI React** - Component library
- **Vite** - Build tool (configured for port 3000)
- **React Router** - Navigation

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or yarn
- **pip** (Python package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd CoreUI-demo-UCF
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python update_tables.py  # Create database tables
   cd ..
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Optional: Add test data placeholders
   cd ..
   ```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### 2. Start the Frontend (in a new terminal)

```bash
cd frontend
npm start
```

Frontend App: **http://localhost:3000**

## Features

### Available Forms

**Student Services:**
1. **I-20 Request Form** - New I-20, program changes, travel signatures, dependent actions
2. **Academic Training Form** - J-1 academic training authorization with file uploads (up to 20MB)
3. **Administrative Record Change** - Request record changes
4. **Document Request** - Official documents and transcripts
5. **Exit Form** - Exit procedures and clearance
6. **Conversation Partner** - Language practice program registration

**Additional Services:**
7. **Florida Statute 101035** - Immigration documentation
8. **Leave Request** - Sick leave, vacation, administrative leave
9. **Linkages Application** - New application or renewal
10. **Off-Campus Housing** - Housing application
11. **OPT/STEM Extension Reporting** - Employment reporting

### Admin Dashboard

- **View all submissions** across all form types
- **Filter by form type** (I-20, Academic Training, etc.)
- **Individual delete** - Remove single requests
- **Multi-select delete** - Delete multiple requests at once
- **Bulk delete** - Clear all requests
- **Detailed view modal** - See complete submission data
- **File tracking** - View uploaded file paths

### File Upload System

- **Production-ready** multipart/form-data implementation
- Handles files up to **20MB+**
- Files stored in organized directories
- **Automatic cleanup** when requests are deleted
- File paths stored in database for reference

## Environment Variables

For testing, you can pre-fill forms with placeholder data:

```bash
cd frontend
cp .env.example .env
# Edit .env with your test values
```

See `frontend/ENV_SETUP.md` for detailed documentation.

**⚠️ Important:** The `.env` file is gitignored and should NEVER be committed to version control.

## API Endpoints

### I-20 Requests
- `POST /api/i20-requests/` - Create request
- `GET /api/i20-requests/` - List all requests
- `GET /api/i20-requests/{id}` - Get specific request
- `DELETE /api/i20-requests/{id}` - Delete specific request
- `DELETE /api/i20-requests/` - Delete all requests

### Academic Training Requests
- `POST /api/academic-training/` - Create request (multipart/form-data)
- `GET /api/academic-training/` - List all requests
- `GET /api/academic-training/{id}` - Get specific request
- `DELETE /api/academic-training/{id}` - Delete specific request (includes files)
- `DELETE /api/academic-training/` - Delete all requests (includes files)

### Debug
- `POST /api/debug/` - Debug endpoint for testing connectivity

## Database

The application uses **SQLite** for data storage:
- Location: `backend/sql_app.db`
- Tables: `i20_requests`, `academic_training_requests`
- Form data stored as JSON for flexibility

To reset the database:
```bash
cd backend
rm sql_app.db
python update_tables.py
```

## Security Notes

- All file uploads are stored outside the web root
- `.env` files are gitignored
- CORS is configured for development (update for production)
- Input validation on both frontend and backend
- File uploads use unique UUID filenames

## Development Notes

- Frontend runs on port **3000** (configured in `vite.config.mjs`)
- Backend runs on port **8000**
- Hot reload enabled for both frontend and backend
- Detailed console logging for debugging

## Production Deployment

For production:
1. Remove or empty `.env` file
2. Update CORS settings in `backend/main.py`
3. Use a production database (PostgreSQL recommended)
4. Configure file storage (S3, GCS, or similar)
5. Set up proper authentication/authorization
6. Enable HTTPS
7. Configure file size limits in FastAPI

## Troubleshooting

### Frontend not loading
- Check if backend is running on port 8000
- Verify CORS is properly configured
- Check browser console for errors

### Form submission failing
- Check backend logs for detailed errors
- Verify API endpoint URLs are correct
- Check network tab in browser dev tools

### File upload issues
- Verify `uploads/` directory exists
- Check file size (must be under 20MB by default)
- Ensure backend has write permissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

