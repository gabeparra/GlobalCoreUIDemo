# UCF Global Administrative Portal

This project is a web application for UCF Global that manages various administrative forms and requests, including I-20 requests, Academic Training forms, and Administrative Record Change forms.

## Project Structure

The project is divided into two main parts:

- **Frontend**: A React application built with CoreUI components
- **Backend**: A FastAPI server that handles data storage and retrieval

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CoreUI-demo-UCF
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running the Application

### Start the Backend Server

```bash
cd backend
uvicorn main:app --reload
```

The backend API will be available at http://localhost:8000

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will be available at http://localhost:5173

## Features

- I-20 Request Form
- Academic Training Form
- Administrative Record Change Form
- Form submissions listing and management
- Detailed view of submitted requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

