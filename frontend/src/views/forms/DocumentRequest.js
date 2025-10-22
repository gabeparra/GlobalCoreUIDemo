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
} from "@coreui/react"

export default function DocumentRequestForm() {
    const [formData, setFormData] = useState({
        requestId: "DR2502312",
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        phoneNumber: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "",
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || "",
        gender: "male",
        globalStudentDocument: "",
        undergradDocument: "",
        format: "",
        additionalInfo: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    const handleCancel = () => {
        console.log("Changes cancelled")
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
                            <CButton type="submit" color="success" className="text-white">
                                Submit
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white">
                                Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
