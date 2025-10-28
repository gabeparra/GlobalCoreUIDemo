import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CForm, CCol, CRow, CFormInput, CFormLabel, CFormSelect,
    CButton, CAlert, CFormCheck, CInputGroup, CInputGroupText
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function GlobalTransferOutForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Student Information
        ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        sevis_id: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || '',
        visa_type: '',
        given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        street_address: import.meta.env.VITE_PLACEHOLDER_ADDRESS || '',
        apartment_number: '',
        city: import.meta.env.VITE_PLACEHOLDER_CITY || '',
        state: import.meta.env.VITE_PLACEHOLDER_STATE || '',
        postal_code: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE || '',
        ucf_email_address: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
        secondary_email_address: '',
        us_telephone_number: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '',

        // Current Academic Information
        ucf_education_level: '',
        campus_employment: '',

        // New School Information
        new_school_name: '',
        new_school_start_date: '',
        desired_sevis_release_date: '',
        new_school_international_advisor_name: '',
        new_school_international_advisor_email: '',
        new_school_international_advisor_phone: '',

        // Additional Information Checkboxes
        understanding_sevis_release: false,
        permission_to_communicate: false,
        understanding_work_authorization: false,
        understanding_financial_obligations: false
    })

    const [loading, setLoading] = useState(false)
    const [admissionLetter, setAdmissionLetter] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const fillDummyData = () => {
        setFormData({
            // Student Information
            ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
            sevis_id: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || 'N1234567',
            visa_type: 'F-1',
            given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
            family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
            street_address: import.meta.env.VITE_PLACEHOLDER_ADDRESS || '',
            apartment_number: import.meta.env.VITE_PLACEHOLDER_APARTMENT || '2B',
            city: import.meta.env.VITE_PLACEHOLDER_CITY || '',
            state: import.meta.env.VITE_PLACEHOLDER_STATE || '',
            postal_code: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE || '',
            ucf_email_address: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
            secondary_email_address: import.meta.env.VITE_PLACEHOLDER_SECONDARY_EMAIL || 'personal@email.com',
            us_telephone_number: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '',

            // Current Academic Information
            ucf_education_level: 'Undergraduate',
            campus_employment: 'No',

            // New School Information
            new_school_name: import.meta.env.VITE_PLACEHOLDER_NEW_SCHOOL_NAME || 'Example University',
            new_school_start_date: '2024-08-15',
            desired_sevis_release_date: '2024-08-01',
            new_school_international_advisor_name: import.meta.env.VITE_PLACEHOLDER_ADVISOR_NAME || 'Jane Doe',
            new_school_international_advisor_email: import.meta.env.VITE_PLACEHOLDER_ADVISOR_EMAIL || 'advisor@example.edu',
            new_school_international_advisor_phone: import.meta.env.VITE_PLACEHOLDER_ADVISOR_PHONE || '123-456-7890',

            // Additional Information Checkboxes
            understanding_sevis_release: true,
            permission_to_communicate: true,
            understanding_work_authorization: true,
            understanding_financial_obligations: true
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const formDataToSubmit = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                // Convert boolean values to string for FormData
                if (typeof value === 'boolean') {
                    formDataToSubmit.append(key, value.toString())
                } else {
                    formDataToSubmit.append(key, value)
                }
            })

            if (admissionLetter) {
                formDataToSubmit.append('admission_letter', admissionLetter)
            }

            console.log('Submitting Global Transfer Out Request:', formData)

            const response = await fetch('http://localhost:8000/api/global-transfer-out/', {
                method: 'POST',
                body: formDataToSubmit
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            const responseData = await response.json()
            console.log('Submission response:', responseData)

            setSuccess(true)
            setTimeout(() => navigate('/forms/all-requests'), 2000)
        } catch (err) {
            console.error('Error submitting Global Transfer Out Request:', err)
            setError(err.message || 'An error occurred while submitting the form.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <CCard>
            <CCardHeader className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>UCF Global Transfer Out Form</strong>
                        <small className="ms-2">SEVIS Record Transfer Request</small>
                    </div>
                    <CButton
                        color="warning"
                        size="sm"
                        onClick={fillDummyData}
                    >
                        Fill Dummy Data
                    </CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <CAlert color="info" className="mb-4">
                    This eForm should be completed by international students in F-1 or J-1 status who wish to transfer their SEVIS record from the University of Central Florida to a new school in the United States.
                    <br />
                    <a
                        href="https://global.ucf.edu/sevis-transfer-out-requests"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="alert-link"
                    >
                        For details and information on transfer timelines and transfer consequences, please visit our webpage on SEVIS Transfer Out Requests.
                    </a>
                </CAlert>

                <CForm onSubmit={handleSubmit}>
                    <h5 className="border-bottom pb-2 mb-3">Student Information</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>UCF ID</CFormLabel>
                            <CFormInput
                                type="text"
                                name="ucf_id"
                                value={formData.ucf_id}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>SEVIS ID</CFormLabel>
                            <CFormInput
                                type="text"
                                name="sevis_id"
                                value={formData.sevis_id}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Visa Type</CFormLabel>
                            <CFormSelect
                                name="visa_type"
                                value={formData.visa_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Visa Type</option>
                                <option value="F-1">F-1</option>
                                <option value="J-1">J-1</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Given Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="given_name"
                                value={formData.given_name}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Family Name/Surname</CFormLabel>
                            <CFormInput
                                type="text"
                                name="family_name"
                                value={formData.family_name}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Street Address</CFormLabel>
                            <CFormInput
                                type="text"
                                name="street_address"
                                value={formData.street_address}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={4}>
                            <CFormLabel>Apartment Number</CFormLabel>
                            <CFormInput
                                type="text"
                                name="apartment_number"
                                value={formData.apartment_number}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormLabel>City</CFormLabel>
                            <CFormInput
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormLabel>State</CFormLabel>
                            <CFormSelect
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select State</option>
                                <option value="FL">Florida</option>
                                <option value="CA">California</option>
                                <option value="NY">New York</option>
                                <option value="TX">Texas</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Postal Code</CFormLabel>
                            <CFormInput
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>UCF Email Address</CFormLabel>
                            <CFormInput
                                type="email"
                                name="ucf_email_address"
                                value={formData.ucf_email_address}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Secondary Email Address</CFormLabel>
                            <CFormInput
                                type="email"
                                name="secondary_email_address"
                                value={formData.secondary_email_address}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>U.S. Telephone Number</CFormLabel>
                            <CFormInput
                                type="tel"
                                name="us_telephone_number"
                                value={formData.us_telephone_number}
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">Current Academic Information</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>UCF Education Level</CFormLabel>
                            <CFormSelect
                                name="ucf_education_level"
                                value={formData.ucf_education_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Education Level</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Doctoral">Doctoral</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Are you currently employed on campus at UCF?</CFormLabel>
                            <CFormSelect
                                name="campus_employment"
                                value={formData.campus_employment}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">New School Information</h5>
                    <CRow className="mb-3">
                        <CCol md={12}>
                            <CFormLabel>New School Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="new_school_name"
                                value={formData.new_school_name}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>New School Start Date</CFormLabel>
                            <CFormInput
                                type="date"
                                name="new_school_start_date"
                                value={formData.new_school_start_date}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Desired SEVIS Release Date</CFormLabel>
                            <CFormInput
                                type="date"
                                name="desired_sevis_release_date"
                                value={formData.desired_sevis_release_date}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={4}>
                            <CFormLabel>New School International Student Advisor Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="new_school_international_advisor_name"
                                value={formData.new_school_international_advisor_name}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormLabel>Advisor Email</CFormLabel>
                            <CFormInput
                                type="email"
                                name="new_school_international_advisor_email"
                                value={formData.new_school_international_advisor_email}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormLabel>Advisor Phone</CFormLabel>
                            <CFormInput
                                type="tel"
                                name="new_school_international_advisor_phone"
                                value={formData.new_school_international_advisor_phone}
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">Upload Documents (Optional)</h5>
                    <CRow className="mb-3">
                        <CCol>
                            <CFormLabel>New School Admission Letter</CFormLabel>
                            <CFormInput
                                type="file"
                                name="admission_letter"
                                onChange={(e) => setAdmissionLetter(e.target.files[0])}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {admissionLetter && (
                                <small className="text-muted">Selected: {admissionLetter.name}</small>
                            )}
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">Additional Information</h5>
                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                name="understanding_sevis_release"
                                label="I understand that after the SEVIS release date, UCF Global will be unable to assist with any matters relating to my SEVIS record."
                                checked={formData.understanding_sevis_release}
                                onChange={handleChange}
                                required
                            />
                            <CFormCheck
                                type="checkbox"
                                name="permission_to_communicate"
                                label="I give permission to UCF Global to communicate about my transfer with the new school listed above."
                                checked={formData.permission_to_communicate}
                                onChange={handleChange}
                                required
                            />
                            <CFormCheck
                                type="checkbox"
                                name="understanding_work_authorization"
                                label="If I am on Optional Practical Training (OPT) or STEM Extension, Curricular Practical Training (CPT), Academic Training, or working on-campus at the University of Central Florida, I understand that my work authorization ends on the date my SEVIS record is released to the new school and that I must notify my supervisor and the Human Resources Business Center of my upcoming departure from the University of Central Florida."
                                checked={formData.understanding_work_authorization}
                                onChange={handleChange}
                                required
                            />
                            <CFormCheck
                                type="checkbox"
                                name="understanding_financial_obligations"
                                label="I understand I am responsible for resolving any outstanding financial obligations with the University of Central Florida, even after a SEVIS transfer out occurs."
                                checked={formData.understanding_financial_obligations}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol>
                            <CButton
                                color="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                            >
                                Submit Global Transfer Out Request
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    )
}
