# Environment Variables Setup

This project uses environment variables to store sensitive placeholder data for testing purposes.

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

## Academic Training Form Placeholders

The following environment variables are used for the Academic Training form:

### Personal Information
- `REACT_APP_PLACEHOLDER_UCF_ID` - UCF Student ID
- `REACT_APP_PLACEHOLDER_SEVIS_ID` - SEVIS ID
- `REACT_APP_PLACEHOLDER_GIVEN_NAME` - Given/First Name
- `REACT_APP_PLACEHOLDER_FAMILY_NAME` - Family/Last Name
- `REACT_APP_PLACEHOLDER_LEGAL_SEX` - Legal Sex
- `REACT_APP_PLACEHOLDER_DATE_OF_BIRTH` - Date of Birth (YYYY-MM-DD)
- `REACT_APP_PLACEHOLDER_CITY_OF_BIRTH` - City of Birth
- `REACT_APP_PLACEHOLDER_COUNTRY_OF_BIRTH` - Country of Birth (2-letter code)
- `REACT_APP_PLACEHOLDER_COUNTRY_OF_CITIZENSHIP` - Country of Citizenship
- `REACT_APP_PLACEHOLDER_COUNTRY_OF_LEGAL_RESIDENCE` - Country of Legal Residence

### Address
- `REACT_APP_PLACEHOLDER_STREET_ADDRESS` - Street Address
- `REACT_APP_PLACEHOLDER_CITY` - City
- `REACT_APP_PLACEHOLDER_STATE` - State (2-letter code)
- `REACT_APP_PLACEHOLDER_COUNTRY` - Country (2-letter code)

### Contact
- `REACT_APP_PLACEHOLDER_US_TELEPHONE` - US Telephone Number

### Training Dates
- `REACT_APP_PLACEHOLDER_TRAINING_START_DATE` - Training Start Date (YYYY-MM-DD)
- `REACT_APP_PLACEHOLDER_TRAINING_END_DATE` - Training End Date (YYYY-MM-DD)

### Other
- `REACT_APP_PLACEHOLDER_COMMENTS` - Default comments text

## Development Server

After modifying `.env`, you need to restart the development server for changes to take effect:

```bash
npm start
```

## Production

For production, these environment variables should be empty or removed, requiring users to manually fill in the form.

