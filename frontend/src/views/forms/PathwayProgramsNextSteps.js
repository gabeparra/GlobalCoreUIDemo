import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CForm, CCol, CRow, CFormInput, CFormLabel, CFormSelect,
    CButton, CAlert, CSpinner, CFormCheck
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function PathwayProgramsNextSteps() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Personal Information
        ucf_id: '',
        first_name: '',
        last_name: '',
        legal_sex: '',
        email: '',
        phone_number: '',

        // Academic Information
        academic_program: '',
        academic_track: '',
        intended_major: '',

        // Dietary Requirements
        dietary_requirements: '',

        // Housing
        housing_selection: '',

        // Acknowledgements
        program_acknowledgement: false,
        housing_acknowledgement: false,
        health_insurance_acknowledgement: false
    })

    const [loading, setLoading] = useState(false)
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
            // Personal Information
            ucf_id: import.meta.env.VITE_PLACEHOLDER_PATHWAY_UCF_ID,
            first_name: import.meta.env.VITE_PLACEHOLDER_PATHWAY_FIRST_NAME,
            last_name: import.meta.env.VITE_PLACEHOLDER_PATHWAY_LAST_NAME,
            legal_sex: 'M', // Default, as not specified in env
            email: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || 'test@ucf.edu',
            phone_number: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE,

            // Academic Information
            academic_program: 'UOBL Intensive English Program',
            academic_track: import.meta.env.VITE_PLACEHOLDER_PATHWAY_INTENDED_MAJOR,
            intended_major: import.meta.env.VITE_PLACEHOLDER_PATHWAY_INTENDED_MAJOR,

            // Dietary Requirements
            dietary_requirements: 'No',

            // Housing
            housing_selection: 'NorthView',

            // Acknowledgements
            program_acknowledgement: true,
            housing_acknowledgement: true,
            health_insurance_acknowledgement: true
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
                // Convert boolean values to string 'true' or 'false'
                const processedValue = typeof value === 'boolean' ? value.toString() : value
                formDataToSubmit.append(key, processedValue)
                console.log(`Submitting ${key}: ${processedValue} (type: ${typeof processedValue})`)
            })

            console.log('Full form data:', JSON.stringify(formData, null, 2))
            console.log('Submitting form to:', 'http://localhost:8000/api/pathway-programs-next-steps/') // Add logging

            const response = await fetch('http://localhost:8000/api/pathway-programs-next-steps/', {
                method: 'POST',
                body: formDataToSubmit
            })

            console.log('Response status:', response.status) // Add logging

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error response:', errorText) // Add logging
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            const responseData = await response.json()
            console.log('Submission response:', responseData) // Add logging

            setSuccess(true)
            setTimeout(() => navigate('/forms/all-requests'), 2000)
        } catch (err) {
            console.error('Error submitting form:', err)
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
                        <strong>Pathway Programs Next Steps</strong>
                        <small className="ms-2">Complete your next steps for UCF Global Pathway Programs</small>
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
                {success && <CAlert color="success">Form submitted successfully! Redirecting...</CAlert>}

                <CForm onSubmit={handleSubmit}>
                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>UCF ID</CFormLabel>
                            <CFormInput
                                type="text"
                                name="ucf_id"
                                value={formData.ucf_id}
                                onChange={handleChange}
                                placeholder="Enter your UCF ID"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Legal Sex</CFormLabel>
                            <CFormSelect
                                name="legal_sex"
                                value={formData.legal_sex}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Legal Sex</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>First Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Last Name</CFormLabel>
                            <CFormInput
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Email</CFormLabel>
                            <CFormInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Phone Number</CFormLabel>
                            <CFormInput
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Academic Program</CFormLabel>
                            <CFormSelect
                                name="academic_program"
                                value={formData.academic_program}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Academic Program</option>
                                <option value="UOBL Intensive English Program">UOBL Intensive English Program</option>
                                <option value="Other">Other</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Academic Track</CFormLabel>
                            <CFormInput
                                type="text"
                                name="academic_track"
                                value={formData.academic_track}
                                onChange={handleChange}
                                placeholder="Enter your academic track"
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol md={6}>
                            <CFormLabel>Intended Major</CFormLabel>
                            <CFormInput
                                type="text"
                                name="intended_major"
                                value={formData.intended_major}
                                onChange={handleChange}
                                placeholder="Enter your intended major"
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormLabel>Do you have any dietary requirements?</CFormLabel>
                            <CFormSelect
                                name="dietary_requirements"
                                value={formData.dietary_requirements}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol>
                            <CFormLabel>Housing Selection</CFormLabel>
                            <CFormSelect
                                name="housing_selection"
                                value={formData.housing_selection}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Housing Option</option>
                                <option value="NorthView">NorthView</option>
                                <option value="Towers">Towers</option>
                                <option value="The Verge">The Verge</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                name="program_acknowledgement"
                                label="I understand the program requirements and conditions"
                                checked={formData.program_acknowledgement}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                name="housing_acknowledgement"
                                label="I understand the housing selection process and requirements"
                                checked={formData.housing_acknowledgement}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CCol>
                            <CFormCheck
                                type="checkbox"
                                name="health_insurance_acknowledgement"
                                label="I understand the health insurance requirements"
                                checked={formData.health_insurance_acknowledgement}
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
                                {loading ? <><CSpinner size="sm" /> Submitting...</> : 'Submit Next Steps Form'}
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    )
}
