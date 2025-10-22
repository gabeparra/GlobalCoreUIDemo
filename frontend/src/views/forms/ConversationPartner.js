import { useState } from "react"
import "@coreui/coreui/dist/css/coreui.min.css"
import { CForm, CFormLabel, CFormInput, CFormSelect, CFormCheck, CButton, CContainer, CRow, CCol, CAlert, CSpinner } from "@coreui/react"

export default function VolunteerApplicationForm() {
    const [formData, setFormData] = useState({
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        phone: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "",
        academicLevel: "graduate",
        major: "Computer Science",
        minor: "",
        legalSex: import.meta.env.VITE_PLACEHOLDER_LEGAL_SEX || "",
        speaksForeignLanguage: "yes",
        oppositeSexPartner: "yes",
        multiplePartners: "yes",
        signOffNeeded: "no",
        semesterCommitment: "yes",
        agreeToExpectations: true,
        consentToShareEmail: true,
    })

    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            // Prepare payload for backend
            const payload = {
                student_name: `${formData.firstName} ${formData.lastName}`,
                student_id: formData.ucfId,
                program: 'Conversation Partner',
                first_name: formData.firstName,
                last_name: formData.lastName,
                ucf_id: formData.ucfId,
                email: formData.email,
                phone: formData.phone,
                academic_level: formData.academicLevel,
                major: formData.major,
                minor: formData.minor,
                legal_sex: formData.legalSex,
                speaks_foreign_language: formData.speaksForeignLanguage,
                opposite_sex_partner: formData.oppositeSexPartner,
                multiple_partners: formData.multiplePartners,
                sign_off_needed: formData.signOffNeeded,
                semester_commitment: formData.semesterCommitment,
                agree_to_expectations: formData.agreeToExpectations,
                consent_to_share_email: formData.consentToShareEmail
            }

            console.log("Submitting to conversation-partner endpoint:", payload)

            const response = await fetch('http://localhost:8000/api/conversation-partner/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const data = await response.json()
            console.log("Form submitted successfully:", data)
            setSubmitted(true)

            // Redirect after success
            setTimeout(() => {
                window.location.href = '/#/forms/all-requests'
            }, 2000)

        } catch (err) {
            console.error("Error submitting form:", err)
            setError("Failed to submit form. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = () => {
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CContainer fluid className="p-0">
                {/* Header */}
                <div className="bg-white border-b-4 border-warning py-4 px-4">
                    <h1 className="text-2xl font-bold text-center m-0">
                        UCF Global Conversation Partner Program: Volunteer Application
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {submitted && (
                        <CAlert color="success" className="mb-4">
                            Thank you! Your Conversation Partner application has been submitted successfully.
                            Redirecting to view all submissions...
                        </CAlert>
                    )}
                    {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}

                    <CForm onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        <div className="mb-4">
                            <h5 className="mb-3 font-semibold">Personal Information</h5>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            First Name:
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
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Last Name:
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
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            UCF ID:
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
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Email:
                                        </CFormLabel>
                                        <CFormInput
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g., ab123456@ucf.edu"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            U.S. Phone:
                                        </CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g., 407-123-4567"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Academic Level:
                                        </CFormLabel>
                                        <CFormSelect
                                            value={formData.academicLevel}
                                            onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                                        >
                                            <option value="">Select one</option>
                                            <option value="freshman">Freshman</option>
                                            <option value="sophomore">Sophomore</option>
                                            <option value="junior">Junior</option>
                                            <option value="senior">Senior</option>
                                            <option value="graduate">Graduate</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Major:
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={formData.major}
                                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Minor:
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            value={formData.minor}
                                            onChange={(e) => setFormData({ ...formData, minor: e.target.value })}
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                            Legal Sex:
                                        </CFormLabel>
                                        <CFormSelect
                                            value={formData.legalSex}
                                            onChange={(e) => setFormData({ ...formData, legalSex: e.target.value })}
                                        >
                                            <option value="">Select One</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Conversation Partner Preferences Section */}
                        <div className="mb-4">
                            <h5 className="mb-3 font-semibold">Conversation Partner Preferences</h5>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="me-3">Do you speak a foreign language?</span>
                                    <CFormCheck
                                        type="radio"
                                        name="speaksForeignLanguage"
                                        id="foreignLanguageYes"
                                        label="Yes"
                                        value="yes"
                                        checked={formData.speaksForeignLanguage === "yes"}
                                        onChange={(e) => setFormData({ ...formData, speaksForeignLanguage: e.target.value })}
                                        inline
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="speaksForeignLanguage"
                                        id="foreignLanguageNo"
                                        label="No"
                                        value="no"
                                        checked={formData.speaksForeignLanguage === "no"}
                                        onChange={(e) => setFormData({ ...formData, speaksForeignLanguage: e.target.value })}
                                        inline
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="me-3">
                                        Would you be comfortable being paired with a partner of the opposite sex?
                                    </span>
                                    <CFormCheck
                                        type="radio"
                                        name="oppositeSexPartner"
                                        id="oppositeSexYes"
                                        label="Yes"
                                        value="yes"
                                        checked={formData.oppositeSexPartner === "yes"}
                                        onChange={(e) => setFormData({ ...formData, oppositeSexPartner: e.target.value })}
                                        inline
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="oppositeSexPartner"
                                        id="oppositeSexNo"
                                        label="No"
                                        value="no"
                                        checked={formData.oppositeSexPartner === "no"}
                                        onChange={(e) => setFormData({ ...formData, oppositeSexPartner: e.target.value })}
                                        inline
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="me-3">
                                        Would you be comfortable with more than one conversation partner, if needed?
                                    </span>
                                    <CFormCheck
                                        type="radio"
                                        name="multiplePartners"
                                        id="multiplePartnersYes"
                                        label="Yes"
                                        value="yes"
                                        checked={formData.multiplePartners === "yes"}
                                        onChange={(e) => setFormData({ ...formData, multiplePartners: e.target.value })}
                                        inline
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="multiplePartners"
                                        id="multiplePartnersNo"
                                        label="No"
                                        value="no"
                                        checked={formData.multiplePartners === "no"}
                                        onChange={(e) => setFormData({ ...formData, multiplePartners: e.target.value })}
                                        inline
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="me-3">Will you need someone to sign off for volunteering hours?</span>
                                    <CFormCheck
                                        type="radio"
                                        name="signOffNeeded"
                                        id="signOffYes"
                                        label="Yes"
                                        value="yes"
                                        checked={formData.signOffNeeded === "yes"}
                                        onChange={(e) => setFormData({ ...formData, signOffNeeded: e.target.value })}
                                        inline
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="signOffNeeded"
                                        id="signOffNo"
                                        label="No"
                                        value="no"
                                        checked={formData.signOffNeeded === "no"}
                                        onChange={(e) => setFormData({ ...formData, signOffNeeded: e.target.value })}
                                        inline
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="mb-2">
                                    The Conversation Partner Program is a semester-long commitment. Volunteers are required to meet with
                                    their partner once a week for at least 1 hour. Will you be able to satisfy this requirement?
                                </p>
                                <div className="d-flex align-items-center">
                                    <CFormCheck
                                        type="radio"
                                        name="semesterCommitment"
                                        id="commitmentYes"
                                        label="Yes"
                                        value="yes"
                                        checked={formData.semesterCommitment === "yes"}
                                        onChange={(e) => setFormData({ ...formData, semesterCommitment: e.target.value })}
                                        inline
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="semesterCommitment"
                                        id="commitmentNo"
                                        label="No"
                                        value="no"
                                        checked={formData.semesterCommitment === "no"}
                                        onChange={(e) => setFormData({ ...formData, semesterCommitment: e.target.value })}
                                        inline
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submission Section */}
                        <div className="mb-4">
                            <h5 className="mb-3 font-semibold">Submission</h5>

                            <div className="mb-3">
                                <CFormCheck
                                    id="agreeToExpectations"
                                    label="By submitting this application, you agree that you have read the information on the Conversation Partner Program and agree to oblige to the expectations and requirements."
                                    checked={formData.agreeToExpectations}
                                    onChange={(e) => setFormData({ ...formData, agreeToExpectations: e.target.checked })}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormCheck
                                    id="consentToShareEmail"
                                    label="I hereby give my consent to share my email with my assigned partner."
                                    checked={formData.consentToShareEmail}
                                    onChange={(e) => setFormData({ ...formData, consentToShareEmail: e.target.checked })}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white" disabled={submitting}>
                                {submitting ? <><CSpinner size="sm" className="me-2" />Submitting...</> : 'Submit'}
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white" disabled={submitting}>
                                Cancel
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
