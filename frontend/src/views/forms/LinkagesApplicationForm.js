import { useState } from "react"
import "@coreui/coreui/dist/css/coreui.min.css"
import {
    CForm,
    CFormCheck,
    CButton,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CAlert,
} from "@coreui/react"

export default function LinkagesApplicationForm() {
    const [formData, setFormData] = useState({
        applicationType: "new", // Default to "New Application"
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        // Add submission logic here
    }

    const handleCancel = () => {
        console.log("Changes cancelled")
        // Reset form or navigate away
    }

    const handleApplicationTypeChange = (e) => {
        const applicationType = e.target.value
        setFormData({ ...formData, applicationType })

        // Both radio buttons have the same response at the moment
        console.log(`Application type changed to: ${applicationType}`)
        console.log("Both New Application and Renewal currently have the same response")
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
                        Linkages Application
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    <CForm onSubmit={handleSubmit}>
                        {/* Application Type Selection */}
                        <CCard className="mb-4">
                            <CCardBody>
                                <div className="mb-4">
                                    <h5 className="mb-3">What type of application are you submitting?</h5>
                                    <div className="d-flex gap-4">
                                        <CFormCheck
                                            type="radio"
                                            name="applicationType"
                                            id="newApplication"
                                            label="New Application"
                                            value="new"
                                            checked={formData.applicationType === "new"}
                                            onChange={handleApplicationTypeChange}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            name="applicationType"
                                            id="renewal"
                                            label="Renewal"
                                            value="renewal"
                                            checked={formData.applicationType === "renewal"}
                                            onChange={handleApplicationTypeChange}
                                        />
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Important Information Alert */}
                        <CAlert color="warning" className="mb-4">
                            <div className="d-flex align-items-center">
                                <strong className="me-3">Important Information</strong>
                            </div>
                            <div className="mt-2">
                                The deadline for this application has passed. For more information visit our website:{" "}
                                <a
                                    href="https://global.ucf.edu/linkages"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-decoration-underline"
                                >
                                    global.ucf.edu/linkages
                                </a>
                            </div>
                        </CAlert>

                        {/* Application Content - Same for both types currently */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">📋</span>Application Details
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <div className="text-center py-4">
                                    <h6 className="text-muted mb-3">
                                        {formData.applicationType === "new"
                                            ? "New Application Form Content"
                                            : "Renewal Application Form Content"
                                        }
                                    </h6>
                                    <p className="text-muted">
                                        Both application types currently show the same content and functionality.
                                    </p>
                                    <p className="text-muted small">
                                        Application Type Selected: <strong>{formData.applicationType === "new" ? "New Application" : "Renewal"}</strong>
                                    </p>
                                </div>

                                {/* Placeholder for future form fields */}
                                <div className="mt-4 p-3 bg-light rounded">
                                    <h6 className="mb-2">Future Form Fields Will Include:</h6>
                                    <ul className="mb-0 text-muted small">
                                        <li>Organization Information</li>
                                        <li>Contact Details</li>
                                        <li>Program Description</li>
                                        <li>Budget Information</li>
                                        <li>Supporting Documents</li>
                                        <li>Timeline and Milestones</li>
                                    </ul>
                                </div>
                            </CCardBody>
                        </CCard>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white">
                                <span className="me-2">✓</span>Submit Application
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white">
                                <span className="me-2">✕</span>Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
