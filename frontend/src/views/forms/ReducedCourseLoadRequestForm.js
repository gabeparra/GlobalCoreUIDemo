import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CForm, CCol, CRow, CFormInput, CFormLabel, CFormSelect,
    CButton, CAlert, CSpinner, CFormCheck
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function ReducedCourseLoadRequestForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Student Information
        ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        sevis_id: '',
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

        // Academic Information
        academic_level: '',
        academic_program_major: import.meta.env.VITE_PLACEHOLDER_ACADEMIC_PROGRAM || '',
        rcl_term: '',
        rcl_year: '',
        desired_credits: '',
        in_person_credits: '',

        // RCL Reason
        rcl_reason: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const fillDummyData = () => {
        setFormData({
            // Student Information
            ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID,
            sevis_id: 'N1234567',
            visa_type: 'F-1',
            given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME,
            family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME,
            street_address: import.meta.env.VITE_PLACEHOLDER_STREET_ADDRESS,
            apartment_number: '2B',
            city: import.meta.env.VITE_PLACEHOLDER_CITY,
            state: import.meta.env.VITE_PLACEHOLDER_STATE,
            postal_code: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE,
            ucf_email_address: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL,
            secondary_email_address: 'personal@email.com',
            us_telephone_number: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE,

            // Academic Information
            academic_level: 'Undergraduate',
            academic_program_major: 'Computer Science BS',
            rcl_term: 'Fall',
            rcl_year: '2024',
            desired_credits: '6',
            in_person_credits: '3',

            // RCL Reason
            rcl_reason: 'Academic Difficulties'
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
                formDataToSubmit.append(key, value)
            })

            console.log('Submitting Reduced Course Load Request:', formData)

            const response = await fetch('http://localhost:8000/api/reduced-course-load/', {
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
            console.error('Error submitting Reduced Course Load Request:', err)
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
                        <strong>Reduced Course Load (RCL) Request</strong>
                        <small className="ms-2">Submit your RCL approval request</small>
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
                {error && <CAlert color="danger">{error}</CAlert>}
                {success && <CAlert color="success">Reduced Course Load Request submitted successfully! Redirecting...</CAlert>}

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
                                required
                            />
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">Academic Information</h5>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Academic Level</CFormLabel>
                            <CFormSelect
                                name="academic_level"
                                value={formData.academic_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Academic Level</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Doctoral">Doctoral</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Academic Program/Major</CFormLabel>
                            <CFormInput
                                type="text"
                                name="academic_program_major"
                                value={formData.academic_program_major}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>RCL Term</CFormLabel>
                            <CFormSelect
                                name="rcl_term"
                                value={formData.rcl_term}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Term</option>
                                <option value="Fall">Fall</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>RCL Year</CFormLabel>
                            <CFormSelect
                                name="rcl_year"
                                value={formData.rcl_year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Desired Number of Credits to Enroll at UCF for RCL Term</CFormLabel>
                            <CFormInput
                                type="number"
                                name="desired_credits"
                                value={formData.desired_credits}
                                onChange={handleChange}
                                required
                                min="0"
                                max="12"
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>How many of the credits will be "in-person" (P, M, RS, RA)?</CFormLabel>
                            <CFormInput
                                type="number"
                                name="in_person_credits"
                                value={formData.in_person_credits}
                                onChange={handleChange}
                                required
                                min="0"
                                max="12"
                            />
                        </CCol>
                    </CRow>

                    <h5 className="border-bottom pb-2 mb-3 mt-4">RCL Reason</h5>
                    <CRow className="mb-3">
                        <CCol>
                            <CFormLabel>I am submitting this form for this reason...</CFormLabel>
                            <div className="d-flex gap-3">
                                <CFormCheck
                                    type="radio"
                                    name="rcl_reason"
                                    id="academic_difficulties"
                                    label="Academic Difficulties"
                                    value="Academic Difficulties"
                                    checked={formData.rcl_reason === 'Academic Difficulties'}
                                    onChange={handleChange}
                                />
                                <CFormCheck
                                    type="radio"
                                    name="rcl_reason"
                                    id="medical_condition"
                                    label="Medical Condition"
                                    value="Medical Condition"
                                    checked={formData.rcl_reason === 'Medical Condition'}
                                    onChange={handleChange}
                                />
                                <CFormCheck
                                    type="radio"
                                    name="rcl_reason"
                                    id="completion_of_study"
                                    label="Completion of Study"
                                    value="Completion of Study"
                                    checked={formData.rcl_reason === 'Completion of Study'}
                                    onChange={handleChange}
                                />
                                <CFormCheck
                                    type="radio"
                                    name="rcl_reason"
                                    id="concurrent_enrollment"
                                    label="Concurrent Enrollment"
                                    value="Concurrent Enrollment"
                                    checked={formData.rcl_reason === 'Concurrent Enrollment'}
                                    onChange={handleChange}
                                />
                            </div>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                id="submission_acknowledgement"
                                label="I have reviewed the guidelines outlined on this eForm. I understand that requesting an RCL does not automatically grant permission to enroll in less than a full course of study. I understand that UCF Global must approve this request before I am permitted to enroll in fewer than the mandatory minimum credits needed to otherwise maintain status in the United States."
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
                                {loading ? <><CSpinner size="sm" /> Submitting...</> : 'Submit Reduced Course Load Request'}
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    )
}
