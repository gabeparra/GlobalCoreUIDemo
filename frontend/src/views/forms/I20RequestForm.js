// src/views/LandingForm.js
import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormTextarea,
    CButton, CAlert, CSpinner, CFormCheck,
} from '@coreui/react'

export default function I20RequestForm() {
    const [form, setForm] = useState({
        studentType: '',
        selections: [],
        certificationChecked: false,
        statusChangeMethod: '', // 'within-us' or 'depart-us'
        otherReason: '',
        dependentAction: '', // 'add' or 'remove'
        statusLevel: '',
        statusMajor: '',
        statusStartTerm: '',
        statusStartYear: '',
        programExtEndTerm: '',
        programExtEndYear: '',
        previousMajor: '',
        newMajor: '',
        currentLevel: '',
        newLevel: '',
        departureDate: '',
        plannedReturnDate: '',
        departureItinerary: null,
        returnItinerary: null,
        absenceLevel: '',
        absenceMajor: '',
        absenceStartTerm: '',
        absenceStartYear: '',
        // Dependents array to handle unlimited dependents
        dependents: [{
            relationship: '',
            givenName: '',
            familyName: '',
            legalSex: '',
            dateOfBirth: '',
            cityOfBirth: '',
            countryOfBirth: '',
            countryOfCitizenship: '',
            passport: null
        }],
        // Form fields
        ucfId: '',
        givenName: '',
        familyName: '',
        legalSex: '',
        dateOfBirth: '',
        cityOfBirth: '',
        countryOfBirth: '',
        countryOfCitizenship: '',
        hasUsAddress: true,
        hasNonUsAddress: true,
        usAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: ''
        },
        nonUsAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        ucfEmail: '',
        personalEmail: '',
        usTelephone: '',
        nonUsTelephone: ''
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Debug render check
    console.log('LandingForm rendering')

    // Generic update handler for form fields
    // Uses event destructuring to update any form field
    // and clears any existing error for that field
    const update = (e) => {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value })) // Update form state while preserving other fields
        setErrors((errs) => ({ ...errs, [name]: undefined })) // Clear any error for the updated field
    }

    const validate = () => {
        const e = {}
        if (!form.studentType) e.studentType = 'Please select your student status'
        if (form.studentType === 'current' && form.selections.length === 0) {
            e.selections = 'Please select at least one option'
        }

        if (form.selections.length > 0) {
            // Basic Information
            if (!form.ucfId) e.ucfId = 'UCF ID is required'
            if (!form.givenName) e.givenName = 'Given name is required'
            if (!form.familyName) e.familyName = 'Family name is required'
            if (!form.legalSex) e.legalSex = 'Legal sex is required'
            if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
            if (!form.cityOfBirth) e.cityOfBirth = 'City of birth is required'
            if (!form.countryOfBirth) e.countryOfBirth = 'Country of birth is required'
            if (!form.countryOfCitizenship) e.countryOfCitizenship = 'Country of citizenship is required'

            // Address validation
            if (form.hasUsAddress) {
                if (!form.usAddress.street) e.usAddressStreet = 'Street address is required'
                if (!form.usAddress.city) e.usAddressCity = 'City is required'
                if (!form.usAddress.state) e.usAddressState = 'State is required'
                if (!form.usAddress.postalCode) e.usAddressPostalCode = 'Postal code is required'
            }

            // Non-US Address validation
            if (form.hasNonUsAddress) {
                if (!form.nonUsAddress.street) e.nonUsAddressStreet = 'Street address is required'
                if (!form.nonUsAddress.city) e.nonUsAddressCity = 'City is required'
                if (!form.nonUsAddress.state) e.nonUsAddressState = 'State/Province is required'
                if (!form.nonUsAddress.postalCode) e.nonUsAddressPostalCode = 'Postal code is required'
                if (!form.nonUsAddress.country) e.nonUsAddressCountry = 'Country is required'
            }

            // Contact Information
            if (!form.ucfEmail) e.ucfEmail = 'UCF email is required'
            else if (!/^[^\s@]+@ucf\.edu$/.test(form.ucfEmail)) e.ucfEmail = 'Must be a valid UCF email address'

            if (!form.personalEmail) e.personalEmail = 'Personal email is required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail)) e.personalEmail = 'Must be a valid email address'

            if (!form.usTelephone && !form.nonUsTelephone) {
                e.usTelephone = 'At least one telephone number is required'
                e.nonUsTelephone = 'At least one telephone number is required'
            }

            // Change of Academic Level validation
            if (form.selections.includes('Change of Academic Level')) {
                if (!form.currentLevel) {
                    e.currentLevel = 'Current level is required'
                }
                if (!form.newLevel) {
                    e.newLevel = 'New level is required'
                }
                if (form.currentLevel === form.newLevel) {
                    e.newLevel = 'New level must be different from current level'
                }
            }

            // Change of Major validation
            if (form.selections.includes('Change of Major')) {
                if (!form.previousMajor.trim()) {
                    e.previousMajor = 'Previous major is required'
                }
                if (!form.newMajor.trim()) {
                    e.newMajor = 'New major is required'
                }
            }

            // Program Extension validation
            if (form.selections.includes('Program Extension')) {
                if (!form.programExtEndTerm) {
                    e.programExtEndTerm = 'Please select your desired end term'
                }
                if (!form.programExtEndYear) {
                    e.programExtEndYear = 'Please select your end year'
                }
            }

            // Add or Remove F-2 Dependent validation
            if (form.selections.includes('Add or Remove a F-2 Dependent') && !form.dependentAction) {
                e.dependentAction = 'Please select whether you want to add or remove a dependent'
            }

            // Dependent information validation when adding dependent
            if (form.selections.includes('Add or Remove a F-2 Dependent') && form.dependentAction === 'add') {
                // Validate all dependents
                form.dependents.forEach((dependent, index) => {
                    const prefix = `dependent${index}`;
                    if (!dependent.relationship) e[`${prefix}Relationship`] = 'Relationship is required'
                    if (!dependent.givenName) e[`${prefix}GivenName`] = 'Given name is required'
                    if (!dependent.familyName) e[`${prefix}FamilyName`] = 'Family name is required'
                    if (!dependent.legalSex) e[`${prefix}LegalSex`] = 'Legal sex is required'
                    if (!dependent.dateOfBirth) e[`${prefix}DateOfBirth`] = 'Date of birth is required'
                    if (!dependent.cityOfBirth) e[`${prefix}CityOfBirth`] = 'City of birth is required'
                    if (!dependent.countryOfBirth) e[`${prefix}CountryOfBirth`] = 'Country of birth is required'
                    if (!dependent.countryOfCitizenship) e[`${prefix}CountryOfCitizenship`] = 'Country of citizenship is required'
                    if (!dependent.passport) e[`${prefix}Passport`] = 'Passport copy is required'
                });
            }

            // Other request validation
            if (form.selections.includes('Other') && !form.otherReason.trim()) {
                e.otherReason = 'Please provide a reason for your Form I-20 request'
            }

            // Change of Non-Immigrant Status validation
            if (form.selections.includes('Change of Non-Immigrant Status')) {
                if (!form.statusChangeMethod) {
                    e.statusChangeMethod = 'Please select how you will change your non-immigrant status'
                }
                if (!form.statusLevel) {
                    e.statusLevel = 'Level is required'
                }
                if (!form.statusMajor) {
                    e.statusMajor = 'Major/Program is required'
                }
                if (!form.statusStartTerm) {
                    e.statusStartTerm = 'Start term is required'
                }
                if (!form.statusStartYear) {
                    e.statusStartYear = 'Start year is required'
                }
            }

            // Return from Absence validation
            if (form.selections.includes('Return from Absence of greater than 5 months')) {
                if (!form.absenceLevel) {
                    e.absenceLevel = 'Level is required'
                }
                if (!form.absenceMajor) {
                    e.absenceMajor = 'Major/Program is required'
                }
                if (!form.absenceStartTerm) {
                    e.absenceStartTerm = 'Start term is required'
                }
                if (!form.absenceStartYear) {
                    e.absenceStartYear = 'Start year is required'
                }
            }

            // Return from Authorized Early Withdrawal validation
            if (form.selections.includes('Return from Authorized Early Withdrawal')) {
                if (!form.departureDate) {
                    e.departureDate = 'Date of departure is required'
                }
                if (!form.plannedReturnDate) {
                    e.plannedReturnDate = 'Planned return date is required'
                }
                if (!form.departureItinerary) {
                    e.departureItinerary = 'Departure flight itinerary is required'
                }
                if (!form.returnItinerary) {
                    e.returnItinerary = 'Return flight itinerary is required'
                }
                if (form.departureDate && form.plannedReturnDate) {
                    const departure = new Date(form.departureDate)
                    const plannedReturn = new Date(form.plannedReturnDate)
                    const fiveMonths = 5 * 30 * 24 * 60 * 60 * 1000 // approximate 5 months in milliseconds

                    if (plannedReturn - departure > fiveMonths) {
                        e.plannedReturnDate = 'Must return within 5 months of departure date'
                    }
                    if (plannedReturn <= departure) {
                        e.plannedReturnDate = 'Return date must be after departure date'
                    }
                }
            }

            // Certification check
            if (!form.certificationChecked) {
                e.certificationChecked = 'You must certify that the information is correct'
            }
        }

        // All validations are now handled above
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        if (!validate()) return
        setSubmitting(true)
        try {
            console.log('Submitting form data:', {
                student_name: `${form.givenName} ${form.familyName}`,
                student_id: form.ucfId,
                program: form.selections.join(', ')
            });

            console.log('Sending request to backend...');

            // Process the form data to match backend schema
            // Convert form field names to snake_case for backend
            const processFormData = (formData) => {
                // Helper function to convert camelCase to snake_case
                const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

                // Create a new object with snake_case keys
                const result = {};
                for (const [key, value] of Object.entries(formData)) {
                    if (key === 'usAddress') {
                        result.us_address = {
                            street: value.street,
                            city: value.city,
                            state: value.state,
                            postal_code: value.postalCode
                        };
                    } else if (key === 'nonUsAddress') {
                        result.non_us_address = {
                            street: value.street,
                            city: value.city,
                            state: value.state,
                            postal_code: value.postalCode,
                            country: value.country
                        };
                    } else if (key === 'dependents') {
                        // Process dependents array
                        result.dependents = value.map(dep => ({
                            relationship: dep.relationship,
                            given_name: dep.givenName,
                            family_name: dep.familyName,
                            legal_sex: dep.legalSex,
                            date_of_birth: dep.dateOfBirth,
                            city_of_birth: dep.cityOfBirth,
                            country_of_birth: dep.countryOfBirth,
                            country_of_citizenship: dep.countryOfCitizenship
                        }));
                    } else if (key === 'programExtEndTerm') {
                        result.program_ext_end_term = value;
                    } else if (key === 'programExtEndYear') {
                        result.program_ext_end_year = value;
                    } else {
                        // Convert other camelCase keys to snake_case
                        result[toSnakeCase(key)] = value;
                    }
                }
                return result;
            };

            // Create the complete payload with all form fields
            const processedForm = processFormData(form);

            // Add required fields in the format expected by backend
            const payload = {
                student_name: `${form.givenName} ${form.familyName}`,
                student_id: form.ucfId,
                program: form.selections.join(', '),
                ...processedForm,
                raw_form_data: form // Include original form data for debugging
            };

            console.log('Request payload:', payload);

            // First try the debug endpoint to test connectivity
            try {
                console.log('Testing debug endpoint first...');
                const debugResponse = await fetch('http://localhost:8000/api/debug/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ test: 'Debug request', payload })
                });

                console.log('Debug endpoint response:', debugResponse.status);
                if (debugResponse.ok) {
                    const debugData = await debugResponse.json();
                    console.log('Debug endpoint data:', debugData);
                } else {
                    console.error('Debug endpoint failed:', await debugResponse.text());
                }
            } catch (debugError) {
                console.error('Error with debug endpoint:', debugError);
            }

            // Now try the actual endpoint
            console.log('Now trying the actual endpoint...');
            const response = await fetch('http://localhost:8000/api/i20-requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            console.log('Response status:', response.status);

            if (!response.ok) {
                let errorText = '';
                let errorJson = null;

                try {
                    // Try to parse as JSON first
                    errorJson = await response.json();
                    errorText = JSON.stringify(errorJson);
                } catch (e) {
                    // If not JSON, get as text
                    errorText = await response.text();
                }

                console.error('Server response error:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                    json: errorJson
                });

                throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Form submitted successfully:', data);
            setSubmitted(true);

            // Add a link to view all submissions
            setTimeout(() => {
                window.location.href = '/#/forms/all-requests';
            }, 2000);
            setForm({
                studentType: '',
                selections: [],
                ucfId: '',
                givenName: '',
                familyName: '',
                legalSex: '',
                dateOfBirth: '',
                cityOfBirth: '',
                countryOfBirth: '',
                countryOfCitizenship: '',
                hasUsAddress: true,
                usAddress: { street: '', city: '', state: '', postalCode: '' },
                nonUsAddress: { street: '', city: '', state: '', postalCode: '', country: '' },
                ucfEmail: '',
                personalEmail: '',
                usTelephone: '',
                nonUsTelephone: ''
            })
        } catch (err) {
            setErrors((e) => ({ ...e, _global: 'Something went wrong. Try again.' }))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Get in touch</strong>
                        <small className="ms-2 text-body-secondary">Tell us a bit and we'll reach out.</small>
                    </CCardHeader>
                    <CCardBody>
                        {submitted && <CAlert color="success" className="mb-4">Thanks! Your I-20 request has been submitted successfully. Redirecting to view all submissions...</CAlert>}
                        {errors._global && <CAlert color="danger" className="mb-4">{errors._global}</CAlert>}

                        <CForm onSubmit={onSubmit}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormSelect
                                        label="I am a..."
                                        name="studentType"
                                        value={form.studentType}
                                        onChange={update}
                                        invalid={!!errors.studentType}
                                        feedbackInvalid={errors.studentType}
                                        options={[
                                            { label: 'Choose...', value: '' },
                                            { label: 'Current UCF student', value: 'current' },
                                            { label: 'New incoming UCF student', value: 'new' }
                                        ]}
                                    />
                                </CCol>
                            </CRow>

                            {form.studentType && (
                                <>
                                    {form.studentType === 'new' && (
                                        <CRow className="mb-4">
                                            <CCol xs={12}>
                                                <div className="alert alert-info">
                                                    <h5>Welcome, New Student!</h5>
                                                    <p className="mb-0">
                                                        As a new incoming UCF student, please visit the UCF Global website for information about
                                                        the next steps in your enrollment process. This form is only for current UCF students
                                                        who need to request changes to their status or documentation.
                                                    </p>
                                                </div>
                                            </CCol>
                                        </CRow>
                                    )}
                                    {form.studentType === 'current' && (
                                        <CRow className="mb-4">
                                            <CCol xs={12}>
                                                <h5>Select all that apply:</h5>
                                                <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                                    {[
                                                        'Program Extension',
                                                        'Change of Major',
                                                        'Return from Authorized Early Withdrawal',
                                                        'Change of Academic Level',
                                                        'Return from Absence of greater than 5 months',
                                                        'Change of Non-Immigrant Status',
                                                        'Other'
                                                    ].map((option) => (
                                                        <CFormCheck
                                                            key={option}
                                                            id={`check-${option.toLowerCase().replace(/\s+/g, '-')}`}
                                                            label={option}
                                                            checked={form.selections.includes(option)}
                                                            onChange={() => {
                                                                setForm(f => ({
                                                                    ...f,
                                                                    selections: f.selections.includes(option)
                                                                        ? f.selections.filter(s => s !== option)
                                                                        : [...f.selections, option]
                                                                }))
                                                            }}
                                                        />
                                                    ))}
                                                    <div>
                                                        <CFormCheck
                                                            key="f2-dependent"
                                                            id="check-add-or-remove-a-f-2-dependent"
                                                            label="Add or Remove a F-2 Dependent"
                                                            checked={form.selections.includes('Add or Remove a F-2 Dependent')}
                                                            onChange={() => {
                                                                setForm(f => ({
                                                                    ...f,
                                                                    selections: f.selections.includes('Add or Remove a F-2 Dependent')
                                                                        ? f.selections.filter(s => s !== 'Add or Remove a F-2 Dependent')
                                                                        : [...f.selections, 'Add or Remove a F-2 Dependent']
                                                                }))
                                                            }}
                                                        />
                                                        {form.selections.includes('Add or Remove a F-2 Dependent') && (
                                                            <div className="ms-4 mt-2 mb-2">
                                                                <CFormCheck
                                                                    type="radio"
                                                                    name="dependentAction"
                                                                    id="add-dependent"
                                                                    label="Add Dependent"
                                                                    checked={form.dependentAction === 'add'}
                                                                    onChange={() => setForm(f => ({ ...f, dependentAction: 'add' }))}
                                                                    invalid={!!errors.dependentAction}
                                                                />
                                                                <CFormCheck
                                                                    type="radio"
                                                                    name="dependentAction"
                                                                    id="remove-dependent"
                                                                    label="Remove Dependent"
                                                                    className="mt-1"
                                                                    checked={form.dependentAction === 'remove'}
                                                                    onChange={() => setForm(f => ({ ...f, dependentAction: 'remove' }))}
                                                                    invalid={!!errors.dependentAction}
                                                                />
                                                                {errors.dependentAction && (
                                                                    <div className="text-danger small mt-1">{errors.dependentAction}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {errors.selections && (
                                                    <div className="text-danger small mt-2">{errors.selections}</div>
                                                )}
                                            </CCol>
                                        </CRow>
                                    )}

                                    {(form.studentType === 'current' && form.selections.length > 0) ? (
                                        <>
                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormInput
                                                        label="UCF ID"
                                                        name="ucfId"
                                                        value={form.ucfId}
                                                        onChange={update}
                                                        invalid={!!errors.ucfId}
                                                        feedbackInvalid={errors.ucfId}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormInput
                                                        label="Given Name"
                                                        name="givenName"
                                                        value={form.givenName}
                                                        onChange={update}
                                                        invalid={!!errors.givenName}
                                                        feedbackInvalid={errors.givenName}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormInput
                                                        label="Family Name/Surname"
                                                        name="familyName"
                                                        value={form.familyName}
                                                        onChange={update}
                                                        invalid={!!errors.familyName}
                                                        feedbackInvalid={errors.familyName}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={4}>
                                                    <CFormSelect
                                                        label="Legal Sex"
                                                        name="legalSex"
                                                        value={form.legalSex}
                                                        onChange={update}
                                                        invalid={!!errors.legalSex}
                                                        feedbackInvalid={errors.legalSex}
                                                        options={[
                                                            { label: 'Choose...', value: '' },
                                                            { label: 'Male', value: 'male' },
                                                            { label: 'Female', value: 'female' },
                                                            { label: 'Unknown', value: 'unknown' }
                                                        ]}
                                                    />
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormInput
                                                        type="date"
                                                        label="Date of Birth"
                                                        name="dateOfBirth"
                                                        value={form.dateOfBirth}
                                                        onChange={update}
                                                        invalid={!!errors.dateOfBirth}
                                                        feedbackInvalid={errors.dateOfBirth}
                                                    />
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormInput
                                                        label="City of Birth"
                                                        name="cityOfBirth"
                                                        value={form.cityOfBirth}
                                                        onChange={update}
                                                        invalid={!!errors.cityOfBirth}
                                                        feedbackInvalid={errors.cityOfBirth}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormSelect
                                                        label="Country of Birth"
                                                        name="countryOfBirth"
                                                        value={form.countryOfBirth}
                                                        onChange={update}
                                                        invalid={!!errors.countryOfBirth}
                                                        feedbackInvalid={errors.countryOfBirth}
                                                        options={[
                                                            { label: 'Choose...', value: '' },
                                                            { label: 'United States', value: 'US' },
                                                            // TODO: Add more countries
                                                        ]}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormSelect
                                                        label="Country of Citizenship"
                                                        name="countryOfCitizenship"
                                                        value={form.countryOfCitizenship}
                                                        onChange={update}
                                                        invalid={!!errors.countryOfCitizenship}
                                                        feedbackInvalid={errors.countryOfCitizenship}
                                                        options={[
                                                            { label: 'Choose...', value: '' },
                                                            { label: 'United States', value: 'US' },
                                                            // TODO: Add more countries
                                                        ]}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol xs={12}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h5 className="mb-0">U.S. Address</h5>
                                                        <CFormCheck
                                                            className="ms-3"
                                                            label="I do not have a U.S. address"
                                                            checked={!form.hasUsAddress}
                                                            onChange={(e) => setForm(f => ({ ...f, hasUsAddress: !e.target.checked }))}
                                                        />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            {form.hasUsAddress && (
                                                <CRow className="mb-3">
                                                    <CCol md={12}>
                                                        <CFormInput
                                                            label="Street Address"
                                                            name="usAddress.street"
                                                            value={form.usAddress.street}
                                                            onChange={update}
                                                            invalid={!!errors.usAddressStreet}
                                                            feedbackInvalid={errors.usAddressStreet}
                                                        />
                                                    </CCol>
                                                    <CCol md={4} className="mt-3">
                                                        <CFormInput
                                                            label="City"
                                                            name="usAddress.city"
                                                            value={form.usAddress.city}
                                                            onChange={update}
                                                            invalid={!!errors.usAddressCity}
                                                            feedbackInvalid={errors.usAddressCity}
                                                        />
                                                    </CCol>
                                                    <CCol md={4} className="mt-3">
                                                        <CFormSelect
                                                            label="State"
                                                            name="usAddress.state"
                                                            value={form.usAddress.state}
                                                            onChange={update}
                                                            invalid={!!errors.usAddressState}
                                                            feedbackInvalid={errors.usAddressState}
                                                            options={[
                                                                { label: 'Choose...', value: '' },
                                                                { label: 'Florida', value: 'FL' },
                                                                // TODO: Add more states
                                                            ]}
                                                        />
                                                    </CCol>
                                                    <CCol md={4} className="mt-3">
                                                        <CFormInput
                                                            label="Postal Code"
                                                            name="usAddress.postalCode"
                                                            value={form.usAddress.postalCode}
                                                            onChange={update}
                                                            invalid={!!errors.usAddressPostalCode}
                                                            feedbackInvalid={errors.usAddressPostalCode}
                                                        />
                                                    </CCol>
                                                </CRow>
                                            )}

                                            <CRow className="mb-3">
                                                <CCol xs={12}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h5 className="mb-0">Non-U.S. Address</h5>
                                                        <CFormCheck
                                                            className="ms-3"
                                                            label="I do not have a Non-U.S. address"
                                                            checked={!form.hasNonUsAddress}
                                                            onChange={(e) => setForm(f => ({ ...f, hasNonUsAddress: !e.target.checked }))}
                                                        />
                                                    </div>
                                                </CCol>
                                                {form.hasNonUsAddress && (
                                                    <>
                                                        <CCol md={12}>
                                                            <CFormInput
                                                                label="Street Address"
                                                                name="nonUsAddress.street"
                                                                value={form.nonUsAddress.street}
                                                                onChange={update}
                                                                invalid={!!errors.nonUsAddressStreet}
                                                                feedbackInvalid={errors.nonUsAddressStreet}
                                                            />
                                                        </CCol>
                                                        <CCol md={3} className="mt-3">
                                                            <CFormInput
                                                                label="City"
                                                                name="nonUsAddress.city"
                                                                value={form.nonUsAddress.city}
                                                                onChange={update}
                                                                invalid={!!errors.nonUsAddressCity}
                                                                feedbackInvalid={errors.nonUsAddressCity}
                                                            />
                                                        </CCol>
                                                        <CCol md={3} className="mt-3">
                                                            <CFormInput
                                                                label="State/Province"
                                                                name="nonUsAddress.state"
                                                                value={form.nonUsAddress.state}
                                                                onChange={update}
                                                                invalid={!!errors.nonUsAddressState}
                                                                feedbackInvalid={errors.nonUsAddressState}
                                                            />
                                                        </CCol>
                                                        <CCol md={3} className="mt-3">
                                                            <CFormInput
                                                                label="Postal Code"
                                                                name="nonUsAddress.postalCode"
                                                                value={form.nonUsAddress.postalCode}
                                                                onChange={update}
                                                                invalid={!!errors.nonUsAddressPostalCode}
                                                                feedbackInvalid={errors.nonUsAddressPostalCode}
                                                            />
                                                        </CCol>
                                                        <CCol md={3} className="mt-3">
                                                            <CFormSelect
                                                                label="Country"
                                                                name="nonUsAddress.country"
                                                                value={form.nonUsAddress.country}
                                                                onChange={update}
                                                                invalid={!!errors.nonUsAddressCountry}
                                                                feedbackInvalid={errors.nonUsAddressCountry}
                                                                options={[
                                                                    { label: 'Choose...', value: '' },
                                                                    // TODO: Add countries
                                                                ]}
                                                            />
                                                        </CCol>
                                                    </>
                                                )}
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormInput
                                                        type="email"
                                                        label="UCF Email Address"
                                                        name="ucfEmail"
                                                        value={form.ucfEmail}
                                                        onChange={update}
                                                        invalid={!!errors.ucfEmail}
                                                        feedbackInvalid={errors.ucfEmail}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormInput
                                                        type="email"
                                                        label="Personal Email Address"
                                                        name="personalEmail"
                                                        value={form.personalEmail}
                                                        onChange={update}
                                                        invalid={!!errors.personalEmail}
                                                        feedbackInvalid={errors.personalEmail}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormInput
                                                        type="tel"
                                                        label="U.S. Telephone Number"
                                                        name="usTelephone"
                                                        value={form.usTelephone}
                                                        onChange={update}
                                                        invalid={!!errors.usTelephone}
                                                        feedbackInvalid={errors.usTelephone}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormInput
                                                        type="tel"
                                                        label="Non-U.S. Telephone Number"
                                                        name="nonUsTelephone"
                                                        value={form.nonUsTelephone}
                                                        onChange={update}
                                                        invalid={!!errors.nonUsTelephone}
                                                        feedbackInvalid={errors.nonUsTelephone}
                                                    />
                                                </CCol>
                                            </CRow>

                                            {form.selections.includes('Change of Academic Level') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Change of Academic Level</h5>
                                                        <div className="alert alert-info">
                                                            <p className="mb-0">
                                                                To request a new Form I-20 for a change of academic level, students must show proof
                                                                of admission into the academic program and proof of financial support to participate
                                                                in the program.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Current Level"
                                                                        name="currentLevel"
                                                                        value={form.currentLevel}
                                                                        onChange={update}
                                                                        invalid={!!errors.currentLevel}
                                                                        feedbackInvalid={errors.currentLevel}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Intensive English Program', value: 'iep' },
                                                                            { label: 'UCF Global Achievement Academy', value: 'gaa' },
                                                                            { label: 'Bachelor\'s', value: 'bachelors' },
                                                                            { label: 'Specialist', value: 'specialist' },
                                                                            { label: 'Master\'s', value: 'masters' },
                                                                            { label: 'Doctorate', value: 'doctorate' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="New Level"
                                                                        name="newLevel"
                                                                        value={form.newLevel}
                                                                        onChange={update}
                                                                        invalid={!!errors.newLevel}
                                                                        feedbackInvalid={errors.newLevel}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Intensive English Program', value: 'iep' },
                                                                            { label: 'UCF Global Achievement Academy', value: 'gaa' },
                                                                            { label: 'Bachelor\'s', value: 'bachelors' },
                                                                            { label: 'Specialist', value: 'specialist' },
                                                                            { label: 'Master\'s', value: 'masters' },
                                                                            { label: 'Doctorate', value: 'doctorate' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {form.selections.includes('Change of Major') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Change of Major</h5>
                                                        <div className="alert alert-info">
                                                            <p className="mb-0">
                                                                To request a new Form I-20 for a change of major, the new major must be reflected in myUCF.
                                                                Please check myUCF to verify that a new major has been approved before submitting a request.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        label="Previous Major"
                                                                        name="previousMajor"
                                                                        value={form.previousMajor}
                                                                        onChange={update}
                                                                        invalid={!!errors.previousMajor}
                                                                        feedbackInvalid={errors.previousMajor}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        label="New Major"
                                                                        name="newMajor"
                                                                        value={form.newMajor}
                                                                        onChange={update}
                                                                        invalid={!!errors.newMajor}
                                                                        feedbackInvalid={errors.newMajor}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {form.selections.includes('Program Extension') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Program Extension</h5>
                                                        <div className="alert alert-info">
                                                            <p className="mb-0">
                                                                To request a program extension, students must provide a letter from an academic advisor
                                                                detailing the need for additional time to complete program requirements including an
                                                                expected program end date. Students must also show proof of financial support for the
                                                                extension. Program extensions are limited to one year in length from a student's
                                                                current end date.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Desired End Term"
                                                                        name="programExtEndTerm"
                                                                        value={form.programExtEndTerm}
                                                                        onChange={update}
                                                                        invalid={!!errors.programExtEndTerm}
                                                                        feedbackInvalid={errors.programExtEndTerm}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Spring', value: 'spring' },
                                                                            { label: 'Summer A/C/D', value: 'summer-acd' },
                                                                            { label: 'Summer B', value: 'summer-b' },
                                                                            { label: 'Fall', value: 'fall' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="End Year"
                                                                        name="programExtEndYear"
                                                                        value={form.programExtEndYear}
                                                                        onChange={update}
                                                                        invalid={!!errors.programExtEndYear}
                                                                        feedbackInvalid={errors.programExtEndYear}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: '2025', value: '2025' },
                                                                            { label: '2026', value: '2026' },
                                                                            { label: '2027', value: '2027' },
                                                                            { label: '2028', value: '2028' },
                                                                            { label: '2029', value: '2029' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {form.selections.includes('Return from Absence of greater than 5 months') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Return from Absence of Greater than 5 Months</h5>
                                                        <div className="alert alert-info">
                                                            <p className="mb-0">
                                                                Students who return from an absence of greater than 5 months outside the United States
                                                                will receive a new initial Form I-20 with a new SEVIS ID. This new SEVIS ID will
                                                                require a SEVIS I-901 payment at <a href="http://www.fmjfee.com" target="_blank" rel="noopener noreferrer">www.fmjfee.com</a>.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Level"
                                                                        name="absenceLevel"
                                                                        value={form.absenceLevel}
                                                                        onChange={update}
                                                                        invalid={!!errors.absenceLevel}
                                                                        feedbackInvalid={errors.absenceLevel}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Intensive English Program', value: 'iep' },
                                                                            { label: 'Bachelor\'s', value: 'bachelors' },
                                                                            { label: 'Specialist', value: 'specialist' },
                                                                            { label: 'Master\'s', value: 'masters' },
                                                                            { label: 'Doctoral', value: 'doctoral' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        label="Major/Program"
                                                                        name="absenceMajor"
                                                                        value={form.absenceMajor}
                                                                        onChange={update}
                                                                        invalid={!!errors.absenceMajor}
                                                                        feedbackInvalid={errors.absenceMajor}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className="mt-3">
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Start Term"
                                                                        name="absenceStartTerm"
                                                                        value={form.absenceStartTerm}
                                                                        onChange={update}
                                                                        invalid={!!errors.absenceStartTerm}
                                                                        feedbackInvalid={errors.absenceStartTerm}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Fall', value: 'fall' },
                                                                            { label: 'Spring', value: 'spring' },
                                                                            { label: 'Summer A/C/D', value: 'summer-acd' },
                                                                            { label: 'Summer B', value: 'summer-b' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Start Year"
                                                                        name="absenceStartYear"
                                                                        value={form.absenceStartYear}
                                                                        onChange={update}
                                                                        invalid={!!errors.absenceStartYear}
                                                                        feedbackInvalid={errors.absenceStartYear}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: '2025', value: '2025' },
                                                                            { label: '2026', value: '2026' },
                                                                            { label: '2027', value: '2027' },
                                                                            { label: '2028', value: '2028' },
                                                                            { label: '2029', value: '2029' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {form.selections.includes('Return from Authorized Early Withdrawal') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Return from Authorized Early Withdrawal</h5>
                                                        <div className="alert alert-info">
                                                            <p className="mb-0">
                                                                Requests to return from an Authorized Early Withdrawal must be received at least 60 days
                                                                prior to the start of classes. Students must return to the United States no later than
                                                                5 months after the SEVIS record was terminated for Authorized Early Withdrawal and no
                                                                more than 30 days prior to the start of classes. Requests for a re-activation are
                                                                subject to SEVP approval. If denied by SEVP, students must request a new initial Form I-20.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        type="date"
                                                                        label="Date of Departure from the U.S."
                                                                        name="departureDate"
                                                                        value={form.departureDate || ''}
                                                                        onChange={update}
                                                                        invalid={!!errors.departureDate}
                                                                        feedbackInvalid={errors.departureDate}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        type="date"
                                                                        label="Date of Planned Return into the U.S."
                                                                        name="plannedReturnDate"
                                                                        value={form.plannedReturnDate || ''}
                                                                        onChange={update}
                                                                        invalid={!!errors.plannedReturnDate}
                                                                        feedbackInvalid={errors.plannedReturnDate}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className="mt-3">
                                                                <CCol md={6}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Flight Itinerary - Departing from the U.S.
                                                                        </label>
                                                                        <CFormInput
                                                                            type="file"
                                                                            name="departureItinerary"
                                                                            onChange={(e) => {
                                                                                const file = e.target.files[0];
                                                                                setForm(f => ({
                                                                                    ...f,
                                                                                    departureItinerary: file
                                                                                }));
                                                                            }}
                                                                            invalid={!!errors.departureItinerary}
                                                                            feedbackInvalid={errors.departureItinerary}
                                                                        />
                                                                        <div className="form-text">
                                                                            Please upload your departure flight itinerary (PDF or image)
                                                                        </div>
                                                                    </div>
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Flight Itinerary - Returning to the U.S.
                                                                        </label>
                                                                        <CFormInput
                                                                            type="file"
                                                                            name="returnItinerary"
                                                                            onChange={(e) => {
                                                                                const file = e.target.files[0];
                                                                                setForm(f => ({
                                                                                    ...f,
                                                                                    returnItinerary: file
                                                                                }));
                                                                            }}
                                                                            invalid={!!errors.returnItinerary}
                                                                            feedbackInvalid={errors.returnItinerary}
                                                                        />
                                                                        <div className="form-text">
                                                                            Please upload your return flight itinerary (PDF or image)
                                                                        </div>
                                                                    </div>
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {/* Dynamic F-2 Dependent Form Section
                                                * Only rendered when user selects "Add Dependent" action
                                                * Supports unlimited number of dependents through dynamic array
                                                */}
                                            {(form.selections.includes('Add or Remove a F-2 Dependent') && form.dependentAction === 'add') && (
                                                <>
                                                    {/* Iterate through each dependent entry to generate individual forms
                                                    * Each dependent has its own state in the dependents array
                                                    * Forms include personal info, documents, and removal option
                                                    */}
                                                    {form.dependents.map((dependent, index) => (
                                                        <CRow key={index} className="mb-4">
                                                            <CCol xs={12}>
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <h5>Dependent {index + 1}</h5>
                                                                    {/* Remove Dependent Button
                                                                     * Only shown when there is more than one dependent
                                                                     * Removes the current dependent by filtering the dependents array
                                                                     * Updates state while preserving form data for other dependents
                                                                     */}
                                                                    {form.dependents.length > 1 && (
                                                                        <CButton
                                                                            color="danger"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setForm(f => ({
                                                                                    ...f,
                                                                                    dependents: f.dependents.filter((_, i) => i !== index) // Remove current dependent
                                                                                }));
                                                                            }}
                                                                        >
                                                                            Remove Dependent {index + 1}
                                                                        </CButton>
                                                                    )}
                                                                </div>
                                                                <CRow className="mb-3">
                                                                    <CCol md={6}>
                                                                        <CFormSelect
                                                                            label="Relationship to Student"
                                                                            value={dependent.relationship}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    relationship: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}Relationship`]}
                                                                            feedbackInvalid={errors[`dependent${index}Relationship`]}
                                                                            options={[
                                                                                { label: 'Choose...', value: '' },
                                                                                { label: 'Spouse', value: 'spouse' },
                                                                                { label: 'Child', value: 'child' }
                                                                            ]}
                                                                        />
                                                                    </CCol>
                                                                </CRow>
                                                                <CRow className="mb-3">
                                                                    <CCol md={6}>
                                                                        <CFormInput
                                                                            label="Given Name"
                                                                            value={dependent.givenName}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    givenName: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}GivenName`]}
                                                                            feedbackInvalid={errors[`dependent${index}GivenName`]}
                                                                        />
                                                                    </CCol>
                                                                    <CCol md={6}>
                                                                        <CFormInput
                                                                            label="Family Name/Surname"
                                                                            value={dependent.familyName}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    familyName: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}FamilyName`]}
                                                                            feedbackInvalid={errors[`dependent${index}FamilyName`]}
                                                                        />
                                                                    </CCol>
                                                                </CRow>
                                                                <CRow className="mb-3">
                                                                    <CCol md={4}>
                                                                        <CFormSelect
                                                                            label="Legal Sex"
                                                                            value={dependent.legalSex}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    legalSex: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}LegalSex`]}
                                                                            feedbackInvalid={errors[`dependent${index}LegalSex`]}
                                                                            options={[
                                                                                { label: 'Choose...', value: '' },
                                                                                { label: 'Male', value: 'male' },
                                                                                { label: 'Female', value: 'female' },
                                                                                { label: 'Unknown', value: 'unknown' }
                                                                            ]}
                                                                        />
                                                                    </CCol>
                                                                    <CCol md={4}>
                                                                        <CFormInput
                                                                            type="date"
                                                                            label="Date of Birth"
                                                                            value={dependent.dateOfBirth}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    dateOfBirth: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}DateOfBirth`]}
                                                                            feedbackInvalid={errors[`dependent${index}DateOfBirth`]}
                                                                        />
                                                                    </CCol>
                                                                    <CCol md={4}>
                                                                        <CFormInput
                                                                            label="City of Birth"
                                                                            value={dependent.cityOfBirth}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    cityOfBirth: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}CityOfBirth`]}
                                                                            feedbackInvalid={errors[`dependent${index}CityOfBirth`]}
                                                                        />
                                                                    </CCol>
                                                                </CRow>
                                                                <CRow className="mb-3">
                                                                    <CCol md={6}>
                                                                        <CFormSelect
                                                                            label="Country of Birth"
                                                                            value={dependent.countryOfBirth}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    countryOfBirth: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}CountryOfBirth`]}
                                                                            feedbackInvalid={errors[`dependent${index}CountryOfBirth`]}
                                                                            options={[
                                                                                { label: 'Choose...', value: '' },
                                                                                { label: 'United States', value: 'US' },
                                                                                // TODO: Add more countries
                                                                            ]}
                                                                        />
                                                                    </CCol>
                                                                    <CCol md={6}>
                                                                        <CFormSelect
                                                                            label="Country of Citizenship"
                                                                            value={dependent.countryOfCitizenship}
                                                                            onChange={(e) => {
                                                                                const newDependents = [...form.dependents];
                                                                                newDependents[index] = {
                                                                                    ...newDependents[index],
                                                                                    countryOfCitizenship: e.target.value
                                                                                };
                                                                                setForm(f => ({ ...f, dependents: newDependents }));
                                                                            }}
                                                                            invalid={!!errors[`dependent${index}CountryOfCitizenship`]}
                                                                            feedbackInvalid={errors[`dependent${index}CountryOfCitizenship`]}
                                                                            options={[
                                                                                { label: 'Choose...', value: '' },
                                                                                { label: 'United States', value: 'US' },
                                                                                // TODO: Add more countries
                                                                            ]}
                                                                        />
                                                                    </CCol>
                                                                </CRow>
                                                                <CRow className="mb-4">
                                                                    <CCol md={12}>
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Dependent Passport</label>
                                                                            <CFormInput
                                                                                type="file"
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files[0];
                                                                                    const newDependents = [...form.dependents];
                                                                                    newDependents[index] = {
                                                                                        ...newDependents[index],
                                                                                        passport: file
                                                                                    };
                                                                                    setForm(f => ({ ...f, dependents: newDependents }));
                                                                                }}
                                                                                invalid={!!errors[`dependent${index}Passport`]}
                                                                                feedbackInvalid={errors[`dependent${index}Passport`]}
                                                                            />
                                                                        </div>
                                                                    </CCol>
                                                                </CRow>
                                                                {/* Add Another Dependent Button
                                                                 * Only shown after the last dependent's form
                                                                 * Adds a new empty dependent object to the array
                                                                 * Enables unlimited dependent additions
                                                                 */}
                                                                {index === form.dependents.length - 1 && (
                                                                    <CButton
                                                                        color="primary"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setForm(f => ({
                                                                                ...f,
                                                                                dependents: [
                                                                                    ...f.dependents,
                                                                                    {   // Initialize new dependent with empty values
                                                                                        relationship: '',
                                                                                        givenName: '',
                                                                                        familyName: '',
                                                                                        legalSex: '',
                                                                                        dateOfBirth: '',
                                                                                        cityOfBirth: '',
                                                                                        countryOfBirth: '',
                                                                                        countryOfCitizenship: '',
                                                                                        passport: null
                                                                                    }
                                                                                ]
                                                                            }));
                                                                        }}
                                                                    >
                                                                        Add Another Dependent
                                                                    </CButton>
                                                                )}
                                                            </CCol>
                                                        </CRow>
                                                    ))}
                                                </>
                                            )}

                                            {form.selections.includes('Other') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Other Request</h5>
                                                        <div className="alert alert-info mb-3">
                                                            <p className="mb-0">
                                                                Additional documentation may be required after review by UCF Global.
                                                            </p>
                                                        </div>
                                                        <CFormTextarea
                                                            label="Reason for Form I-20 request:"
                                                            name="otherReason"
                                                            value={form.otherReason}
                                                            onChange={update}
                                                            invalid={!!errors.otherReason}
                                                            feedbackInvalid={errors.otherReason}
                                                            rows={5}
                                                        />
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {form.selections.includes('Change of Non-Immigrant Status') && (
                                                <CRow className="mb-4">
                                                    <CCol xs={12}>
                                                        <h5>Change of Non-immigrant Status</h5>
                                                        <div className="alert alert-warning">
                                                            <p className="mb-0">
                                                                UCF Global strongly recommends that students apply for an F-1 visa at a US Embassy or Consulate
                                                                outside the United States due to the lengthy USCIS processing times and routine denials of
                                                                Form I-539 "Change of Status" applications within the United States. Students who choose to
                                                                apply for a change of status within the United States are urged to seek legal counsel from
                                                                a qualified immigration attorney.
                                                            </p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <CFormCheck
                                                                name="statusChange"
                                                                id="within-us"
                                                                label="I will be changing my non-immigrant status from within the United States"
                                                                checked={form.statusChangeMethod === 'within-us'}
                                                                onChange={() => setForm(f => ({ ...f, statusChangeMethod: 'within-us' }))}
                                                                invalid={!!errors.statusChangeMethod}
                                                            />
                                                            <CFormCheck
                                                                name="statusChange"
                                                                id="depart-us"
                                                                className="mt-2 mb-4"
                                                                label="I will be departing the United States to obtain an F-1 visa and plan to re-enter the United States in F-1 status"
                                                                checked={form.statusChangeMethod === 'depart-us'}
                                                                onChange={() => setForm(f => ({ ...f, statusChangeMethod: 'depart-us' }))}
                                                                invalid={!!errors.statusChangeMethod}
                                                            />
                                                            {errors.statusChangeMethod && (
                                                                <div className="invalid-feedback d-block">{errors.statusChangeMethod}</div>
                                                            )}

                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Level"
                                                                        name="statusLevel"
                                                                        value={form.statusLevel}
                                                                        onChange={update}
                                                                        invalid={!!errors.statusLevel}
                                                                        feedbackInvalid={errors.statusLevel}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Intensive English Program', value: 'iep' },
                                                                            { label: 'Bachelor\'s', value: 'bachelors' },
                                                                            { label: 'Specialist', value: 'specialist' },
                                                                            { label: 'Master\'s', value: 'masters' },
                                                                            { label: 'Doctoral', value: 'doctoral' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormInput
                                                                        label="Major/Program"
                                                                        name="statusMajor"
                                                                        value={form.statusMajor}
                                                                        onChange={update}
                                                                        invalid={!!errors.statusMajor}
                                                                        feedbackInvalid={errors.statusMajor}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                            <CRow className="mt-3">
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Start Term"
                                                                        name="statusStartTerm"
                                                                        value={form.statusStartTerm}
                                                                        onChange={update}
                                                                        invalid={!!errors.statusStartTerm}
                                                                        feedbackInvalid={errors.statusStartTerm}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: 'Fall', value: 'fall' },
                                                                            { label: 'Spring', value: 'spring' },
                                                                            { label: 'Summer A/C/D', value: 'summer-acd' },
                                                                            { label: 'Summer B', value: 'summer-b' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <CFormSelect
                                                                        label="Start Year"
                                                                        name="statusStartYear"
                                                                        value={form.statusStartYear}
                                                                        onChange={update}
                                                                        invalid={!!errors.statusStartYear}
                                                                        feedbackInvalid={errors.statusStartYear}
                                                                        options={[
                                                                            { label: 'Choose...', value: '' },
                                                                            { label: '2025', value: '2025' },
                                                                            { label: '2026', value: '2026' },
                                                                            { label: '2027', value: '2027' },
                                                                            { label: '2028', value: '2028' },
                                                                            { label: '2029', value: '2029' }
                                                                        ]}
                                                                    />
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            )}
                                            <CRow className="mb-4">
                                                <CCol xs={12}>
                                                    <CFormCheck
                                                        id="certification-check"
                                                        label="I hereby certify that the above information is correct and up to date."
                                                        checked={form.certificationChecked}
                                                        onChange={(e) => setForm(f => ({ ...f, certificationChecked: e.target.checked }))}
                                                        invalid={!!errors.certificationChecked}
                                                        feedbackInvalid={errors.certificationChecked}
                                                    />
                                                </CCol>
                                            </CRow>
                                        </>
                                    ) : null}

                                    <div className="d-flex gap-2">
                                        <CButton type="submit" disabled={submitting || !form.certificationChecked}>
                                            {submitting ? <><CSpinner size="sm" />&nbsp;Sending…</> : 'Send'}
                                        </CButton>
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            variant="outline"
                                            disabled={submitting}
                                            onClick={() => {
                                                setForm({
                                                    studentType: '',
                                                    selections: [],
                                                    otherReason: '',
                                                    dependentAction: '',
                                                    ucfId: '',
                                                    givenName: '',
                                                    familyName: '',
                                                    legalSex: '',
                                                    dateOfBirth: '',
                                                    cityOfBirth: '',
                                                    countryOfBirth: '',
                                                    countryOfCitizenship: '',
                                                    hasUsAddress: true,
                                                    certificationChecked: false,
                                                    statusChangeMethod: '',
                                                    statusLevel: '',
                                                    statusMajor: '',
                                                    statusStartTerm: '',
                                                    statusStartYear: '',
                                                    programExtEndTerm: '',
                                                    programExtEndYear: '',
                                                    previousMajor: '',
                                                    newMajor: '',
                                                    currentLevel: '',
                                                    newLevel: '',
                                                    departureDate: '',
                                                    plannedReturnDate: '',
                                                    departureItinerary: null,
                                                    returnItinerary: null,
                                                    absenceLevel: '',
                                                    absenceMajor: '',
                                                    absenceStartTerm: '',
                                                    absenceStartYear: '',
                                                    hasNonUsAddress: true,
                                                    usAddress: { street: '', city: '', state: '', postalCode: '' },
                                                    nonUsAddress: { street: '', city: '', state: '', postalCode: '', country: '' },
                                                    ucfEmail: '',
                                                    personalEmail: '',
                                                    usTelephone: '',
                                                    nonUsTelephone: '',
                                                    // Reset dependent fields
                                                    dependents: [{
                                                        relationship: '',
                                                        givenName: '',
                                                        familyName: '',
                                                        legalSex: '',
                                                        dateOfBirth: '',
                                                        cityOfBirth: '',
                                                        countryOfBirth: '',
                                                        countryOfCitizenship: '',
                                                        passport: null
                                                    }]
                                                });
                                                setErrors({});
                                            }}
                                        >
                                            Clear
                                        </CButton>
                                    </div>
                                </>
                            )}
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
