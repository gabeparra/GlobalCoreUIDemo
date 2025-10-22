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
    CCard,
    CCardBody,
    CCardHeader,
} from "@coreui/react"

export default function OptStemExtensionReportingForm() {
    const [formData, setFormData] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        sevisId: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || "",
        givenName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        familyName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        streetAddress: import.meta.env.VITE_PLACEHOLDER_STREET_ADDRESS || "",
        apartmentNumber: "",
        city: import.meta.env.VITE_PLACEHOLDER_CITY || "",
        state: import.meta.env.VITE_PLACEHOLDER_STATE || "",
        postalCode: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE || "",
        ucfEmailAddress: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        secondaryEmailAddress: import.meta.env.VITE_PLACEHOLDER_SECONDARY_EMAIL || "",
        usTelephoneNumber: "",
        standardOpt: false,
        stemExtension: false,
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
                        OPT and STEM Extension Reporting Form
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    {/* Important Instructions */}
                    <div className="mb-4">
                        <div className="bg-warning py-2 mb-3"></div>
                        <div className="mb-3">
                            <p className="mb-2">
                                Individuals participating in Optional Practical Training (OPT) or the STEM Extension must report all material changes - such as a change in employment status, employer, or residential address - within 10 days of the change using this form.
                            </p>
                            <p className="mb-0">
                                In addition, individuals participating in the STEM Extension must submit this report every 6 months, regardless of the occurrence of any change in employment status, employer, or residential address.
                            </p>
                        </div>
                    </div>

                    <CForm onSubmit={handleSubmit}>
                        <CRow>
                            {/* Personal Information Section */}
                            <CCol md={6}>
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-warning text-dark">
                                        <h5 className="mb-0">
                                            <span className="me-2">👤</span>Personal Information
                                        </h5>
                                    </CCardHeader>
                                    <CCardBody>
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
                                                    SEVIS ID
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.sevisId}
                                                    onChange={(e) => setFormData({ ...formData, sevisId: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Given Name
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.givenName}
                                                    onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Family Name/Surname
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.familyName}
                                                    onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Street Address
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.streetAddress}
                                                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Apartment Number
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.apartmentNumber}
                                                    onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    City
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    State
                                                </CFormLabel>
                                                <CFormSelect
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                >
                                                    <option value="Florida">Florida</option>
                                                    <option value="Alabama">Alabama</option>
                                                    <option value="Alaska">Alaska</option>
                                                    <option value="Arizona">Arizona</option>
                                                    <option value="Arkansas">Arkansas</option>
                                                    <option value="California">California</option>
                                                    <option value="Colorado">Colorado</option>
                                                    <option value="Connecticut">Connecticut</option>
                                                    <option value="Delaware">Delaware</option>
                                                    <option value="Georgia">Georgia</option>
                                                    <option value="Hawaii">Hawaii</option>
                                                    <option value="Idaho">Idaho</option>
                                                    <option value="Illinois">Illinois</option>
                                                    <option value="Indiana">Indiana</option>
                                                    <option value="Iowa">Iowa</option>
                                                    <option value="Kansas">Kansas</option>
                                                    <option value="Kentucky">Kentucky</option>
                                                    <option value="Louisiana">Louisiana</option>
                                                    <option value="Maine">Maine</option>
                                                    <option value="Maryland">Maryland</option>
                                                    <option value="Massachusetts">Massachusetts</option>
                                                    <option value="Michigan">Michigan</option>
                                                    <option value="Minnesota">Minnesota</option>
                                                    <option value="Mississippi">Mississippi</option>
                                                    <option value="Missouri">Missouri</option>
                                                    <option value="Montana">Montana</option>
                                                    <option value="Nebraska">Nebraska</option>
                                                    <option value="Nevada">Nevada</option>
                                                    <option value="New Hampshire">New Hampshire</option>
                                                    <option value="New Jersey">New Jersey</option>
                                                    <option value="New Mexico">New Mexico</option>
                                                    <option value="New York">New York</option>
                                                    <option value="North Carolina">North Carolina</option>
                                                    <option value="North Dakota">North Dakota</option>
                                                    <option value="Ohio">Ohio</option>
                                                    <option value="Oklahoma">Oklahoma</option>
                                                    <option value="Oregon">Oregon</option>
                                                    <option value="Pennsylvania">Pennsylvania</option>
                                                    <option value="Rhode Island">Rhode Island</option>
                                                    <option value="South Carolina">South Carolina</option>
                                                    <option value="South Dakota">South Dakota</option>
                                                    <option value="Tennessee">Tennessee</option>
                                                    <option value="Texas">Texas</option>
                                                    <option value="Utah">Utah</option>
                                                    <option value="Vermont">Vermont</option>
                                                    <option value="Virginia">Virginia</option>
                                                    <option value="Washington">Washington</option>
                                                    <option value="West Virginia">West Virginia</option>
                                                    <option value="Wisconsin">Wisconsin</option>
                                                    <option value="Wyoming">Wyoming</option>
                                                </CFormSelect>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Postal Code
                                                </CFormLabel>
                                                <CFormInput
                                                    type="text"
                                                    value={formData.postalCode}
                                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    UCF Email Address
                                                </CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    value={formData.ucfEmailAddress}
                                                    onChange={(e) => setFormData({ ...formData, ucfEmailAddress: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    Secondary Email Address
                                                </CFormLabel>
                                                <CFormInput
                                                    type="email"
                                                    value={formData.secondaryEmailAddress}
                                                    onChange={(e) => setFormData({ ...formData, secondaryEmailAddress: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                    U.S. Telephone Number
                                                </CFormLabel>
                                                <CFormInput
                                                    type="tel"
                                                    value={formData.usTelephoneNumber}
                                                    onChange={(e) => setFormData({ ...formData, usTelephoneNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCol>

                            {/* Current Employment Authorization Section */}
                            <CCol md={6}>
                                <CCard className="mb-4">
                                    <CCardHeader className="bg-warning text-dark">
                                        <h5 className="mb-0">
                                            <span className="me-2">💼</span>Current Employment Authorization
                                        </h5>
                                    </CCardHeader>
                                    <CCardBody>
                                        <div className="mb-3">
                                            <CFormCheck
                                                type="checkbox"
                                                id="standardOpt"
                                                label="Standard, Post-Completion Optional Practical Training (OPT)"
                                                checked={formData.standardOpt}
                                                onChange={(e) => setFormData({ ...formData, standardOpt: e.target.checked })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <CFormCheck
                                                type="checkbox"
                                                id="stemExtension"
                                                label="STEM Extension"
                                                checked={formData.stemExtension}
                                                onChange={(e) => setFormData({ ...formData, stemExtension: e.target.checked })}
                                            />
                                        </div>

                                        {/* Placeholder for additional employment fields */}
                                        <div className="mt-4 p-3 bg-light rounded">
                                            <h6 className="mb-2">Additional Employment Information</h6>
                                            <p className="mb-0 text-muted small">
                                                Additional fields for employment details, employer information, and reporting requirements will be added here.
                                            </p>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white">
                                <span className="me-2">✓</span>Submit Report
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
