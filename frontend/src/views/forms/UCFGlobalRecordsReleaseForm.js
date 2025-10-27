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
    CRow,
    CButton,
    CAlert,
    CSpinner,
    CContainer
} from '@coreui/react';

const UCFGlobalRecordsReleaseForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        ucfEmail: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
        personalEmail: import.meta.env.VITE_PLACEHOLDER_SECONDARY_EMAIL || '',
        recordsToRelease: [],
        releaseRecipient: '',
        authorization: false,
        signature: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            recordsToRelease: checked
                ? [...prevState.recordsToRelease, value]
                : prevState.recordsToRelease.filter(item => item !== value)
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.ucfId) errors.push('UCF ID is required');
        if (!formData.firstName) errors.push('First Name is required');
        if (!formData.lastName) errors.push('Last Name is required');
        if (!formData.ucfEmail) errors.push('UCF Email is required');
        if (formData.recordsToRelease.length === 0) errors.push('Please select at least one record type to release');
        if (!formData.releaseRecipient) errors.push('Please select a recipient');
        if (!formData.authorization) errors.push('Please authorize the record release');
        if (!formData.signature) errors.push('Please provide your signature');

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

        // Prepare submission data
        const submissionData = {
            student_name: `${formData.firstName} ${formData.lastName}`,
            student_id: formData.ucfId,
            program: 'UCF Global Records Release',
            form_data: {
                ucf_id: formData.ucfId,
                first_name: formData.firstName,
                last_name: formData.lastName,
                ucf_email: formData.ucfEmail,
                personal_email: formData.personalEmail,
                records_to_release: formData.recordsToRelease,
                release_recipient: formData.releaseRecipient,
                authorization_checked: formData.authorization,
                signature: formData.signature,
                signature_date: new Date().toISOString().split('T')[0]
            }
        };

        try {
            // Submit form to backend
            const response = await fetch('http://localhost:8000/api/ucf-global-records-release/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submission failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('UCF Global Records Release Form submitted successfully:', result);

            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/#/forms/all-requests'
            }, 2000);

        } catch (err) {
            console.error('Error submitting UCF Global Records Release Form:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <CContainer fluid>
            <CRow className="justify-content-center">
                <CCol xs={12} lg={10}>
                    <CCard>
                        <CCardHeader className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">UCF GLOBAL RECORDS RELEASE FORM</h4>
                                    <small>UCF Global - Record Release Authorization</small>
                                </div>
                                <div className="text-end">
                                    <small>Complete all sections below</small>
                                </div>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            {error && <CAlert color="danger">{error}</CAlert>}
                            {success && <CAlert color="success">UCF Global Records Release Form submitted successfully! Redirecting...</CAlert>}

                            <CForm onSubmit={handleSubmit}>
                                <p className="text-body-secondary">
                                    Under the Family Educational Rights and Privacy Act of 1974, or FERPA,
                                    students must give written consent (permission) to release certain
                                    educational records to third parties.
                                </p>

                                <CRow className="mb-3">
                                    <CCol md={4}>
                                        <CFormLabel>UCF ID</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="ucfId"
                                            value={formData.ucfId}
                                            onChange={handleInputChange}
                                            placeholder="Enter UCF ID"
                                            required
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel>First Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter First Name"
                                            required
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel>Last Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter Last Name"
                                            required
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>UCF Email</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            name="ucfEmail"
                                            value={formData.ucfEmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter UCF Email"
                                            required
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Personal Email</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            name="personalEmail"
                                            value={formData.personalEmail}
                                            onChange={handleInputChange}
                                            placeholder="Enter Personal Email"
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Information to be Released</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                id="allEducationalRecords"
                                                name="recordsToRelease"
                                                value="All Educational Records"
                                                label="All Educational Records / Information - For Sponsored Students"
                                                onChange={handleCheckboxChange}
                                                checked={formData.recordsToRelease.includes('All Educational Records')}
                                            />
                                            <CFormCheck
                                                id="ucfGlobalAcademicRecords"
                                                name="recordsToRelease"
                                                value="UCF Global Academic Records"
                                                label="UCF Global Academic Records"
                                                onChange={handleCheckboxChange}
                                                checked={formData.recordsToRelease.includes('UCF Global Academic Records')}
                                            />
                                            <CFormCheck
                                                id="immigrationRecords"
                                                name="recordsToRelease"
                                                value="Immigration Records"
                                                label="Immigration Records"
                                                onChange={handleCheckboxChange}
                                                checked={formData.recordsToRelease.includes('Immigration Records')}
                                            />
                                            <CFormCheck
                                                id="otherInformation"
                                                name="recordsToRelease"
                                                value="Other Information"
                                                label="Other Information"
                                                onChange={handleCheckboxChange}
                                                checked={formData.recordsToRelease.includes('Other Information')}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Records to be Released to</CFormLabel>
                                        <CFormSelect
                                            name="releaseRecipient"
                                            value={formData.releaseRecipient}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select One</option>
                                            <option value="Sponsor">Sponsor</option>
                                            <option value="Family">Family</option>
                                            <option value="Employer">Employer</option>
                                            <option value="Other">Other</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormCheck
                                            id="authorization"
                                            name="authorization"
                                            label="By checking here, I hereby authorize UCF Global to release a record as indicated and preferred by the requester. I understand that until revocation is made in writing to UCF Global, this consent shall remain in effect."
                                            onChange={handleInputChange}
                                            checked={formData.authorization}
                                            required
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Signature</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="signature"
                                            value={formData.signature}
                                            onChange={handleInputChange}
                                            placeholder="Sign your name"
                                            required
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Date</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            value={new Date().toISOString().split('T')[0]}
                                            readOnly
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mt-4">
                                    <CCol className="d-flex justify-content-end gap-2">
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            Cancel Changes
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
                                                <>
                                                    <i className="cil-check me-2"></i>
                                                    Submit
                                                </>
                                            )}
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default UCFGlobalRecordsReleaseForm;
