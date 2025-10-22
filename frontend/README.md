# UCF Global Administrative Portal - Frontend

This is the frontend application for the UCF Global Administrative Portal. It's built with React and CoreUI components, providing a user interface for submitting and managing various administrative forms.

## Technology Stack

- React: JavaScript library for building user interfaces
- CoreUI: UI component library for React
- React Router: Navigation and routing
- Vite: Build tool and development server

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will be available at http://localhost:5173

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

1. **I-20 Request Form**: For requesting a new I-20 document
2. **Academic Training Form**: For requesting academic training authorization
3. **Administrative Record Change Form**: For requesting changes to administrative records

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

### Adding a New Form

To add a new form:

1. Create a new form component in `src/views/forms/`
2. Add the route in `src/routes.js`
3. Add a navigation item in `src/_nav.js`
4. Update the AllRequestsList component to handle the new form type

### Styling

The application uses SCSS for styling. Global styles are in `src/scss/` and component-specific styles can be added in their respective files.