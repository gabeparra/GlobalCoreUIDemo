import { useState } from "react"
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
    CFormTextarea,
    CAlert,
    CSpinner,
} from "@coreui/react"
import { useNavigate } from 'react-router-dom'

export default function DocumentRequestForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        requestId: "DR2502312",
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "1234567",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "John",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "Smith",
        email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "john.smith@ucf.edu",
        phoneNumber: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "407-123-4567",
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || "1995-01-15",
        gender: "male",
        globalStudentDocument: "",
        undergradDocument: "",
        format: "email",
        additionalInfo: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Validate required fields
            if (!formData.globalStudentDocument && !formData.undergradDocument) {
                throw new Error('Please select at least one document type.')
            }

            if (!formData.format) {
                throw new Error('Please select a delivery format.')
            }

            // Create student name from first and last name
            const studentName = `${formData.firstName} ${formData.lastName}`.trim()

            // Convert form data to snake_case for backend
            const requestData = {
                student_name: studentName,
                student_id: formData.ucfId,
                program: "Document Request",
                request_id: formData.requestId,
                ucf_id: formData.ucfId,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                global_student_document: formData.globalStudentDocument,
                undergrad_document: formData.undergradDocument,
                format: formData.format,
                additional_info: formData.additionalInfo
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
                navigate('/')
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
        <div className="min-h-screen bg-gray-50">
            <CContainer fluid className="p-0">
                {/* Header */}
                <div className="bg-white border-b-4 border-warning py-4 px-4">
                    <h1 className="text-2xl font-bold text-center m-0">Document Request</h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}
                    {success && <CAlert color="success" className="mb-3">Document Request submitted successfully! Redirecting...</CAlert>}

                    <CForm onSubmit={handleSubmit}>
                        {/* Personal Data Section */}
                        <div className="mb-4">
                            <h6 className="mb-3 font-semibold">
                                <span className="me-2">👤</span>Personal Data
                            </h6>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Request ID
                                        </CFormLabel>
                                        <CFormInput type="text" value={formData.requestId} disabled plainText />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            UCF ID
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={formData.ucfId}
                                            onChange={(e) => setFormData({ ...formData, ucfId: e.target.value })}
                                            placeholder="e.g., 1234567"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            First Name
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="e.g., John"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Last Name
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="e.g., Smith"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Email
                                        </CFormLabel>
                                        <CFormInput
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g., john.smith@ucf.edu"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Phone Number
                                        </CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            placeholder="e.g., 407-123-4567"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Date of Birth
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            placeholder="5/16/1994"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Gender
                                        </CFormLabel>
                                        <CFormSelect
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">Male</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Document Section */}
                        <div className="mb-4">
                            <h6 className="mb-3 font-semibold">
                                <span className="me-2">📄</span>Document
                            </h6>

                            <p className="fst-italic text-muted mb-3">
                                If requesting multiple documents, please submit multiple forms. Documents will be ready within 2
                                business days. During peak times, processing may take longer.
                            </p>

                            <div className="mb-4">
                                <h6 className="mb-3 fw-bold">UCF Global Students</h6>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="enrollmentVerification1"
                                        label="Enrollment Verification Letter"
                                        value="enrollmentVerification"
                                        checked={formData.globalStudentDocument === "enrollmentVerification"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="paymentReceipt"
                                        label="Payment Receipt"
                                        value="paymentReceipt"
                                        checked={formData.globalStudentDocument === "paymentReceipt"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="certificationParticipation"
                                        label="Certification of Participation"
                                        value="certificationParticipation"
                                        checked={formData.globalStudentDocument === "certificationParticipation"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="certificationCompletion"
                                        label="Certification of Completion"
                                        value="certificationCompletion"
                                        checked={formData.globalStudentDocument === "certificationCompletion"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="transcript"
                                        label="Transcript"
                                        value="transcript"
                                        checked={formData.globalStudentDocument === "transcript"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>

                                <div className="mb-2">
                                    <CFormCheck
                                        type="radio"
                                        name="globalStudentDocument"
                                        id="proficiencyWaiver"
                                        label={
                                            <span>
                                                Proficiency Waiver{" "}
                                                <span className="fst-italic text-muted">
                                                    (UCF Global students applying to a UCF Undergraduate or Graduate Degree Program can meet proof
                                                    of English proficiency when completing all core courses in IEP level 8 or higher with a grade
                                                    of a "B" or better.)
                                                </span>
                                            </span>
                                        }
                                        value="proficiencyWaiver"
                                        checked={formData.globalStudentDocument === "proficiencyWaiver"}
                                        onChange={(e) => setFormData({ ...formData, globalStudentDocument: e.target.value })}
                                    />
                                </div>
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
                                        checked={formData.undergradDocument === "enrollmentVerification"}
                                        onChange={(e) => setFormData({ ...formData, undergradDocument: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className="mb-4">
                            <h6 className="mb-3 font-semibold">
                                <span className="me-2">🚚</span>Delivery
                            </h6>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Format
                                        </CFormLabel>
                                        <CFormSelect
                                            value={formData.format}
                                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                        >
                                            <option value="">Select one</option>
                                            <option value="email">Email</option>
                                            <option value="pickup">Pickup</option>
                                            <option value="mail">Mail</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Additional Information Section */}
                        <div className="mb-4">
                            <h6 className="mb-3 font-semibold">Additional Information</h6>

                            <p className="fst-italic text-muted mb-3">
                                Additional information will be reviewed on a case-by-case basis; not all requests may be fulfilled.
                            </p>

                            <CFormTextarea
                                rows={4}
                                value={formData.additionalInfo}
                                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                                placeholder="Additional Information"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white" disabled={loading}>
                                {loading ? (
                                    <>
                                        <CSpinner size="sm" className="me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white" disabled={loading}>
                                Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
