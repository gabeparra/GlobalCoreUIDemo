// src/views/forms/AcademicTrainingForm.js
import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormTextarea,
    CButton, CAlert, CSpinner, CFormCheck, CFormLabel
} from '@coreui/react'

export default function AcademicTrainingForm() {
    console.log('AcademicTrainingForm component loaded');

    const [form, setForm] = useState({
        // Pre/Post Completion
        completionType: 'pre',

        // Personal Information - Use environment variables or empty strings
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        sevisId: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || '',
        givenName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        familyName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        legalSex: import.meta.env.VITE_PLACEHOLDER_LEGAL_SEX || '',
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || '',
        cityOfBirth: import.meta.env.VITE_PLACEHOLDER_CITY_OF_BIRTH || '',
        countryOfBirth: import.meta.env.VITE_PLACEHOLDER_COUNTRY_OF_BIRTH || '',
        countryOfCitizenship: import.meta.env.VITE_PLACEHOLDER_COUNTRY_OF_CITIZENSHIP || '',
        countryOfLegalResidence: import.meta.env.VITE_PLACEHOLDER_COUNTRY_OF_LEGAL_RESIDENCE || '',

        // U.S. Address
        hasUsAddress: true,
        streetAddress: import.meta.env.VITE_PLACEHOLDER_STREET_ADDRESS || '',
        city: import.meta.env.VITE_PLACEHOLDER_CITY || '',
        state: import.meta.env.VITE_PLACEHOLDER_STATE || '',
        country: import.meta.env.VITE_PLACEHOLDER_COUNTRY || '',

        // Contact Information
        usTelephone: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '',
        nonUsTelephone: '',

        // Questionnaire
        enrolledFullTime: true,
        academicTrainingStartDate: import.meta.env.VITE_PLACEHOLDER_TRAINING_START_DATE || '',
        academicTrainingEndDate: import.meta.env.VITE_PLACEHOLDER_TRAINING_END_DATE || '',
        employedOnCampus: false,
        previouslyAuthorized: false,

        // Documents
        offerLetter: null,
        trainingAuthorization: null,

        // Statements of Agreement
        understandPreCompletion: true,
        understandPostCompletion: false,
        understandMedicalInsurance: true,
        understandEmployerSpecific: true,
        understandConsultAdvisor: true,

        // Submission
        comments: import.meta.env.VITE_PLACEHOLDER_COMMENTS || '',
        certifyInformation: true
    })

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Generic update handler for form fields
    const update = (e) => {
        const { name, value, type, checked } = e.target
        setForm((f) => ({
            ...f,
            [name]: type === 'checkbox' ? checked : value
        }))
        setErrors((errs) => ({ ...errs, [name]: undefined }))
    }

    // Handle file uploads
    const handleFileUpload = (e) => {
        const { name, files } = e.target
        if (files && files[0]) {
            setForm((f) => ({ ...f, [name]: files[0] }))
            setErrors((errs) => ({ ...errs, [name]: undefined }))
        }
    }

    const validate = () => {
        const e = {}

        // Required fields validation
        if (!form.ucfId) e.ucfId = 'UCF ID is required'
        if (!form.sevisId) e.sevisId = 'SEVIS ID is required'
        if (!form.givenName) e.givenName = 'Given name is required'
        if (!form.familyName) e.familyName = 'Family name is required'
        if (!form.legalSex) e.legalSex = 'Legal sex is required'
        if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
        if (!form.cityOfBirth) e.cityOfBirth = 'City of birth is required'
        if (!form.countryOfBirth) e.countryOfBirth = 'Country of birth is required'
        if (!form.countryOfCitizenship) e.countryOfCitizenship = 'Country of citizenship is required'
        if (!form.countryOfLegalResidence) e.countryOfLegalResidence = 'Country of legal permanent residence is required'

        // Address validation
        if (form.hasUsAddress) {
            if (!form.streetAddress) e.streetAddress = 'Street address is required'
            if (!form.city) e.city = 'City is required'
            if (!form.state) e.state = 'State is required'
            if (!form.country) e.country = 'Country is required'
        }

        // Contact information
        if (!form.usTelephone && !form.nonUsTelephone) {
            e.usTelephone = 'At least one telephone number is required'
            e.nonUsTelephone = 'At least one telephone number is required'
        }

        // Questionnaire
        if (!form.academicTrainingStartDate) e.academicTrainingStartDate = 'Academic training start date is required'
        if (!form.academicTrainingEndDate) e.academicTrainingEndDate = 'Academic training end date is required'

        // Date validation
        if (form.academicTrainingStartDate && form.academicTrainingEndDate) {
            const startDate = new Date(form.academicTrainingStartDate)
            const endDate = new Date(form.academicTrainingEndDate)

            if (endDate <= startDate) {
                e.academicTrainingEndDate = 'End date must be after start date'
            }
        }

        // Documents (temporarily commented out for testing with placeholder data)
        // if (!form.offerLetter) e.offerLetter = 'Signed offer letter is required'
        // if (!form.trainingAuthorization) e.trainingAuthorization = 'Completed Academic Authorization Training Form is required'

        // Statements of Agreement
        if (form.completionType === 'pre' && !form.understandPreCompletion) {
            e.understandPreCompletion = 'You must agree to this statement'
        }
        if (form.completionType === 'post' && !form.understandPostCompletion) {
            e.understandPostCompletion = 'You must agree to this statement'
        }
        if (!form.understandMedicalInsurance) e.understandMedicalInsurance = 'You must agree to this statement'
        if (!form.understandEmployerSpecific) e.understandEmployerSpecific = 'You must agree to this statement'
        if (!form.understandConsultAdvisor) e.understandConsultAdvisor = 'You must agree to this statement'

        // Certification
        if (!form.certifyInformation) e.certifyInformation = 'You must certify that the information is correct'

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (ev) => {
        console.log('=== FORM SUBMISSION STARTED ===');
        ev.preventDefault()

        console.log('Running validation...');
        const isValid = validate();
        console.log('Validation result:', isValid);

        if (!isValid) {
            console.log('Validation failed, stopping submission');
            console.log('Current errors:', errors);
            return;
        }

        console.log('Setting submitting state to true');
        setSubmitting(true)

        try {
            console.log('=== SUBMISSION PROCESS STARTED ===');
            console.log('Form data:', form)

            // Create FormData for file uploads
            console.log('Creating FormData...');
            const formData = new FormData();

            // Add all text fields to FormData
            formData.append('student_name', `${form.givenName} ${form.familyName}`);
            formData.append('student_id', form.ucfId);
            formData.append('program', 'Academic Training');
            formData.append('completion_type', form.completionType);
            formData.append('sevis_id', form.sevisId);
            formData.append('given_name', form.givenName);
            formData.append('family_name', form.familyName);
            formData.append('legal_sex', form.legalSex);
            formData.append('date_of_birth', form.dateOfBirth);
            formData.append('city_of_birth', form.cityOfBirth);
            formData.append('country_of_birth', form.countryOfBirth);
            formData.append('country_of_citizenship', form.countryOfCitizenship);
            formData.append('country_of_legal_residence', form.countryOfLegalResidence);
            formData.append('has_us_address', form.hasUsAddress.toString());
            formData.append('street_address', form.streetAddress);
            formData.append('city', form.city);
            formData.append('state', form.state);
            formData.append('country', form.country);
            formData.append('us_telephone', form.usTelephone);
            formData.append('non_us_telephone', form.nonUsTelephone || '');
            formData.append('enrolled_full_time', form.enrolledFullTime.toString());
            formData.append('academic_training_start_date', form.academicTrainingStartDate);
            formData.append('academic_training_end_date', form.academicTrainingEndDate);
            formData.append('employed_on_campus', form.employedOnCampus.toString());
            formData.append('previously_authorized', form.previouslyAuthorized.toString());
            formData.append('understand_pre_completion', form.understandPreCompletion.toString());
            formData.append('understand_post_completion', form.understandPostCompletion.toString());
            formData.append('understand_medical_insurance', form.understandMedicalInsurance.toString());
            formData.append('understand_employer_specific', form.understandEmployerSpecific.toString());
            formData.append('understand_consult_advisor', form.understandConsultAdvisor.toString());
            formData.append('comments', form.comments);
            formData.append('certify_information', form.certifyInformation.toString());

            // Add files if they exist
            if (form.offerLetter) {
                console.log('Adding offer letter file:', form.offerLetter.name);
                formData.append('offer_letter', form.offerLetter);
            }
            if (form.trainingAuthorization) {
                console.log('Adding training authorization file:', form.trainingAuthorization.name);
                formData.append('training_authorization', form.trainingAuthorization);
            }

            console.log('FormData created with files:', {
                hasOfferLetter: !!form.offerLetter,
                hasTrainingAuth: !!form.trainingAuthorization
            });

            // Submit with FormData (no Content-Type header - browser sets it automatically)
            console.log('=== ATTEMPTING MAIN ENDPOINT ===');
            console.log('Main endpoint URL: http://localhost:8000/api/academic-training/');
            console.log('Making fetch request with FormData...');

            const response = await fetch('http://localhost:8000/api/academic-training/', {
                method: 'POST',
                body: formData  // No headers needed - browser sets multipart/form-data automatically
            });

            console.log('Fetch request completed');
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                let errorText = '';
                let errorJson = null;

                console.error('=== SERVER RESPONSE ERROR ===')
                console.error('Response status:', response.status)
                console.error('Response status text:', response.statusText)
                console.error('Response headers:', Object.fromEntries(response.headers.entries()))
                console.error('Request URL:', response.url)
                console.error('Request method:', 'POST')

                try {
                    // Try to parse as JSON first
                    errorJson = await response.json();
                    errorText = JSON.stringify(errorJson, null, 2);
                    console.error('Server returned JSON error:', errorJson)

                    // Log validation errors specifically
                    if (errorJson.detail && Array.isArray(errorJson.detail)) {
                        console.error('=== VALIDATION ERRORS ===');
                        errorJson.detail.forEach((err, idx) => {
                            console.error(`Error ${idx + 1}:`, {
                                field: err.loc?.join('.') || 'unknown',
                                message: err.msg,
                                type: err.type,
                                input: err.input
                            });
                        });
                        console.error('========================');
                    }
                } catch (e) {
                    // If not JSON, get as text
                    errorText = await response.text();
                    console.error('Server returned text error:', errorText)
                }

                console.error('Full error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                    json: errorJson,
                    url: response.url
                });
                console.error('================================')

                // Create more specific error message
                let specificError = `Server Error ${response.status}: ${response.statusText}`
                if (errorJson && errorJson.detail) {
                    specificError += ` - ${errorJson.detail}`
                } else if (errorJson && errorJson.message) {
                    specificError += ` - ${errorJson.message}`
                } else if (errorText) {
                    specificError += ` - ${errorText}`
                }

                throw new Error(specificError);
            }

            console.log('=== SUCCESS RESPONSE ===');
            const data = await response.json();
            console.log('Form submitted successfully:', data);
            console.log('Setting submitted state to true');
            setSubmitted(true);

            // Add a link to view all submissions
            console.log('Setting timeout for redirect...');
            setTimeout(() => {
                console.log('Redirecting to all requests page...');
                window.location.href = '/#/forms/all-requests';
            }, 2000);

        } catch (err) {
            console.error('=== ACADEMIC TRAINING FORM SUBMISSION ERROR ===')
            console.error('Error type:', typeof err)
            console.error('Error message:', err.message)
            console.error('Error stack:', err.stack)
            console.error('Full error object:', err)
            console.error('Form data that failed:', form)
            console.error('===============================================')

            // More specific error messages based on error type
            let errorMessage = 'Something went wrong. Try again.'

            if (err.message.includes('Failed to fetch')) {
                errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
                console.error('NETWORK ERROR: Server is not reachable at http://localhost:8000')
            } else if (err.message.includes('404')) {
                errorMessage = 'Server endpoint not found. Please contact support.'
                console.error('ENDPOINT ERROR: /api/academic-training/ endpoint does not exist')
            } else if (err.message.includes('500')) {
                errorMessage = 'Server error occurred. Please try again later.'
                console.error('SERVER ERROR: Backend server returned 500 error')
            } else if (err.message.includes('400')) {
                errorMessage = 'Invalid form data. Please check all required fields.'
                console.error('VALIDATION ERROR: Backend rejected the form data')
            } else if (err.message.includes('CORS')) {
                errorMessage = 'CORS error. Please check server configuration.'
                console.error('CORS ERROR: Cross-origin request blocked')
            }

            console.log('Setting error message:', errorMessage);
            setErrors((e) => ({ ...e, _global: errorMessage }))
        } finally {
            console.log('Setting submitting state to false');
            setSubmitting(false)
            console.log('=== FORM SUBMISSION PROCESS COMPLETE ===');
        }
    }

    return (
        <CRow>
            <CCol xs={12} sm={12} md={11} lg={10} xl={12}>
                <CCard className="mb-4">
                    <CCardHeader className="bg-primary text-white d-flex align-items-center">
                        <div className="me-3">
                            <img src="/ucf-pegasus-logo.png" alt="UCF Logo" height="40" />
                        </div>
                        <div>
                            <h2 className="mb-0">UCF Global</h2>
                            <h4 className="mb-0">Academic Training Request</h4>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        {submitted && (
                            <CAlert color="success" className="mb-4">
                                Thank you! Your Academic Training Request has been submitted successfully.
                                Redirecting to view all submissions...
                            </CAlert>
                        )}
                        {errors._global && <CAlert color="danger" className="mb-4">{errors._global}</CAlert>}

                        <CForm onSubmit={onSubmit}>
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">This form is for J-1 Students only</h5>
                                <CRow className="mb-3 mt-4">
                                    <CCol xs={12}>
                                        <p className="mb-2 fw-bold">Please select the option that best describes you:</p>
                                        <div className="d-flex gap-4">
                                            <CFormCheck
                                                type="radio"
                                                name="completionType"
                                                id="preCompletion"
                                                label="Pre Completion"
                                                value="pre"
                                                checked={form.completionType === 'pre'}
                                                onChange={update}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="completionType"
                                                id="postCompletion"
                                                label="Post Completion"
                                                value="post"
                                                checked={form.completionType === 'post'}
                                                onChange={update}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">Personal Information</h5>
                                <CRow className="mb-3 mt-3">
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
                                    <CCol md={6}>
                                        <CFormInput
                                            label="SEVIS ID"
                                            name="sevisId"
                                            value={form.sevisId}
                                            onChange={update}
                                            invalid={!!errors.sevisId}
                                            feedbackInvalid={errors.sevisId}
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
                                                { label: 'Female', value: 'female' }
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
                                    <CCol md={4}>
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
                                                { label: 'Canada', value: 'CA' },
                                                { label: 'Mexico', value: 'MX' }
                                                // Add more countries as needed
                                            ]}
                                        />
                                    </CCol>
                                    <CCol md={4}>
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
                                                { label: 'Canada', value: 'CA' },
                                                { label: 'Mexico', value: 'MX' }
                                                // Add more countries as needed
                                            ]}
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            label="Country of Legal Permanent Residence"
                                            name="countryOfLegalResidence"
                                            value={form.countryOfLegalResidence}
                                            onChange={update}
                                            invalid={!!errors.countryOfLegalResidence}
                                            feedbackInvalid={errors.countryOfLegalResidence}
                                            options={[
                                                { label: 'Choose...', value: '' },
                                                { label: 'United States', value: 'US' },
                                                { label: 'Canada', value: 'CA' },
                                                { label: 'Mexico', value: 'MX' }
                                                // Add more countries as needed
                                            ]}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">U.S. Address</h5>
                                <CRow className="mb-3">
                                    <CCol md={12}>
                                        <CFormInput
                                            label="Street Address"
                                            name="streetAddress"
                                            value={form.streetAddress}
                                            onChange={update}
                                            invalid={!!errors.streetAddress}
                                            feedbackInvalid={errors.streetAddress}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={4}>
                                        <CFormInput
                                            label="City"
                                            name="city"
                                            value={form.city}
                                            onChange={update}
                                            invalid={!!errors.city}
                                            feedbackInvalid={errors.city}
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            label="State"
                                            name="state"
                                            value={form.state}
                                            onChange={update}
                                            invalid={!!errors.state}
                                            feedbackInvalid={errors.state}
                                            options={[
                                                { label: 'Choose...', value: '' },
                                                { label: 'Florida', value: 'FL' },
                                                { label: 'Georgia', value: 'GA' },
                                                { label: 'New York', value: 'NY' }
                                                // Add more states as needed
                                            ]}
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            label="Country"
                                            name="country"
                                            value={form.country}
                                            onChange={update}
                                            invalid={!!errors.country}
                                            feedbackInvalid={errors.country}
                                            options={[
                                                { label: 'Choose...', value: '' },
                                                { label: 'United States', value: 'US' }
                                            ]}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
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
                            </div>

                            <div className="mb-4">
                                <CRow className="mb-3">
                                    <CCol xs={12}>
                                        <CFormCheck
                                            id="certifyInfo"
                                            name="certifyInformation"
                                            label="I hereby certify that the above information is correct and up to date"
                                            checked={form.certifyInformation}
                                            onChange={update}
                                            invalid={!!errors.certifyInformation}
                                            feedbackInvalid={errors.certifyInformation}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">Questionnaire</h5>
                                <CRow className="mb-3 mt-3">
                                    <CCol xs={12} className="mb-3">
                                        <CFormLabel>Have you been enrolled as a full-time student for the previous academic year (Fall & Spring semesters)?</CFormLabel>
                                        <div className="d-flex gap-4 mt-2">
                                            <CFormCheck
                                                type="radio"
                                                name="enrolledFullTime"
                                                id="enrolledFullTimeYes"
                                                label="Yes"
                                                value={true}
                                                checked={form.enrolledFullTime === true}
                                                onChange={() => setForm(f => ({ ...f, enrolledFullTime: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="enrolledFullTime"
                                                id="enrolledFullTimeNo"
                                                label="No"
                                                value={false}
                                                checked={form.enrolledFullTime === false}
                                                onChange={() => setForm(f => ({ ...f, enrolledFullTime: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormInput
                                            type="date"
                                            label="Academic Training Start Date"
                                            name="academicTrainingStartDate"
                                            value={form.academicTrainingStartDate}
                                            onChange={update}
                                            invalid={!!errors.academicTrainingStartDate}
                                            feedbackInvalid={errors.academicTrainingStartDate}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            type="date"
                                            label="Academic Training End Date"
                                            name="academicTrainingEndDate"
                                            value={form.academicTrainingEndDate}
                                            onChange={update}
                                            invalid={!!errors.academicTrainingEndDate}
                                            feedbackInvalid={errors.academicTrainingEndDate}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol xs={12} className="mb-3">
                                        <CFormLabel>Are you currently employed on campus?</CFormLabel>
                                        <div className="d-flex gap-4 mt-2">
                                            <CFormCheck
                                                type="radio"
                                                name="employedOnCampus"
                                                id="employedOnCampusYes"
                                                label="Yes"
                                                value={true}
                                                checked={form.employedOnCampus === true}
                                                onChange={() => setForm(f => ({ ...f, employedOnCampus: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="employedOnCampus"
                                                id="employedOnCampusNo"
                                                label="No"
                                                value={false}
                                                checked={form.employedOnCampus === false}
                                                onChange={() => setForm(f => ({ ...f, employedOnCampus: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol xs={12}>
                                        <CFormLabel>Have you ever been authorized for Academic Training in the past?</CFormLabel>
                                        <div className="d-flex gap-4 mt-2">
                                            <CFormCheck
                                                type="radio"
                                                name="previouslyAuthorized"
                                                id="previouslyAuthorizedYes"
                                                label="Yes"
                                                value={true}
                                                checked={form.previouslyAuthorized === true}
                                                onChange={() => setForm(f => ({ ...f, previouslyAuthorized: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="previouslyAuthorized"
                                                id="previouslyAuthorizedNo"
                                                label="No"
                                                value={false}
                                                checked={form.previouslyAuthorized === false}
                                                onChange={() => setForm(f => ({ ...f, previouslyAuthorized: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">Document Uploads</h5>
                                <CRow className="mb-3 mt-3">
                                    <CCol xs={12} className="mb-3">
                                        <CFormLabel>Signed offer letter on letterhead from employer</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            name="offerLetter"
                                            onChange={handleFileUpload}
                                            invalid={!!errors.offerLetter}
                                            feedbackInvalid={errors.offerLetter}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol xs={12}>
                                        <CFormLabel>Completed Academic Authorization Training Form</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            name="trainingAuthorization"
                                            onChange={handleFileUpload}
                                            invalid={!!errors.trainingAuthorization}
                                            feedbackInvalid={errors.trainingAuthorization}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">Statements of Agreement</h5>
                                <CRow className="mb-3 mt-3">
                                    {form.completionType === 'pre' && (
                                        <CCol xs={12} className="mb-3">
                                            <CFormCheck
                                                id="understandPreCompletion"
                                                name="understandPreCompletion"
                                                label="I understand that I must apply for academic training before the completion of my J-1 program"
                                                checked={form.understandPreCompletion}
                                                onChange={update}
                                                invalid={!!errors.understandPreCompletion}
                                                feedbackInvalid={errors.understandPreCompletion}
                                            />
                                        </CCol>
                                    )}

                                    {form.completionType === 'post' && (
                                        <CCol xs={12} className="mb-3">
                                            <CFormCheck
                                                id="understandPostCompletion"
                                                name="understandPostCompletion"
                                                label="I understand that for post-completion academic training, employment must begin no later than 30 days after completion of studies"
                                                checked={form.understandPostCompletion}
                                                onChange={update}
                                                invalid={!!errors.understandPostCompletion}
                                                feedbackInvalid={errors.understandPostCompletion}
                                            />
                                        </CCol>
                                    )}

                                    <CCol xs={12} className="mb-3">
                                        <CFormCheck
                                            id="understandMedicalInsurance"
                                            name="understandMedicalInsurance"
                                            label="I understand I must maintain and provide UCF Global with proof of adequate medical insurance throughout the duration of my academic training in order to maintain status (including dependents)"
                                            checked={form.understandMedicalInsurance}
                                            onChange={update}
                                            invalid={!!errors.understandMedicalInsurance}
                                            feedbackInvalid={errors.understandMedicalInsurance}
                                        />
                                    </CCol>

                                    <CCol xs={12} className="mb-3">
                                        <CFormCheck
                                            id="understandEmployerSpecific"
                                            name="understandEmployerSpecific"
                                            label="I understand that academic training is employer specific, position specific, and date specific"
                                            checked={form.understandEmployerSpecific}
                                            onChange={update}
                                            invalid={!!errors.understandEmployerSpecific}
                                            feedbackInvalid={errors.understandEmployerSpecific}
                                        />
                                    </CCol>

                                    <CCol xs={12} className="mb-3">
                                        <CFormCheck
                                            id="understandConsultAdvisor"
                                            name="understandConsultAdvisor"
                                            label="I understand I must consult with an immigration advisor at UCF Global prior to any changes in my academic training"
                                            checked={form.understandConsultAdvisor}
                                            onChange={update}
                                            invalid={!!errors.understandConsultAdvisor}
                                            feedbackInvalid={errors.understandConsultAdvisor}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="mb-4">
                                <h5 className="border-bottom pb-2">Submission</h5>
                                <CRow className="mb-3 mt-3">
                                    <CCol xs={12}>
                                        <CFormLabel>Comments:</CFormLabel>
                                        <CFormTextarea
                                            name="comments"
                                            value={form.comments}
                                            onChange={update}
                                            rows={4}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="d-flex gap-2">
                                <CButton
                                    type="submit"
                                    color="primary"
                                    disabled={submitting}
                                    onClick={() => console.log('Submit button clicked!')}
                                >
                                    {submitting ? <><CSpinner size="sm" /> Submitting...</> : 'Submit'}
                                </CButton>
                                <CButton
                                    type="button"
                                    color="secondary"
                                    variant="outline"
                                    disabled={submitting}
                                    onClick={() => window.location.href = '/'}
                                >
                                    Cancel
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
