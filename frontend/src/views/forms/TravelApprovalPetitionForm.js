import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CForm, CFormInput, CFormSelect, CFormCheck,
    CRow, CCol, CButton, CAlert, CSpinner, CFormLabel, CFormTextarea
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function TravelApprovalPetitionForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Personal Information
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
        phoneNumber: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '',
        countryOfCitizenship: '',
        visaType: '',

        // Travel Details
        fromDate: '',
        toDate: '',
        country: '',
        city: '',
        accommodation: '',
        address: '',

        // Host Country Contact
        hostContactName: '',
        hostContactEmail: '',
        hostContactPhone: '',
        hostContactAddress: '',
        hostContactRelationship: '',

        // Purpose of Travel
        purpose: '',
        activityName: '',
        venueOfProgram: '',
        websiteOfProgram: '',
        institutions: '',

        // Compliance Checkboxes
        internationalCollaboration: false,
        vpnAccess: false,
        ucfEquipment: false,
        laptopExport: false,
        nonPublishedDesign: false,
        fieldSamples: false,
        shippingItems: false
    })

    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
            const formDataToSubmit = new FormData()

            // Convert form data to snake_case for backend
            Object.entries(formData).forEach(([key, value]) => {
                // Convert boolean values to string
                const submitValue = typeof value === 'boolean' ? value.toString() : value
                formDataToSubmit.append(key, submitValue)
            })

            const response = await fetch('http://localhost:8000/api/travel-approval-petition/', {
                method: 'POST',
                body: formDataToSubmit
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            const responseData = await response.json()
            console.log('Travel Approval Petition submitted successfully:', responseData)

            setSubmitSuccess(true)
            setTimeout(() => navigate('/forms/all-requests'), 2000)
        } catch (err) {
            console.error('Error submitting Travel Approval Petition:', err)
            setSubmitError(err.message || 'An error occurred while submitting the form.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <CCard>
            <CCardHeader className="bg-primary text-white">
                <strong>Travel Approval Petition</strong>
            </CCardHeader>
            <CCardBody>
                {submitError && (
                    <CAlert color="danger" className="mb-4">
                        {submitError}
                    </CAlert>
                )}

                {submitSuccess && (
                    <CAlert color="success" className="mb-4">
                        Travel Approval Petition submitted successfully! Redirecting...
                    </CAlert>
                )}

                <CForm onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <h5 className="border-bottom pb-2 mb-3">Personal Information</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>UCF ID</CFormLabel>
                            <CFormInput
                                type="text"
                                name="ucfId"
                                value={formData.ucfId}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>First Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Last Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Email</CFormLabel>
                            <CFormInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Phone Number</CFormLabel>
                            <CFormInput
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Country of Citizenship</CFormLabel>
                            <CFormSelect
                                name="countryOfCitizenship"
                                value={formData.countryOfCitizenship}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Mexico">Mexico</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    {/* Travel Details Section */}
                    <h5 className="border-bottom pb-2 mb-3 mt-4">Travel Details</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>From Date</CFormLabel>
                            <CFormInput
                                type="date"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>To Date</CFormLabel>
                            <CFormInput
                                type="date"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Country</CFormLabel>
                            <CFormSelect
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Mexico">Mexico</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>City</CFormLabel>
                            <CFormInput
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Purpose of Travel Section */}
                    <h5 className="border-bottom pb-2 mb-3 mt-4">Purpose of Travel</h5>
                    <CRow className="mb-3">
                        <CCol md={12}>
                            <CFormLabel>Purpose</CFormLabel>
                            <CFormSelect
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Purpose</option>
                                <option value="research">Research</option>
                                <option value="conference">Conference</option>
                                <option value="academic_collaboration">Academic Collaboration</option>
                                <option value="professional_development">Professional Development</option>
                                <option value="other">Other</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Activity Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="activityName"
                                value={formData.activityName}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Venue of Program</CFormLabel>
                            <CFormInput
                                type="text"
                                name="venueOfProgram"
                                value={formData.venueOfProgram}
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>

                    {/* Compliance Section */}
                    <h5 className="border-bottom pb-2 mb-3 mt-4">Compliance Acknowledgements</h5>
                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                name="internationalCollaboration"
                                label="I intend to collaborate with an international person, entity, government, university, business, or other organization"
                                checked={formData.internationalCollaboration}
                                onChange={handleChange}
                            />
                            <CFormCheck
                                type="checkbox"
                                name="vpnAccess"
                                label="I will access VPN into UCF's IT network from outside the United States"
                                checked={formData.vpnAccess}
                                onChange={handleChange}
                            />
                            <CFormCheck
                                type="checkbox"
                                name="ucfEquipment"
                                label="I will hand-carry or export UCF-owned equipment or technical data (documents, information, research equipment, laptops, PDAs, etc.) out of the United States"
                                checked={formData.ucfEquipment}
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>

                    {/* Submission Section */}
                    <CRow className="mt-4">
                        <CCol>
                            <CButton
                                color="primary"
                                type="submit"
                                className="w-100"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <CSpinner size="sm" className="me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Travel Approval Petition'
                                )}
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    )
}
