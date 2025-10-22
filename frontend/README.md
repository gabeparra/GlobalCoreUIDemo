# UCF Global Administrative Portal - Frontend

This is the frontend application for the UCF Global Administrative Portal. It's built with React and CoreUI components, providing a user interface for submitting and managing various administrative forms.

## Technology Stack

- **React 19**: JavaScript library for building user interfaces
- **CoreUI React**: UI component library for React
- **React Router DOM**: Navigation and routing
- **Vite**: Build tool and development server (configured for port 3000)

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (for testing):

```bash
cp .env.example .env
# Edit .env and add your test values (optional - see ENV_SETUP.md)
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will be available at **http://localhost:3000**

**Note:** The port is configured to 3000 in `vite.config.mjs` (not the default Vite port of 5173)

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```bash
npm run serve
```

## Available Forms

The application includes the following forms:

### Student Services
1. **I-20 Request Form**: Request new I-20 documents, program changes, travel signatures, and dependent actions
2. **Academic Training Form**: Request academic training authorization (J-1 students) with file uploads
3. **Administrative Record Change Form**: Request changes to administrative records
4. **Document Request**: Request official documents and transcripts
5. **Exit Form**: Complete exit procedures and clearance
6. **Conversation Partner**: Register for conversation partner program

### Additional Forms
7. **Florida Statute 101035**: Immigration-related documentation
8. **Leave Request**: Submit leave requests (sick, vacation, administrative)
9. **Linkages Application**: Apply for linkages program (new/renewal)
10. **Off-Campus Housing Application**: Apply for off-campus housing
11. **OPT and STEM Extension Reporting**: Report employment for OPT/STEM extensions

### Admin Features
- **All Requests List**: View, filter, and manage all form submissions
  - View detailed submission data
  - Delete individual or multiple requests
  - Filter by form type
  - See uploaded file paths

## Project Structure

- `src/`: Source code
  - `components/`: Reusable UI components
  - `views/`: Page components
    - `forms/`: Form components
  - `layout/`: Layout components
  - `_nav.js`: Navigation configuration
  - `routes.js`: Route definitions
  - `App.js`: Main application component

## Development

### Environment Variables

The application uses environment variables for test data placeholders. See `ENV_SETUP.md` for complete documentation.

**Important:** The `.env` file is gitignored and contains sensitive test data. Never commit it to version control.

### Adding a New Form

To add a new form:

1. Create a new form component in `src/views/forms/`
2. Add the route in `src/routes.js` with lazy loading
3. Add a navigation item in `src/_nav.js`
4. Add a card to `src/views/LandingPage.js`
5. Update the backend API if form submission is needed
6. Update `AllRequestsList.js` to display the new form type

### File Uploads

Forms that need file uploads (like Academic Training) use **FormData** instead of JSON:
- Supports files up to 20MB+
- Files are streamed to the backend
- Backend stores files in `uploads/` directory
- File paths are saved in the database

### Styling

The application uses SCSS for styling. Global styles are in `src/scss/` and component-specific styles can be added in their respective files.

## API Integration

The frontend connects to a FastAPI backend running on `http://localhost:8000`

Main endpoints:
- `POST /api/i20-requests/` - Submit I-20 request
- `POST /api/academic-training/` - Submit Academic Training request (multipart/form-data)
- `GET /api/i20-requests/` - Get all I-20 requests
- `GET /api/academic-training/` - Get all Academic Training requests
- `DELETE /api/i20-requests/{id}` - Delete specific I-20 request
- `DELETE /api/academic-training/{id}` - Delete specific Academic Training request