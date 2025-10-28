import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

export default function FloridaStatute101035Form() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || "",
        telephoneNumber: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "",
        emailAddress: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        sevisNumber: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || "",
        college: "college-of-arts-and-humanities",
        department: "Department of English",
        position: "Professor",
        hasPassport: "yes",
        hasDS160: "yes",
        passportDocument: null,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
            // Validate required fields
            if (!formData.ucfId || !formData.firstName || !formData.lastName || !formData.dateOfBirth ||
                !formData.telephoneNumber || !formData.emailAddress || !formData.college ||
                !formData.department || !formData.position || !formData.hasPassport || !formData.hasDS160) {
                throw new Error('Please fill in all required fields')
            }

            // Create FormData for file upload
            const submitData = new FormData()

            // Convert camelCase to snake_case for backend
            submitData.append('ucf_id', formData.ucfId)
            submitData.append('given_name', formData.firstName)
            submitData.append('family_name', formData.lastName)
            submitData.append('date_of_birth', formData.dateOfBirth)
            submitData.append('telephone_number', formData.telephoneNumber)
            submitData.append('email', formData.emailAddress)
            submitData.append('sevis_number', formData.sevisNumber || '')
            submitData.append('college', formData.college)
            submitData.append('department', formData.department)
            submitData.append('position', formData.position)
            submitData.append('has_passport', formData.hasPassport)
            submitData.append('has_ds160', formData.hasDS160)

            // Add passport document if provided
            if (formData.passportDocument) {
                submitData.append('passport_document', formData.passportDocument)
            }

            const response = await fetch('http://localhost:8000/api/florida-statute-101035/', {
                method: 'POST',
                body: submitData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`)
            }

            const result = await response.json()
            console.log('Florida Statute 1010.35 request submitted successfully:', result)

            setSubmitSuccess(true)

            // Redirect to AllRequestsList after 2 seconds
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (error) {
            console.error('Error submitting Florida Statute 1010.35 request:', error)
            setSubmitError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, passportDocument: file })
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
                        FLORIDA STATUTE SECTION 1010.35 DOCUMENT INTAKE FORM
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {/* Introduction Text */}
                    <div className="mb-4">
                        <p className="mb-2">
                            The purpose of this form is to comply with Florida Statute Section 1010.35 which requires UCF to complete certain screening requirements for research and research-related positions.
                        </p>
                        <p className="mb-2">
                            <a href="#" className="text-primary text-decoration-underline">
                                Click here for additional information about the screening process required under Florida Statute Section 1010.35.
                            </a>
                        </p>
                        <p className="mb-3">
                            For technical questions regarding this form, please contact UCF Global at{" "}
                            <a href="mailto:UCFGlobal@ucf.edu" className="text-primary text-decoration-underline">
                                UCFGlobal@ucf.edu
                            </a>
                        </p>
                        <div className="bg-warning py-2 mb-4"></div>
                    </div>

                    <CForm onSubmit={handleSubmit}>
                        {/* Success/Error Messages */}
                        {submitSuccess && (
                            <CAlert color="success" className="mb-4">
                                <strong>Success!</strong> Your Florida Statute 1010.35 request has been submitted successfully. Redirecting to All Requests...
                            </CAlert>
                        )}

                        {submitError && (
                            <CAlert color="danger" className="mb-4">
                                <strong>Error:</strong> {submitError}
                            </CAlert>
                        )}

                        {/* Contact Information Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">👤</span>Contact Information
                                </h5>
                            </CCardHeader>
                            <CCardBody>
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
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                First Name(s)
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <small className="text-muted">as listed in passport</small>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Last Name(s)
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                        <small className="text-muted">as listed in passport</small>
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
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Telephone Number
                                            </CFormLabel>
                                            <CFormInput
                                                type="tel"
                                                value={formData.telephoneNumber}
                                                onChange={(e) => setFormData({ ...formData, telephoneNumber: e.target.value })}
                                            />
                                        </div>
                                        <small className="text-muted">include country code</small>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Email Address
                                            </CFormLabel>
                                            <CFormInput
                                                type="email"
                                                value={formData.emailAddress}
                                                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                SEVIS Number
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.sevisNumber}
                                                onChange={(e) => setFormData({ ...formData, sevisNumber: e.target.value })}
                                            />
                                        </div>
                                        <small className="text-muted">(if applicable, F-1 and J-1 status only)</small>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                College
                                            </CFormLabel>
                                            <CFormSelect
                                                value={formData.college}
                                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                            >
                                                <option value="">Select One</option>
                                                <option value="college-of-arts-and-humanities">College of Arts and Humanities</option>
                                                <option value="college-of-business">College of Business</option>
                                                <option value="college-of-community-innovation-and-education">College of Community Innovation and Education</option>
                                                <option value="college-of-engineering-and-computer-science">College of Engineering and Computer Science</option>
                                                <option value="college-of-health-professions-and-sciences">College of Health Professions and Sciences</option>
                                                <option value="college-of-medicine">College of Medicine</option>
                                                <option value="college-of-nursing">College of Nursing</option>
                                                <option value="college-of-optics-and-photonics">College of Optics and Photonics</option>
                                                <option value="college-of-sciences">College of Sciences</option>
                                                <option value="college-of-undergraduate-studies">College of Undergraduate Studies</option>
                                            </CFormSelect>
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Department
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                placeholder="Department"
                                            />
                                        </div>
                                        <small className="text-muted">indicate your department</small>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Position
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                placeholder="(i.e. student, post-doc, professor, etc)"
                                            />
                                        </div>
                                        <small className="text-muted">indicate your position with the University</small>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {/* Immigration Information Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">📄</span>Immigration Information
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <div className="mb-4">
                                    <h6 className="mb-3">Do you have a passport?</h6>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="hasPassport"
                                            id="passportYes"
                                            label="Yes"
                                            value="yes"
                                            checked={formData.hasPassport === "yes"}
                                            onChange={(e) => setFormData({ ...formData, hasPassport: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="hasPassport"
                                            id="passportNo"
                                            label="No"
                                            value="no"
                                            checked={formData.hasPassport === "no"}
                                            onChange={(e) => setFormData({ ...formData, hasPassport: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 className="mb-3">Do you have a copy of your DS-160, Nonimmigrant Visa Application?</h6>
                                    <p className="mb-3 text-muted">
                                        The DS-160, Nonimmigrant Visa Application can be retrieved within 30 days of its completion by logging into the{" "}
                                        <a href="#" className="text-primary text-decoration-underline">
                                            Consular Electronic Application Center
                                        </a>{" "}
                                        website.{" "}
                                        <a href="#" className="text-primary text-decoration-underline">
                                            Click here
                                        </a>{" "}
                                        more information about retrieving your DS-160.
                                    </p>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="hasDS160"
                                            id="ds160Yes"
                                            label="Yes"
                                            value="yes"
                                            checked={formData.hasDS160 === "yes"}
                                            onChange={(e) => setFormData({ ...formData, hasDS160: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="hasDS160"
                                            id="ds160No"
                                            label="No"
                                            value="no"
                                            checked={formData.hasDS160 === "no"}
                                            onChange={(e) => setFormData({ ...formData, hasDS160: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Document Upload Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">📄</span>Document Upload
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <div className="mb-4">
                                    <h6 className="mb-3 fw-bold">Passport</h6>
                                    <p className="mb-3">Upload a copy of the biographical page of your passport</p>
                                    <div className="d-flex align-items-center">
                                        <CFormInput
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileUpload}
                                            className="me-3"
                                            style={{ maxWidth: "300px" }}
                                        />
                                    </div>
                                    {formData.passportDocument && (
                                        <div className="mt-2">
                                            <small className="text-success">
                                                ✓ File selected: {formData.passportDocument.name}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton
                                type="submit"
                                color="success"
                                className="text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CSpinner size="sm" className="me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <span className="me-2">✓</span>Submit
                                    </>
                                )}
                            </CButton>
                            <CButton
                                type="button"
                                color="danger"
                                onClick={handleCancel}
                                className="text-white"
                                disabled={isSubmitting}
                            >
                                <span className="me-2">✕</span>Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
