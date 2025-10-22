# Environment Variables Setup

This project uses **Vite** as the build tool, which requires environment variables to be prefixed with `VITE_` (not `REACT_APP_`).

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your test values in `.env`:**
   - Open `.env` and add your test data
   - These values will be used as placeholder data in forms for testing

3. **Important Notes:**
   - The `.env` file is **gitignored** and will NOT be committed to GitHub
   - Never commit sensitive data or real user information
   - The `.env.example` file shows the structure but contains no actual values
   - **Must restart dev server** after changing `.env` (Vite reads it only on startup)

## Vite Environment Variables

### Accessing in Code
```javascript
// Use import.meta.env (Vite syntax)
const value = import.meta.env.VITE_PLACEHOLDER_UCF_ID

// NOT process.env (that's for Create React App)
```

### Variable Prefix
- All environment variables **must** start with `VITE_`
- Variables without `VITE_` prefix are not exposed to the frontend
- Example: `VITE_PLACEHOLDER_UCF_ID` ✅ | `PLACEHOLDER_UCF_ID` ❌

## Academic Training Form Placeholders

The following environment variables are used for the Academic Training form:

### Personal Information
- `VITE_PLACEHOLDER_UCF_ID` - UCF Student ID
- `VITE_PLACEHOLDER_SEVIS_ID` - SEVIS ID
- `VITE_PLACEHOLDER_GIVEN_NAME` - Given/First Name
- `VITE_PLACEHOLDER_FAMILY_NAME` - Family/Last Name
- `VITE_PLACEHOLDER_LEGAL_SEX` - Legal Sex
- `VITE_PLACEHOLDER_DATE_OF_BIRTH` - Date of Birth (YYYY-MM-DD)
- `VITE_PLACEHOLDER_CITY_OF_BIRTH` - City of Birth
- `VITE_PLACEHOLDER_COUNTRY_OF_BIRTH` - Country of Birth (2-letter code)
- `VITE_PLACEHOLDER_COUNTRY_OF_CITIZENSHIP` - Country of Citizenship
- `VITE_PLACEHOLDER_COUNTRY_OF_LEGAL_RESIDENCE` - Country of Legal Residence

### Address
- `VITE_PLACEHOLDER_STREET_ADDRESS` - Street Address
- `VITE_PLACEHOLDER_CITY` - City
- `VITE_PLACEHOLDER_STATE` - State (2-letter code)
- `VITE_PLACEHOLDER_COUNTRY` - Country (2-letter code)

### Contact
- `VITE_PLACEHOLDER_US_TELEPHONE` - US Telephone Number
- `VITE_PLACEHOLDER_STUDENT_EMAIL` - UCF Student Email Address

### Training Dates
- `VITE_PLACEHOLDER_TRAINING_START_DATE` - Training Start Date (YYYY-MM-DD)
- `VITE_PLACEHOLDER_TRAINING_END_DATE` - Training End Date (YYYY-MM-DD)

### Other
- `VITE_PLACEHOLDER_COMMENTS` - Default comments text

## Development Server

After modifying `.env`, you need to restart the development server for changes to take effect:

```bash
npm start
```

## Production

For production, these environment variables should be empty or removed, requiring users to manually fill in the form.

