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

export default function UCFGlobalExitForm() {
    const [formData, setFormData] = useState({
        // Biographical Information
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        sevisId: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || "",
        visaType: "",
        givenName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        familyName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        usStreetAddress: "",
        apartmentNumber: "",
        city: import.meta.env.VITE_PLACEHOLDER_CITY || "",
        state: import.meta.env.VITE_PLACEHOLDER_STATE || "",
        postalCode: "",
        foreignStreetAddress: "",
        foreignCity: import.meta.env.VITE_PLACEHOLDER_CITY || "",
        foreignPostalCode: "",
        country: "",
        ucfEmail: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        secondaryEmail: import.meta.env.VITE_PLACEHOLDER_SECONDARY_EMAIL || "",
        usTelephone: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE ||  "",
        foreignTelephone: "",
        // Current Academic Information
        educationLevel: "graduate",
        employedOnCampus: "yes",
        // Departure Information
        departureDate: new Date().toISOString().split('T')[0],
        flightItinerary: null,
        departureReason: "",
        // Submission
        workAuthorizationAcknowledgment: false,
        cptOptAcknowledgment: false,
        financialObligationsAcknowledgment: false,
        remarks: "I am leaving the United States to return to my home country.",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    const handleSaveForLater = () => {
        console.log("Saving form for later:", formData)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, flightItinerary: file })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CContainer fluid className="p-0">
                {/* Header */}
                <div className="bg-white border-b-4 border-warning py-4 px-4">
                    <h1 className="text-center fw-bold m-0" style={{ fontSize: "2rem" }}>
                        UCF Global Exit Form
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {/* Save for Later Button */}
                    <div className="mb-3">
                        <CButton color="warning" onClick={handleSaveForLater}>
                            Save for Later
                        </CButton>
                    </div>

                    {/* Introductory Text */}
                    <div className="mb-4">
                        <p>
                            This eForm should be completed by international students and scholars who wish to report their leave from
                            the University of Central Florida.
                        </p>
                        <p>
                            Taking a leave of absence can impact a student's eligibility for Curricular Practical Training (CPT) or
                            Optional Practical Training (OPT). For details and information on taking a leave of absence and its
                            conditions and consequences, please visit our webpage on{" "}
                            <a href="#" className="text-primary">
                                Leave of Absence
                            </a>{" "}
                            or speak with an immigration adviser at UCF Global.
                        </p>
                    </div>

                    <CForm onSubmit={handleSubmit}>
                        {/* Biographical Information Section */}
                        <div className="bg-light border px-3 py-2 mb-3 fw-semibold text-secondary">Biographical Information</div>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        UCF ID:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.ucfId}
                                        onChange={(e) => setFormData({ ...formData, ucfId: e.target.value })}
                                        readOnly
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        SEVIS ID:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.sevisId}
                                        onChange={(e) => setFormData({ ...formData, sevisId: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Visa Type:
                                    </CFormLabel>
                                    <div className="d-flex gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="visaType"
                                            id="visa-f1"
                                            label="F-1"
                                            value="F-1"
                                            checked={formData.visaType === "F-1"}
                                            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            name="visaType"
                                            id="visa-j1"
                                            label="J-1"
                                            value="J-1"
                                            checked={formData.visaType === "J-1"}
                                            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Given Name:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.givenName}
                                        onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Family Name/Surname:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.familyName}
                                        onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        U.S. Street Address:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.usStreetAddress}
                                        onChange={(e) => setFormData({ ...formData, usStreetAddress: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Apartment Number:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.apartmentNumber}
                                        onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        City:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        State:
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        <option value="Florida">Florida</option>
                                        <option value="Alabama">Alabama</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="California">California</option>
                                        <option value="New York">New York</option>
                                        <option value="Texas">Texas</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Postal Code:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Foreign Street Address:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.foreignStreetAddress}
                                        onChange={(e) => setFormData({ ...formData, foreignStreetAddress: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        City:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.foreignCity}
                                        onChange={(e) => setFormData({ ...formData, foreignCity: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Postal Code:
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.foreignPostalCode}
                                        onChange={(e) => setFormData({ ...formData, foreignPostalCode: e.target.value })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Country:
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        required
                                    >
                                        <option value="">Select One:</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="China">China</option>
                                        <option value="India">India</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        UCF Email Address:
                                    </CFormLabel>
                                    <CFormInput
                                        type="email"
                                        value={formData.ucfEmail}
                                        onChange={(e) => setFormData({ ...formData, ucfEmail: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Secondary Email Address:
                                    </CFormLabel>
                                    <CFormInput
                                        type="email"
                                        value={formData.secondaryEmail}
                                        onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        U.S. Telephone Number:
                                    </CFormLabel>
                                    <CFormInput
                                        type="tel"
                                        value={formData.usTelephone}
                                        onChange={(e) => setFormData({ ...formData, usTelephone: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Foreign Telephone Number:
                                    </CFormLabel>
                                    <CFormInput
                                        type="tel"
                                        value={formData.foreignTelephone}
                                        onChange={(e) => setFormData({ ...formData, foreignTelephone: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        {/* Current Academic Information Section */}
                        <div className="bg-light border px-3 py-2 mb-3 fw-semibold text-secondary">
                            Current Academic Information
                        </div>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        UCF Education Level:
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.educationLevel}
                                        onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                                        required
                                    >
                                        <option value="">Select One</option>
                                        <option value="undergraduate">Undergraduate</option>
                                        <option value="graduate">Graduate</option>
                                        <option value="doctoral">Doctoral</option>
                                        <option value="non-degree">Non-Degree</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={8}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "350px" }}>
                                        Are you currently employed on campus at UCF?
                                    </CFormLabel>
                                    <div className="d-flex gap-3">
                                        <CFormCheck
                                            type="radio"
                                            name="employedOnCampus"
                                            id="employed-yes"
                                            label="Yes"
                                            value="yes"
                                            checked={formData.employedOnCampus === "yes"}
                                            onChange={(e) => setFormData({ ...formData, employedOnCampus: e.target.value })}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            name="employedOnCampus"
                                            id="employed-no"
                                            label="No"
                                            value="no"
                                            checked={formData.employedOnCampus === "no"}
                                            onChange={(e) => setFormData({ ...formData, employedOnCampus: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Departure Information Section */}
                        <div className="bg-light border px-3 py-2 mb-3 fw-semibold text-secondary">Departure Information</div>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Date of Departure:
                                    </CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={formData.departureDate}
                                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "180px" }}>
                                        Upload Departure Flight Itinerary:
                                    </CFormLabel>
                                    <CButton color="secondary" onClick={() => document.getElementById("fileUpload").click()}>
                                        Upload Flight Itinerary
                                    </CButton>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={10}>
                                <div>
                                    <CFormLabel className="mb-2">Please select the option that best applies:</CFormLabel>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="departureReason"
                                            id="reason-temporary"
                                            label="I am taking a temporary leave of absence and departing the United States."
                                            value="temporary"
                                            checked={formData.departureReason === "temporary"}
                                            onChange={(e) => setFormData({ ...formData, departureReason: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="departureReason"
                                            id="reason-discontinuing"
                                            label="I am discontinuing my studies and am permanently departing the United States."
                                            value="discontinuing"
                                            checked={formData.departureReason === "discontinuing"}
                                            onChange={(e) => setFormData({ ...formData, departureReason: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <CFormCheck
                                            type="radio"
                                            name="departureReason"
                                            id="reason-completed"
                                            label="I have completed my program and am permanently departing the United States."
                                            value="completed"
                                            checked={formData.departureReason === "completed"}
                                            onChange={(e) => setFormData({ ...formData, departureReason: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Submission Section */}
                        <div className="bg-light border px-3 py-2 mb-3 fw-semibold text-secondary">Submission</div>

                        <CRow className="mb-3">
                            <CCol md={12}>
                                <div className="mb-3">
                                    <CFormCheck
                                        id="work-authorization"
                                        label="If I am working on-campus at the University of Central Florida, I understand that my work authorization ends on the date my SEVIS record is terminated that I must notify my supervisor and the Human Resources Business Center of my upcoming departure from the United States."
                                        checked={formData.workAuthorizationAcknowledgment}
                                        onChange={(e) => setFormData({ ...formData, workAuthorizationAcknowledgment: e.target.checked })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        id="cpt-opt"
                                        label="I understand that taking a leave of absence from the University of Central Florida can either delay or deny my eligibility for Curricular Practical Training (CPT) or Optional Practical Training (OPT)."
                                        checked={formData.cptOptAcknowledgment}
                                        onChange={(e) => setFormData({ ...formData, cptOptAcknowledgment: e.target.checked })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        id="financial-obligations"
                                        label="I understand I am responsible for resolving any outstanding financial obligations with the University of Central Florida, even after my exit from the United States."
                                        checked={formData.financialObligationsAcknowledgment}
                                        onChange={(e) => setFormData({ ...formData, financialObligationsAcknowledgment: e.target.checked })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={8}>
                                <CFormLabel>Remarks or additional comments:</CFormLabel>
                                <CFormTextarea
                                    rows={5}
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </CCol>
                        </CRow>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white">
                                Submit
                            </CButton>
                            <CButton type="button" color="danger" className="text-white">
                                Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
