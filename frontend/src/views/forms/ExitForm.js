import React, { useState } from "react"
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
    CSpinner
} from "@coreui/react"
import { useNavigate } from 'react-router-dom'

export default function UCFGlobalExitForm() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const [formData, setFormData] = useState({
        // Biographical Information - using .env values
        ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "1234567",
        sevis_id: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || "N0012345678",
        visa_type: import.meta.env.VITE_PLACEHOLDER_VISA_TYPE || "F-1",
        given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "John",
        family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "Doe",

        // U.S. Address - using .env values
        us_street_address: import.meta.env.VITE_PLACEHOLDER_EXIT_US_STREET_ADDRESS || "456 College Avenue",
        apartment_number: import.meta.env.VITE_PLACEHOLDER_EXIT_APARTMENT_NUMBER || "Apt 201",
        city: import.meta.env.VITE_PLACEHOLDER_CITY || "Orlando",
        state: "Florida", // Must match select option values
        postal_code: "32816",

        // Foreign Address - using .env values
        foreign_street_address: import.meta.env.VITE_PLACEHOLDER_EXIT_FOREIGN_STREET_ADDRESS || "789 International Blvd",
        foreign_city: import.meta.env.VITE_PLACEHOLDER_EXIT_FOREIGN_CITY || "Madrid",
        foreign_postal_code: import.meta.env.VITE_PLACEHOLDER_EXIT_FOREIGN_POSTAL_CODE || "28001",
        country: import.meta.env.VITE_PLACEHOLDER_EXIT_COUNTRY || "Spain",

        // Contact Information - using .env values
        ucf_email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "john.doe@knights.ucf.edu",
        secondary_email: import.meta.env.VITE_PLACEHOLDER_EXIT_SECONDARY_EMAIL || "jane.smith@example.com",
        us_telephone: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || "(407) 555-1234",
        foreign_telephone: import.meta.env.VITE_PLACEHOLDER_EXIT_FOREIGN_TELEPHONE || "+34 (123) 456-7890",

        // Current Academic Information
        education_level: "graduate",
        employed_on_campus: "no",

        // Departure Information - using .env values
        departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        flight_itinerary: null,
        departure_reason: import.meta.env.VITE_PLACEHOLDER_EXIT_DEPARTURE_REASON || "Completing my degree program and returning to home country",

        // Submission - all pre-checked for testing
        work_authorization_acknowledgment: true,
        cpt_opt_acknowledgment: true,
        financial_obligations_acknowledgment: true,
        remarks: "I have completed my studies at UCF and will be returning to my home country. Thank you for the support during my time here."
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')
        setSubmitSuccess(false)

        try {
            const submitData = new FormData()

            // Detailed logging of form data
            console.log('Full Form Data:', formData)

            // Add all form fields, converting booleans to strings
            Object.keys(formData).forEach(key => {
                // List of required fields that must be sent
                const requiredFields = [
                    'ucf_id',
                    'given_name',
                    'family_name',
                    'ucf_email'
                ]

                // Always send required fields, even if empty
                if (requiredFields.includes(key) ||
                    (formData[key] !== null && formData[key] !== undefined)) {
                    // Convert booleans to string for FormData
                    const value = typeof formData[key] === 'boolean'
                        ? formData[key].toString()
                        : (formData[key] || '') // Use empty string if value is undefined

                    // Log each field being added
                    console.log(`Adding field: ${key} = ${value}`)

                    // Only append if it's not a File object or if it has a name (actual file)
                    if (!(value instanceof File) || (value instanceof File && value.name)) {
                        submitData.append(key, value)
                    }
                }
            })

            // Log FormData contents
            console.log('Submitted FormData:')
            for (let [key, value] of submitData.entries()) {
                console.log(`${key}: ${value}`)
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
            console.log('Submitting to URL:', `${backendUrl}/api/exit-forms/`)

            try {
                const response = await fetch(`${backendUrl}/api/exit-forms/`, {
                    method: 'POST',
                    body: submitData,
                    headers: {
                        // Optional: Add any specific headers if needed
                        // 'Content-Type': 'multipart/form-data' // Usually not needed with FormData
                    }
                })

                console.log('Response status:', response.status)

                if (!response.ok) {
                    const errorData = await response.text()
                    console.error('Server error details:', errorData)
                    throw new Error(`Server error: ${response.status} - ${errorData}`)
                }

                const result = await response.json()
                console.log('Exit Form submitted successfully:', result)

                setSubmitSuccess(true)

                // Redirect to All Requests List after 2 seconds
                setTimeout(() => {
                    navigate('/forms/all-requests')
                }, 2000)

            } catch (fetchError) {
                console.error('Fetch error details:', fetchError)
                throw fetchError
            }

        } catch (error) {
            console.error('Error submitting Exit Form:', error)
            // Check if it's a network error
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                setSubmitError('Network error. Please check your backend server is running.')
            } else {
                setSubmitError(`Failed to submit form: ${error.message}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveForLater = () => {
        console.log("Saving form for later:", formData)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, flight_itinerary: file })
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
                    {submitError && (
                        <CAlert color="danger" className="mb-3">
                            {submitError}
                        </CAlert>
                    )}

                    {submitSuccess && (
                        <CAlert color="success" className="mb-3">
                            Exit Form submitted successfully! Redirecting to All Requests List...
                        </CAlert>
                    )}

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
                                        value={formData.ucf_id}
                                        onChange={(e) => setFormData({ ...formData, ucf_id: e.target.value })}
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
                                        value={formData.sevis_id}
                                        onChange={(e) => setFormData({ ...formData, sevis_id: e.target.value })}
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
                                            name="visa_type"
                                            id="visa-f1"
                                            label="F-1"
                                            value="F-1"
                                            checked={formData.visa_type === "F-1"}
                                            onChange={(e) => setFormData({ ...formData, visa_type: e.target.value })}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            name="visa_type"
                                            id="visa-j1"
                                            label="J-1"
                                            value="J-1"
                                            checked={formData.visa_type === "J-1"}
                                            onChange={(e) => setFormData({ ...formData, visa_type: e.target.value })}
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
                                        value={formData.given_name}
                                        onChange={(e) => setFormData({ ...formData, given_name: e.target.value })}
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
                                        value={formData.family_name}
                                        onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
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
                                        value={formData.us_street_address}
                                        onChange={(e) => setFormData({ ...formData, us_street_address: e.target.value })}
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
                                        value={formData.apartment_number}
                                        onChange={(e) => setFormData({ ...formData, apartment_number: e.target.value })}
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
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
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
                                        value={formData.foreign_street_address}
                                        onChange={(e) => setFormData({ ...formData, foreign_street_address: e.target.value })}
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
                                        value={formData.foreign_city}
                                        onChange={(e) => setFormData({ ...formData, foreign_city: e.target.value })}
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
                                        value={formData.foreign_postal_code}
                                        onChange={(e) => setFormData({ ...formData, foreign_postal_code: e.target.value })}
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
                                        <option value="Colombia">Colombia</option>
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
                                        value={formData.ucf_email}
                                        onChange={(e) => setFormData({ ...formData, ucf_email: e.target.value })}
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
                                        value={formData.secondary_email}
                                        onChange={(e) => setFormData({ ...formData, secondary_email: e.target.value })}
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
                                        value={formData.us_telephone}
                                        onChange={(e) => setFormData({ ...formData, us_telephone: e.target.value })}
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
                                        value={formData.foreign_telephone}
                                        onChange={(e) => setFormData({ ...formData, foreign_telephone: e.target.value })}
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
                                        value={formData.education_level}
                                        onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
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
                                            name="employed_on_campus"
                                            id="employed-yes"
                                            label="Yes"
                                            value="yes"
                                            checked={formData.employed_on_campus === "yes"}
                                            onChange={(e) => setFormData({ ...formData, employed_on_campus: e.target.value })}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            name="employed_on_campus"
                                            id="employed-no"
                                            label="No"
                                            value="no"
                                            checked={formData.employed_on_campus === "no"}
                                            onChange={(e) => setFormData({ ...formData, employed_on_campus: e.target.value })}
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
                                        value={formData.departure_date}
                                        onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
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
                                            name="departure_reason"
                                            id="reason-temporary"
                                            label="I am taking a temporary leave of absence and departing the United States."
                                            value="temporary"
                                            checked={formData.departure_reason === "Completing my graduate studies and returning home"}
                                            onChange={(e) => setFormData({ ...formData, departure_reason: "Completing my graduate studies and returning home" })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <CFormCheck
                                            type="radio"
                                            name="departure_reason"
                                            id="reason-discontinuing"
                                            label="I am discontinuing my studies and am permanently departing the United States."
                                            value="discontinuing"
                                            checked={formData.departure_reason === "Discontinuing my studies and returning home"}
                                            onChange={(e) => setFormData({ ...formData, departure_reason: "Discontinuing my studies and returning home" })}
                                        />
                                    </div>
                                    <div>
                                        <CFormCheck
                                            type="radio"
                                            name="departure_reason"
                                            id="reason-completed"
                                            label="I have completed my program and am permanently departing the United States."
                                            value="completed"
                                            checked={formData.departure_reason === "Completed my program and returning home"}
                                            onChange={(e) => setFormData({ ...formData, departure_reason: "Completed my program and returning home" })}
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
                                        checked={formData.work_authorization_acknowledgment}
                                        onChange={(e) => setFormData({ ...formData, work_authorization_acknowledgment: e.target.checked })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        id="cpt-opt"
                                        label="I understand that taking a leave of absence from the University of Central Florida can either delay or deny my eligibility for Curricular Practical Training (CPT) or Optional Practical Training (OPT)."
                                        checked={formData.cpt_opt_acknowledgment}
                                        onChange={(e) => setFormData({ ...formData, cpt_opt_acknowledgment: e.target.checked })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        id="financial-obligations"
                                        label="I understand I am responsible for resolving any outstanding financial obligations with the University of Central Florida, even after my exit from the United States."
                                        checked={formData.financial_obligations_acknowledgment}
                                        onChange={(e) => setFormData({ ...formData, financial_obligations_acknowledgment: e.target.checked })}
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
                                    'Submit'
                                )}
                            </CButton>
                            <CButton
                                type="button"
                                color="danger"
                                className="text-white"
                                onClick={() => navigate('/forms/all-requests')}
                            >
                                Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
