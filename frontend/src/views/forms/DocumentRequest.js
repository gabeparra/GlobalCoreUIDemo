import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormCheck,
    CButton, CAlert, CSpinner, CContainer, CFormLabel,
    CFormTextarea
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function DocumentRequestForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // Personal Information State
    const [personalInfo, setPersonalInfo] = useState({
        requestId: "DR2502312",
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "1234567",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "John",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "Smith",
        email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "john.smith@ucf.edu",
        phoneNumber: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "407-123-4567",
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || "1995-01-15",
        gender: "male"
    })

    // Document Selection State
    const [documentSelection, setDocumentSelection] = useState({
        globalStudentDocument: "",
        undergradDocument: "",
        format: "email"
    })

    // Additional Information State
    const [additionalInfo, setAdditionalInfo] = useState({
        additionalComments: ""
    })

    const handlePersonalInfoChange = (field, value) => {
        setPersonalInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleDocumentSelectionChange = (field, value) => {
        setDocumentSelection(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAdditionalInfoChange = (field, value) => {
        setAdditionalInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = () => {
        const errors = []

        // Validate required fields
        if (!personalInfo.ucfId) errors.push('UCF ID is required')
        if (!personalInfo.firstName) errors.push('First Name is required')
        if (!personalInfo.lastName) errors.push('Last Name is required')
        if (!personalInfo.email) errors.push('Email is required')

        // Validate document selection
        if (!documentSelection.globalStudentDocument && !documentSelection.undergradDocument) {
            errors.push('Please select at least one document type')
        }

        if (!documentSelection.format) {
            errors.push('Please select a delivery format')
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        // Validate form
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '))
            setLoading(false)
            return
        }

        try {
            // Create student name from first and last name
            const studentName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim()

            // Convert form data to snake_case for backend
            const requestData = {
                student_name: studentName,
                student_id: personalInfo.ucfId,
                program: "Document Request",
                request_id: personalInfo.requestId,
                ucf_id: personalInfo.ucfId,
                first_name: personalInfo.firstName,
                last_name: personalInfo.lastName,
                email: personalInfo.email,
                phone_number: personalInfo.phoneNumber,
                date_of_birth: personalInfo.dateOfBirth,
                gender: personalInfo.gender,
                global_student_document: documentSelection.globalStudentDocument,
                undergrad_document: documentSelection.undergradDocument,
                format: documentSelection.format,
                additional_info: additionalInfo.additionalComments
            }

            console.log('Submitting Document Request:', requestData)

            const response = await fetch('http://localhost:8000/api/document-requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`Server error: ${response.status} - ${errorData}`)
            }

            const result = await response.json()
            console.log('Document Request submitted successfully:', result)

            setSuccess(true)
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (err) {
            console.error('Error submitting Document Request:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    return (
        <CContainer fluid>
            <CRow className="justify-content-center">
                <CCol xs={12} sm={12} md={11} lg={10} xl={12}>
                    <CCard>
                        <CCardHeader className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">DOCUMENT REQUEST FORM</h4>
                                    <small>UCF Global - Document Request</small>
                                </div>
                                <div className="text-end">
                                    <small>Complete all sections below</small>
                                </div>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            {error && <CAlert color="danger">{error}</CAlert>}
                            {success && <CAlert color="success">Document Request submitted successfully! Redirecting...</CAlert>}

                            <CForm onSubmit={handleSubmit}>
                                {/* Personal Information Section */}
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <div className="d-flex align-items-center">
                                            <i className="cil-user me-2"></i>
                                            Personal Information
                                        </div>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="requestId">Request ID</CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="requestId"
                                                    value={personalInfo.requestId}
                                                    disabled
                                                    plainText
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="ucfId">UCF ID <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="ucfId"
                                                    value={personalInfo.ucfId}
                                                    onChange={(e) => handlePersonalInfoChange('ucfId', e.target.value)}
                                                    placeholder="e.g., 1234567"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="firstName">First Name <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="firstName"
                                                    value={personalInfo.firstName}
                                                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                                                    placeholder="e.g., John"
                                                    required
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="lastName">Last Name <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    id="lastName"
                                                    value={personalInfo.lastName}
                                                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                                                    placeholder="e.g., Smith"
                                                    required
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="email">Email <span className="text-danger">*</span></CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    id="email"
                                                    value={personalInfo.email}
                                                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                                    placeholder="e.g., john.smith@ucf.edu"
                                                    required
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                                                <CFormInput
                                                    type="tel"
                                                    id="phoneNumber"
                                                    value={personalInfo.phoneNumber}
                                                    onChange={(e) => handlePersonalInfoChange('phoneNumber', e.target.value)}
                                                    placeholder="e.g., 407-123-4567"
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="dateOfBirth">Date of Birth</CFormLabel>
                                                <CFormInput
                                                    type="date"
                                                    id="dateOfBirth"
                                                    value={personalInfo.dateOfBirth}
                                                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="gender">Gender</CFormLabel>
                                                <CFormSelect
                                                    id="gender"
                                                    value={personalInfo.gender}
                                                    onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                {/* Document Selection Section */}
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <div className="d-flex align-items-center">
                                            <i className="cil-file me-2"></i>
                                            Document Selection
                                        </div>
                                    </CCardHeader>
                                    <CCardBody>
                                        <p className="fst-italic text-muted mb-3">
                                            If requesting multiple documents, please submit multiple forms. Documents will be ready within 2
                                            business days. During peak times, processing may take longer.
                                        </p>

                                        <div className="mb-4">
                                            <h6 className="mb-3 fw-bold">UCF Global Students</h6>
                                            {[
                                                { value: "enrollmentVerification", label: "Enrollment Verification Letter" },
                                                { value: "paymentReceipt", label: "Payment Receipt" },
                                                { value: "certificationParticipation", label: "Certification of Participation" },
                                                { value: "certificationCompletion", label: "Certification of Completion" },
                                                { value: "transcript", label: "Transcript" },
                                                {
                                                    value: "proficiencyWaiver",
                                                    label: "Proficiency Waiver",
                                                    description: "(UCF Global students applying to a UCF Undergraduate or Graduate Degree Program can meet proof of English proficiency when completing all core courses in IEP level 8 or higher with a grade of a 'B' or better.)"
                                                }
                                            ].map((doc) => (
                                                <div key={doc.value} className="mb-2">
                                                    <CFormCheck
                                                        type="radio"
                                                        name="globalStudentDocument"
                                                        id={doc.value}
                                                        label={
                                                            doc.description ? (
                                                                <span>
                                                                    {doc.label}{" "}
                                                                    <span className="fst-italic text-muted">
                                                                        {doc.description}
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                doc.label
                                                            )
                                                        }
                                                        value={doc.value}
                                                        checked={documentSelection.globalStudentDocument === doc.value}
                                                        onChange={(e) => handleDocumentSelectionChange('globalStudentDocument', e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="mb-3 fw-bold">Undergraduate and Graduate Students</h6>
                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="radio"
                                                    name="undergradDocument"
                                                    id="enrollmentVerification2"
                                                    label="Enrollment Verification Letter"
                                                    value="enrollmentVerification"
                                                    checked={documentSelection.undergradDocument === "enrollmentVerification"}
                                                    onChange={(e) => handleDocumentSelectionChange('undergradDocument', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </CCardBody>
                                </CCard>

                                {/* Delivery Section */}
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <div className="d-flex align-items-center">
                                            <i className="cil-truck me-2"></i>
                                            Delivery
                                        </div>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={6}>
                                                <CFormLabel htmlFor="format">Format <span className="text-danger">*</span></CFormLabel>
                                                <CFormSelect
                                                    id="format"
                                                    value={documentSelection.format}
                                                    onChange={(e) => handleDocumentSelectionChange('format', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select one</option>
                                                    <option value="email">Email</option>
                                                    <option value="pickup">Pickup</option>
                                                    <option value="mail">Mail</option>
                                                </CFormSelect>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>

                                {/* Additional Information Section */}
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-primary text-white">
                                        <div className="d-flex align-items-center">
                                            <i className="cil-notes me-2"></i>
                                            Additional Information
                                        </div>
                                    </CCardHeader>
                                    <CCardBody>
                                        <p className="fst-italic text-muted mb-3">
                                            Additional information will be reviewed on a case-by-case basis; not all requests may be fulfilled.
                                        </p>

                                        <CFormTextarea
                                            rows={4}
                                            value={additionalInfo.additionalComments}
                                            onChange={(e) => handleAdditionalInfoChange('additionalComments', e.target.value)}
                                            placeholder="Additional Information"
                                        />
                                    </CCardBody>
                                </CCard>

                                {/* Submit Buttons */}
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
    )
}
