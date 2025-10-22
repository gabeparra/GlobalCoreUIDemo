import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import "@coreui/coreui/dist/css/coreui.min.css"
import {
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CFormCheck,
    CButton,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CAlert,
    CSpinner,
} from "@coreui/react"

export default function OffCampusHousingApplicationForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || "",
        gender: "male",
        emailAddress: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        program: "graduate",
        housingSelections: {
            spring2026: true,
            spring2026Session2: false,
            summer2026: true,
            summer2026Session2: false,
            fall2025: true,
        },
        acknowledgement: true,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Validate required fields
            if (!formData.ucfId || !formData.firstName || !formData.lastName || !formData.emailAddress) {
                throw new Error('Please fill in all required fields.')
            }

            if (!formData.acknowledgement) {
                throw new Error('Please acknowledge the terms and conditions.')
            }

            // Check if at least one housing selection is made
            const hasHousingSelection = Object.values(formData.housingSelections).some(val => val === true)
            if (!hasHousingSelection) {
                throw new Error('Please select at least one semester for housing.')
            }

            // Create student name from first and last name
            const studentName = `${formData.firstName} ${formData.lastName}`.trim()

            // Convert form data to snake_case for backend
            const requestData = {
                student_name: studentName,
                student_id: formData.ucfId,
                program: "Off Campus Housing Application",
                ucf_id: formData.ucfId,
                first_name: formData.firstName,
                last_name: formData.lastName,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                email_address: formData.emailAddress,
                program_type: formData.program,
                housing_spring_2026: formData.housingSelections.spring2026,
                housing_spring_2026_session_2: formData.housingSelections.spring2026Session2,
                housing_summer_2026: formData.housingSelections.summer2026,
                housing_summer_2026_session_2: formData.housingSelections.summer2026Session2,
                housing_fall_2025: formData.housingSelections.fall2025,
                acknowledgement: formData.acknowledgement,
                amount_due: 250.00,
                payment_status: "PENDING"
            }

            console.log('Submitting Off Campus Housing Application:', requestData)

            const response = await fetch('http://localhost:8000/api/off-campus-housing/', {
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
            console.log('Off Campus Housing Application submitted successfully:', result)

            setSuccess(true)
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (err) {
            console.error('Error submitting Off Campus Housing Application:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    const handleSave = () => {
        console.log("Form saved:", formData)
        // Add save logic here if needed
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        await handleSubmit(e)
    }

    const handleHousingSelection = (semester) => {
        setFormData({
            ...formData,
            housingSelections: {
                ...formData.housingSelections,
                [semester]: !formData.housingSelections[semester]
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CContainer fluid className="p-0">
                {/* Header with UCF Logo and Title */}
                <div className="bg-white border-b-4 border-warning py-4 px-4">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        <div className="me-3">
                            <div className="bg-warning rounded-circle p-2" style={{ width: "50px", height: "50px" }}>
                                <div className="text-center text-dark fw-bold">UCF</div>
                            </div>
                        </div>
                        <h2 className="mb-0 text-dark">UCF Global</h2>
                    </div>
                    <div className="bg-warning py-2 mb-3"></div>
                    <h1 className="text-2xl font-bold text-center text-dark m-0">
                        OFF CAMPUS HOUSING APPLICATION
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}
                    {success && <CAlert color="success" className="mb-3">Off Campus Housing Application submitted successfully! Redirecting...</CAlert>}

                    <CForm onSubmit={handleSubmit}>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CRow>
                                    {/* Left Column - Application Information */}
                                    <CCol md={6}>
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-3">Application</h6>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        UCF ID
                                                    </CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        value={formData.ucfId}
                                                        onChange={(e) => setFormData({ ...formData, ucfId: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        First Name
                                                    </CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        Last Name
                                                    </CFormLabel>
                                                    <CFormInput
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        Date of Birth
                                                    </CFormLabel>
                                                    <CFormInput
                                                        type="date"
                                                        value={formData.dateOfBirth}
                                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        Gender
                                                    </CFormLabel>
                                                    <CFormSelect
                                                        value={formData.gender}
                                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                                    </CFormSelect>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        Email Address
                                                    </CFormLabel>
                                                    <CFormInput
                                                        type="email"
                                                        value={formData.emailAddress}
                                                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center">
                                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                        Which Program Applies to You?
                                                    </CFormLabel>
                                                    <CFormSelect
                                                        value={formData.program}
                                                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                                    >
                                                        <option value="">Select One</option>
                                                        <option value="undergraduate">Undergraduate</option>
                                                        <option value="graduate">Graduate</option>
                                                        <option value="exchange">Exchange Student</option>
                                                        <option value="visiting">Visiting Student</option>
                                                        <option value="english-language">English Language Program</option>
                                                    </CFormSelect>
                                                </div>
                                            </div>
                                        </div>
                                    </CCol>

                                    {/* Right Column - Housing Plan */}
                                    <CCol md={6}>
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-3">Housing Plan</h6>

                                            <p className="fw-bold mb-3">
                                                Please choose all semesters and sessions for which you will need housing.
                                            </p>

                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id="spring2026"
                                                    label="Spring 2026"
                                                    checked={formData.housingSelections.spring2026}
                                                    onChange={() => handleHousingSelection('spring2026')}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id="spring2026Session2"
                                                    label="Spring 2026 Session 2"
                                                    checked={formData.housingSelections.spring2026Session2}
                                                    onChange={() => handleHousingSelection('spring2026Session2')}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id="summer2026"
                                                    label="Summer 2026"
                                                    checked={formData.housingSelections.summer2026}
                                                    onChange={() => handleHousingSelection('summer2026')}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id="summer2026Session2"
                                                    label="Summer 2026 Session 2"
                                                    checked={formData.housingSelections.summer2026Session2}
                                                    onChange={() => handleHousingSelection('summer2026Session2')}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <CFormCheck
                                                    type="checkbox"
                                                    id="fall2025"
                                                    label="Fall 2025"
                                                    checked={formData.housingSelections.fall2025}
                                                    onChange={() => handleHousingSelection('fall2025')}
                                                />
                                            </div>
                                        </div>
                                    </CCol>
                                </CRow>

                                {/* Payment Information */}
                                <div className="border-top pt-4 mt-4">
                                    <CRow className="mb-3">
                                        <CCol md={6}>
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Amount Due
                                                </CFormLabel>
                                                <span className="fw-bold fs-5">$250.00</span>
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Payment Status
                                                </CFormLabel>
                                                <span className="fw-bold text-dark">PENDING</span>
                                            </div>
                                        </CCol>
                                    </CRow>

                                    <div className="mb-3">
                                        <CFormCheck
                                            type="checkbox"
                                            id="acknowledgement"
                                            checked={formData.acknowledgement}
                                            onChange={(e) => setFormData({ ...formData, acknowledgement: e.target.checked })}
                                            label={
                                                <span>
                                                    I acknowledge that this processing fee is necessary to secure housing at The Verge and is non-refundable.
                                                    This will also cover the one-time cleaning fee for the apartment upon departure.
                                                    Move-in dates will be determined upon finalization of the lease agreement.
                                                </span>
                                            }
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <p className="fw-bold mb-0">
                                            NOTE: Housing will be confirmed via email. Additional details will follow.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2 justify-content-center">
                                    <CButton
                                        type="button"
                                        color="warning"
                                        className="text-dark"
                                        onClick={handlePayment}
                                        disabled={!formData.acknowledgement || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <CSpinner size="sm" className="me-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="me-2">✓</span>Ready for payment
                                            </>
                                        )}
                                    </CButton>
                                    <CButton type="button" color="danger" onClick={handleCancel} className="text-white" disabled={loading}>
                                        <span className="me-2">✕</span>Cancel
                                    </CButton>
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Save Button - Outside the main card */}
                        <div className="d-flex justify-content-start">
                            <CButton
                                type="button"
                                color="secondary"
                                onClick={handleSave}
                                className="text-white"
                            >
                                <span className="me-2">💾</span>Save
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
