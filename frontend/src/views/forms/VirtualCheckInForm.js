import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CRow,
    CButton,
    CAlert,
    CSpinner,
    CContainer,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody
} from '@coreui/react';

const VirtualCheckInForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Personal Information State
    const [personalInfo, setPersonalInfo] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        sevisId: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || '',
        givenName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        familyName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        visaType: 'F-1' // F-1 or J-1
    });

    // U.S. Address State
    const [usAddress, setUsAddress] = useState({
        streetAddress: import.meta.env.VITE_PLACEHOLDER_ADDRESS || '',
        apartmentNumber: '',
        city: import.meta.env.VITE_PLACEHOLDER_CITY || '',
        state: import.meta.env.VITE_PLACEHOLDER_STATE || '',
        postalCode: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE || '',
        usTelephone: import.meta.env.VITE_PLACEHOLDER_PHONE || '',
        hasUsTelephone: true,
        ucfEmail: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
        secondaryEmail: import.meta.env.VITE_PLACEHOLDER_SECONDARY_EMAIL || ''
    });

    // Emergency Contact State
    const [emergencyContact, setEmergencyContact] = useState({
        givenName: '',
        familyName: '',
        relationship: '',
        streetAddress: '',
        city: '',
        stateProvince: '',
        country: '',
        postalCode: '',
        usTelephone: '',
        nonUsTelephone: '',
        hasUsTelephone: true,
        hasNonUsTelephone: false,
        email: ''
    });

    // Document Upload State
    const [documents, setDocuments] = useState({
        visaNoticeOfAction: null,
        formI94: null,
        passport: null,
        otherDocuments: null
    });

    // Submission State
    const [submission, setSubmission] = useState({
        authorizationChecked: false,
        remarks: ''
    });

    // Handle input changes for different sections
    const handlePersonalInfoChange = (field, value) => {
        setPersonalInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUsAddressChange = (field, value) => {
        setUsAddress(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEmergencyContactChange = (field, value) => {
        setEmergencyContact(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDocumentChange = (field, file) => {
        setDocuments(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleSubmissionChange = (field, value) => {
        setSubmission(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Checkbox handlers
    const handleCheckboxChange = (section, field, checked) => {
        switch (section) {
            case 'usAddress':
                handleUsAddressChange(field, checked);
                break;
            case 'emergencyContact':
                handleEmergencyContactChange(field, checked);
                break;
            case 'submission':
                handleSubmissionChange(field, checked);
                break;
            default:
                break;
        }
    };

    const validateForm = () => {
        const errors = [];

        // Personal Information Validation
        if (!personalInfo.ucfId) errors.push('UCF ID is required');
        if (!personalInfo.givenName) errors.push('Given Name is required');
        if (!personalInfo.familyName) errors.push('Family Name/Surname is required');
        if (!personalInfo.visaType) errors.push('Visa Type is required');

        // U.S. Address Validation (required)
        if (!usAddress.streetAddress) errors.push('Street Address is required');
        if (!usAddress.city) errors.push('City is required');
        if (!usAddress.state) errors.push('State is required');
        if (!usAddress.postalCode) errors.push('Postal Code is required');
        if (!usAddress.ucfEmail) errors.push('UCF Email Address is required');

        // Authorization Validation
        if (!submission.authorizationChecked) errors.push('You must authorize UCF Global to retrieve your I-94 record');

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate form
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            setLoading(false);
            return;
        }

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Add personal information
            formData.append('ucf_id', personalInfo.ucfId);
            formData.append('sevis_id', personalInfo.sevisId || '');
            formData.append('given_name', personalInfo.givenName);
            formData.append('family_name', personalInfo.familyName);
            formData.append('visa_type', personalInfo.visaType);

            // Add U.S. address information
            formData.append('street_address', usAddress.streetAddress);
            formData.append('apartment_number', usAddress.apartmentNumber || '');
            formData.append('city', usAddress.city);
            formData.append('state', usAddress.state);
            formData.append('postal_code', usAddress.postalCode);
            formData.append('us_telephone', usAddress.usTelephone || '');
            formData.append('has_us_telephone', usAddress.hasUsTelephone);
            formData.append('ucf_email', usAddress.ucfEmail);
            formData.append('secondary_email', usAddress.secondaryEmail || '');

            // Add emergency contact information
            formData.append('emergency_given_name', emergencyContact.givenName || '');
            formData.append('emergency_family_name', emergencyContact.familyName || '');
            formData.append('emergency_relationship', emergencyContact.relationship || '');
            formData.append('emergency_street_address', emergencyContact.streetAddress || '');
            formData.append('emergency_city', emergencyContact.city || '');
            formData.append('emergency_state_province', emergencyContact.stateProvince || '');
            formData.append('emergency_country', emergencyContact.country || '');
            formData.append('emergency_postal_code', emergencyContact.postalCode || '');
            formData.append('emergency_us_telephone', emergencyContact.usTelephone || '');
            formData.append('emergency_non_us_telephone', emergencyContact.nonUsTelephone || '');
            formData.append('emergency_has_us_telephone', emergencyContact.hasUsTelephone);
            formData.append('emergency_has_non_us_telephone', emergencyContact.hasNonUsTelephone);
            formData.append('emergency_email', emergencyContact.email || '');

            // Add documents
            if (documents.visaNoticeOfAction) {
                formData.append('visa_notice_of_action', documents.visaNoticeOfAction);
            }
            if (documents.formI94) {
                formData.append('form_i94', documents.formI94);
            }
            if (documents.passport) {
                formData.append('passport', documents.passport);
            }
            if (documents.otherDocuments) {
                formData.append('other_documents', documents.otherDocuments);
            }

            // Add submission data
            formData.append('has_dependents', false); // Placeholder for future expansion
            formData.append('authorization_checked', submission.authorizationChecked);
            formData.append('remarks', submission.remarks || '');

            const response = await fetch('http://localhost:8000/api/virtual-checkin/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit Virtual Check In request');
            }

            const data = await response.json();
            console.log('Virtual Check In Request submitted:', data);
            setSuccess(true);

            // Navigate to success page or form list after a delay
            setTimeout(() => {
                window.location.href = '/#/forms/all-requests';
            }, 3000);

        } catch (err) {
            console.error('Error submitting Virtual Check In request:', err);
            setError(err.message || 'An error occurred while submitting the request');
        } finally {
            setLoading(false);
        }
    };

    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming'
    ];

    const relationships = [
        'Parent', 'Spouse', 'Sibling', 'Relative', 'Guardian', 'Friend', 'Other'
    ];

    return (
        <CContainer fluid>
            <CRow className="justify-content-center">
                <CCol xs={12} sm={12} md={11} lg={10} xl={12
                }>
                    <CCard>
                        <CCardHeader>
                            <h3>Virtual Check In</h3>
                            <p className="text-muted mb-0">
                                Please complete all sections of this form and upload required documents
                            </p>
                        </CCardHeader>
                        <CCardBody>
                            {error && (
                                <CAlert color="danger" className="mb-4">
                                    {error}
                                </CAlert>
                            )}

                            {success && (
                                <CAlert color="success" className="mb-4">
                                    Virtual Check In request submitted successfully! You will be redirected to the forms page.
                                </CAlert>
                            )}

                            <CForm onSubmit={handleSubmit}>
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <h4 className="mb-0">Personal Information</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="ucfId">UCF ID <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="ucfId"
                                                    value={personalInfo.ucfId}
                                                    onChange={(e) => handlePersonalInfoChange('ucfId', e.target.value)}
                                                    placeholder="Enter your UCF ID"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="sevisId">SEVIS ID</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="sevisId"
                                                    value={personalInfo.sevisId}
                                                    onChange={(e) => handlePersonalInfoChange('sevisId', e.target.value)}
                                                    placeholder="Enter your SEVIS ID"
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="givenName">Given Name <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="givenName"
                                                    value={personalInfo.givenName}
                                                    onChange={(e) => handlePersonalInfoChange('givenName', e.target.value)}
                                                    placeholder="Enter your given name"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="familyName">Family Name/Surname <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="familyName"
                                                    value={personalInfo.familyName}
                                                    onChange={(e) => handlePersonalInfoChange('familyName', e.target.value)}
                                                    placeholder="Enter your family name"
                                                    required
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="visaType">Visa Type <span className="text-danger">*</span></CFormLabel>
                                                <div className="d-flex gap-3">
                                                    <CFormCheck
                                                        type="radio"
                                                        name="visaType"
                                                        id="f1"
                                                        label="F-1"
                                                        value="F-1"
                                                        checked={personalInfo.visaType === 'F-1'}
                                                        onChange={(e) => handlePersonalInfoChange('visaType', e.target.value)}
                                                    />
                                                    <CFormCheck
                                                        type="radio"
                                                        name="visaType"
                                                        id="j1"
                                                        label="J-1"
                                                        value="J-1"
                                                        checked={personalInfo.visaType === 'J-1'}
                                                        onChange={(e) => handlePersonalInfoChange('visaType', e.target.value)}
                                                    />
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <h4 className="mb-0">U.S. Address (THIS IS REQUIRED)</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={8}>
                                                <CFormLabel htmlFor="streetAddress">Street Address <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="streetAddress"
                                                    value={usAddress.streetAddress}
                                                    onChange={(e) => handleUsAddressChange('streetAddress', e.target.value)}
                                                    placeholder="Enter your street address"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="apartmentNumber">Apartment/Room Number</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="apartmentNumber"
                                                    value={usAddress.apartmentNumber}
                                                    onChange={(e) => handleUsAddressChange('apartmentNumber', e.target.value)}
                                                    placeholder="Apt/Room #"
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="city">City <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="city"
                                                    value={usAddress.city}
                                                    onChange={(e) => handleUsAddressChange('city', e.target.value)}
                                                    placeholder="Enter city"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="state">State <span className="text-danger">*</span></CFormLabel>
                                                <CFormSelect
                                                    id="state"
                                                    value={usAddress.state}
                                                    onChange={(e) => handleUsAddressChange('state', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select State</option>
                                                    {states.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </CFormSelect>
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="postalCode">Postal Code <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="postalCode"
                                                    value={usAddress.postalCode}
                                                    onChange={(e) => handleUsAddressChange('postalCode', e.target.value)}
                                                    placeholder="Enter postal code"
                                                    required
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="usTelephone">U.S. Telephone Number</CFormLabel>
                                                <CFormInput
                                                    type="tel"
                                                    id="usTelephone"
                                                    value={usAddress.usTelephone}
                                                    onChange={(e) => handleUsAddressChange('usTelephone', e.target.value)}
                                                    placeholder="Enter U.S. phone number"
                                                />
                                                <CFormCheck
                                                    id="hasUsTelephone"
                                                    label="I do not yet have a U.S. Telephone Number"
                                                    checked={!usAddress.hasUsTelephone}
                                                    onChange={(e) => handleCheckboxChange('usAddress', 'hasUsTelephone', !e.target.checked)}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="ucfEmail">UCF Email Address <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="ucfEmail"
                                                    value={usAddress.ucfEmail}
                                                    onChange={(e) => handleUsAddressChange('ucfEmail', e.target.value)}
                                                    placeholder="Enter your UCF email"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="secondaryEmail">Secondary Email Address</CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="secondaryEmail"
                                                    value={usAddress.secondaryEmail}
                                                    onChange={(e) => handleUsAddressChange('secondaryEmail', e.target.value)}
                                                    placeholder="Enter secondary email"
                                                />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <h4 className="mb-0">Emergency Contact</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="emergencyGivenName">Given Name</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyGivenName"
                                                    value={emergencyContact.givenName}
                                                    onChange={(e) => handleEmergencyContactChange('givenName', e.target.value)}
                                                    placeholder="Enter given name"
                                                />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="emergencyFamilyName">Family Name/Surname</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyFamilyName"
                                                    value={emergencyContact.familyName}
                                                    onChange={(e) => handleEmergencyContactChange('familyName', e.target.value)}
                                                    placeholder="Enter family name"
                                                />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="emergencyRelationship">Relationship</CFormLabel>
                                                <CFormSelect
                                                    id="emergencyRelationship"
                                                    value={emergencyContact.relationship}
                                                    onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                                                >
                                                    <option value="">Select Relationship</option>
                                                    {relationships.map(rel => (
                                                        <option key={rel} value={rel}>{rel}</option>
                                                    ))}
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="emergencyStreetAddress">Street Address</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyStreetAddress"
                                                    value={emergencyContact.streetAddress}
                                                    onChange={(e) => handleEmergencyContactChange('streetAddress', e.target.value)}
                                                    placeholder="Enter street address"
                                                />
                                            </CCol>
                                            <CCol md={3}>
                                                <CFormLabel htmlFor="emergencyCity">City</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyCity"
                                                    value={emergencyContact.city}
                                                    onChange={(e) => handleEmergencyContactChange('city', e.target.value)}
                                                    placeholder="Enter city"
                                                />
                                            </CCol>
                                            <CCol md={3}>
                                                <CFormLabel htmlFor="emergencyStateProvince">State/Province</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyStateProvince"
                                                    value={emergencyContact.stateProvince}
                                                    onChange={(e) => handleEmergencyContactChange('stateProvince', e.target.value)}
                                                    placeholder="Enter state/province"
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="emergencyCountry">Country</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyCountry"
                                                    value={emergencyContact.country}
                                                    onChange={(e) => handleEmergencyContactChange('country', e.target.value)}
                                                    placeholder="Enter country"
                                                />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormLabel htmlFor="emergencyPostalCode">Postal Code</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="emergencyPostalCode"
                                                    value={emergencyContact.postalCode}
                                                    onChange={(e) => handleEmergencyContactChange('postalCode', e.target.value)}
                                                    placeholder="Enter postal code"
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="emergencyUsTelephone">U.S. Telephone Number</CFormLabel>
                                                <CFormInput
                                                    type="tel"
                                                    id="emergencyUsTelephone"
                                                    value={emergencyContact.usTelephone}
                                                    onChange={(e) => handleEmergencyContactChange('usTelephone', e.target.value)}
                                                    placeholder="Enter U.S. phone number"
                                                />
                                                <CFormCheck
                                                    id="emergencyHasUsTelephone"
                                                    label="They do not have a U.S. Telephone Number"
                                                    checked={!emergencyContact.hasUsTelephone}
                                                    onChange={(e) => handleCheckboxChange('emergencyContact', 'hasUsTelephone', !e.target.checked)}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="emergencyNonUsTelephone">Non-U.S. Telephone Number</CFormLabel>
                                                <CFormInput
                                                    type="tel"
                                                    id="emergencyNonUsTelephone"
                                                    value={emergencyContact.nonUsTelephone}
                                                    onChange={(e) => handleEmergencyContactChange('nonUsTelephone', e.target.value)}
                                                    placeholder="+ Country Code Phone Number"
                                                />
                                                <CFormCheck
                                                    id="emergencyHasNonUsTelephone"
                                                    label="They do not have a Non-U.S. Telephone Number"
                                                    checked={!emergencyContact.hasNonUsTelephone}
                                                    onChange={(e) => handleCheckboxChange('emergencyContact', 'hasNonUsTelephone', !e.target.checked)}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="emergencyEmail">Email Address</CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="emergencyEmail"
                                                    value={emergencyContact.email}
                                                    onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                                                    placeholder="Enter email address"
                                                />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <h4 className="mb-0">Required Documents</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="visaNoticeOfAction">Visa or USCIS Notice of Action</CFormLabel>
                                                <CFormInput
                                                    type="file"
                                                    id="visaNoticeOfAction"
                                                    onChange={(e) => handleDocumentChange('visaNoticeOfAction', e.target.files[0])}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <small className="text-muted">Upload Document</small>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="formI94">Most Recent Form I-94</CFormLabel>
                                                <CFormInput
                                                    type="file"
                                                    id="formI94"
                                                    onChange={(e) => handleDocumentChange('formI94', e.target.files[0])}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <small className="text-muted">Upload Document</small>
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="passport">Passport</CFormLabel>
                                                <CFormInput
                                                    type="file"
                                                    id="passport"
                                                    onChange={(e) => handleDocumentChange('passport', e.target.files[0])}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <small className="text-muted">Upload Document</small>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="otherDocuments">Other Documents</CFormLabel>
                                                <CFormInput
                                                    type="file"
                                                    id="otherDocuments"
                                                    onChange={(e) => handleDocumentChange('otherDocuments', e.target.files[0])}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <small className="text-muted">Upload Document</small>
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormCheck
                                                    id="admitUnitDate"
                                                    label='My I-94 "Admit Unit Date" is marked D/S (Duration of Status)'
                                                />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <h4 className="mb-0">Submission</h4>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormCheck
                                                    id="authorizationChecked"
                                                    label="I authorize UCF Global to retrieve my I-94 record, accessible through United States Customs and Border Protection website, for immigration and employment purposes."
                                                    checked={submission.authorizationChecked}
                                                    onChange={(e) => handleCheckboxChange('submission', 'authorizationChecked', e.target.checked)}
                                                    required
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                                                <CFormTextarea
                                                    id="remarks"
                                                    rows="4"
                                                    value={submission.remarks}
                                                    onChange={(e) => handleSubmissionChange('remarks', e.target.value)}
                                                    placeholder="Enter any additional remarks or comments"
                                                />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                <CRow className="mt-4">
                                    <CCol className="d-flex justify-content-between">
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            onClick={() => { window.location.href = '/#/forms/all-requests' }}
                                        >
                                            Back to Forms
                                        </CButton>

                                        <CButton
                                            type="submit"
                                            color="success"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <CSpinner size="sm" className="me-2" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Virtual Check In'
                                            )}
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer >
    );
};

export default VirtualCheckInForm;
