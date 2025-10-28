import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormCheck,
    CButton, CAlert, CSpinner, CFormLabel
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function PathwayProgramsIntentToProgress() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const [formData, setFormData] = useState({
        // Student Information
        ucf_id: import.meta.env.VITE_PLACEHOLDER_PATHWAY_UCF_ID || '',
        given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        date_of_birth: import.meta.env.VITE_PLACEHOLDER_PATHWAY_DATE_OF_BIRTH || '',
        ethnicity: import.meta.env.VITE_PLACEHOLDER_PATHWAY_ETHNICITY || '',

        // Permanent Address
        street_address: import.meta.env.VITE_PLACEHOLDER_PATHWAY_STREET_ADDRESS || '',
        state: import.meta.env.VITE_PLACEHOLDER_PATHWAY_STATE || '',
        city: import.meta.env.VITE_PLACEHOLDER_PATHWAY_CITY || '',
        postal_code: import.meta.env.VITE_PLACEHOLDER_PATHWAY_POSTAL_CODE || '',
        country: import.meta.env.VITE_PLACEHOLDER_PATHWAY_COUNTRY || '',

        // UCF Global Program
        ucf_global_program: import.meta.env.VITE_PLACEHOLDER_PATHWAY_GLOBAL_PROGRAM || '',

        // Emergency Contact
        emergency_contact_name: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_NAME || '',
        emergency_contact_relationship: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_RELATIONSHIP || '',
        emergency_contact_street_address: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_STREET_ADDRESS || '',
        emergency_contact_city: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_CITY || '',
        emergency_contact_state: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_STATE || '',
        emergency_contact_postal_code: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_POSTAL_CODE || '',
        emergency_contact_country: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_COUNTRY || '',
        emergency_contact_phone: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EMERGENCY_CONTACT_PHONE || '',

        // Application Information
        expected_progression_term: import.meta.env.VITE_PLACEHOLDER_PATHWAY_EXPECTED_PROGRESSION_TERM || '',
        academic_credits_earned: import.meta.env.VITE_PLACEHOLDER_PATHWAY_ACADEMIC_CREDITS_EARNED || '',
        intended_major: import.meta.env.VITE_PLACEHOLDER_PATHWAY_INTENDED_MAJOR || '',
        has_accelerated_credits: import.meta.env.VITE_PLACEHOLDER_PATHWAY_HAS_ACCELERATED_CREDITS === 'true',

        // Post-Secondary Information
        attended_other_institutions: import.meta.env.VITE_PLACEHOLDER_PATHWAY_ATTENDED_OTHER_INSTITUTIONS === 'true',

        // College Entrance Exams
        sat_total_score: import.meta.env.VITE_PLACEHOLDER_PATHWAY_SAT_TOTAL_SCORE || '',
        sat_date_taken: import.meta.env.VITE_PLACEHOLDER_PATHWAY_SAT_DATE_TAKEN || '',
        act_total_score: import.meta.env.VITE_PLACEHOLDER_PATHWAY_ACT_TOTAL_SCORE || '',
        act_date_taken: import.meta.env.VITE_PLACEHOLDER_PATHWAY_ACT_DATE_TAKEN || '',

        // Crime/Disciplinary Questions
        disciplinary_action: import.meta.env.VITE_PLACEHOLDER_PATHWAY_DISCIPLINARY_ACTION === 'true',
        felony_conviction: import.meta.env.VITE_PLACEHOLDER_PATHWAY_FELONY_CONVICTION === 'true',
        criminal_proceedings: import.meta.env.VITE_PLACEHOLDER_PATHWAY_CRIMINAL_PROCEEDINGS === 'true',

        // Disclaimer
        certification: import.meta.env.VITE_PLACEHOLDER_PATHWAY_CERTIFICATION === 'true'
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')
        setSubmitSuccess(false)

        try {
            const submitData = new FormData()

            // Add all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    // Convert booleans to string for FormData
                    const value = typeof formData[key] === 'boolean'
                        ? formData[key].toString()
                        : formData[key]

                    submitData.append(key, value)
                }
            })

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
            const response = await fetch(`${backendUrl}/api/pathway-programs-intent-to-progress/`, {
                method: 'POST',
                body: submitData
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`Server error: ${response.status} - ${errorData}`)
            }

            const result = await response.json()
            console.log('Pathway Programs Intent to Progress submitted successfully:', result)

            setSubmitSuccess(true)

            // Redirect to All Requests List after 2 seconds
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (error) {
            console.error('Error submitting Pathway Programs Intent to Progress:', error)
            setSubmitError(`Failed to submit form: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Pathway Programs Intent to Progress</strong>
                                <small className="ms-2 text-white">Submit your Intent to Progress</small>
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        {submitError && (
                            <CAlert color="danger" className="mb-3">
                                {submitError}
                            </CAlert>
                        )}

                        {submitSuccess && (
                            <CAlert color="success" className="mb-3">
                                Pathway Programs Intent to Progress submitted successfully! Redirecting to All Requests List...
                            </CAlert>
                        )}

                        <CForm onSubmit={handleSubmit}>
                            {/* Student Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Student Information</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>UCF ID</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="ucf_id"
                                            value={formData.ucf_id}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Given Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="given_name"
                                            value={formData.given_name}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Family Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="family_name"
                                            value={formData.family_name}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Date of Birth</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Ethnicity</CFormLabel>
                                        <CFormSelect
                                            name="ethnicity"
                                            value={formData.ethnicity}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="Hispanic or Latino">Hispanic or Latino</option>
                                            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                                            <option value="Asian">Asian</option>
                                            <option value="African American">African American</option>
                                            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                                            <option value="White">White</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Permanent Address Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Permanent Address</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Street Address</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="street_address"
                                            value={formData.street_address}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>State</CFormLabel>
                                        <CFormSelect
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="FL">Florida</option>
                                            <option value="CA">California</option>
                                            <option value="NY">New York</option>
                                            <option value="TX">Texas</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>City</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Postal Code</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Country</CFormLabel>
                                        <CFormSelect
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Mexico">Mexico</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* UCF Global Program Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">UCF Global Program</h5>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>UCF Global Program</CFormLabel>
                                        <CFormSelect
                                            name="ucf_global_program"
                                            value={formData.ucf_global_program}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="UCF Global Achievement Academy - GAA II">UCF Global Achievement Academy - GAA II</option>
                                            <option value="UCF Global Achievement Academy - GAA III">UCF Global Achievement Academy - GAA III</option>
                                            <option value="UCF Global Achievement Academy - GAA UI - University Integration">UCF Global Achievement Academy - GAA UI - University Integration</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Emergency Contact Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Emergency Contact</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Emergency Contact Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="emergency_contact_name"
                                            value={formData.emergency_contact_name}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Relationship</CFormLabel>
                                        <CFormSelect
                                            name="emergency_contact_relationship"
                                            value={formData.emergency_contact_relationship}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Guardian">Guardian</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Friend">Friend</option>
                                            <option value="Other Relative">Other Relative</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Street Address</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="emergency_contact_street_address"
                                            value={formData.emergency_contact_street_address}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>City</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="emergency_contact_city"
                                            value={formData.emergency_contact_city}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>State</CFormLabel>
                                        <CFormSelect
                                            name="emergency_contact_state"
                                            value={formData.emergency_contact_state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="FL">Florida</option>
                                            <option value="CA">California</option>
                                            <option value="NY">New York</option>
                                            <option value="TX">Texas</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Postal Code</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="emergency_contact_postal_code"
                                            value={formData.emergency_contact_postal_code}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Country</CFormLabel>
                                        <CFormSelect
                                            name="emergency_contact_country"
                                            value={formData.emergency_contact_country}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Mexico">Mexico</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Phone</CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            name="emergency_contact_phone"
                                            value={formData.emergency_contact_phone}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Application Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Application Information</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Expected Progression Term</CFormLabel>
                                        <CFormSelect
                                            name="expected_progression_term"
                                            value={formData.expected_progression_term}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="Fall 2024">Fall 2024</option>
                                            <option value="Spring 2025">Spring 2025</option>
                                            <option value="Summer 2025">Summer 2025</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Number of Academic Credits Earned at UCF</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            name="academic_credits_earned"
                                            value={formData.academic_credits_earned}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Intended Major</CFormLabel>
                                        <CFormSelect
                                            name="intended_major"
                                            value={formData.intended_major}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Biology">Biology</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Do you have any IB, AP, AICE, AS/A Level, CAPE, or CLEP accelerated credits?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                name="has_accelerated_credits"
                                                id="has_accelerated_credits_yes"
                                                label="Yes"
                                                value="true"
                                                checked={formData.has_accelerated_credits === true}
                                                onChange={() => setFormData(prev => ({ ...prev, has_accelerated_credits: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="has_accelerated_credits"
                                                id="has_accelerated_credits_no"
                                                label="No"
                                                value="false"
                                                checked={formData.has_accelerated_credits === false}
                                                onChange={() => setFormData(prev => ({ ...prev, has_accelerated_credits: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Post-Secondary Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Post-Secondary Information</h5>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Have you attended any other Post-Secondary institutions (Colleges or Universities) other than the University of Central Florida?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                name="attended_other_institutions"
                                                id="attended_other_institutions_yes"
                                                label="Yes"
                                                value="true"
                                                checked={formData.attended_other_institutions === true}
                                                onChange={() => setFormData(prev => ({ ...prev, attended_other_institutions: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="attended_other_institutions"
                                                id="attended_other_institutions_no"
                                                label="No"
                                                value="false"
                                                checked={formData.attended_other_institutions === false}
                                                onChange={() => setFormData(prev => ({ ...prev, attended_other_institutions: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* College Entrance Exams Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">College Entrance Exams</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>SAT Total Score</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            name="sat_total_score"
                                            value={formData.sat_total_score}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>SAT Date Taken or Scheduled</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="sat_date_taken"
                                            value={formData.sat_date_taken}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>ACT Total Score</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            name="act_total_score"
                                            value={formData.act_total_score}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>ACT Date Taken or Scheduled</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="act_date_taken"
                                            value={formData.act_date_taken}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Crime/Disciplinary Questions Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Crime/Disciplinary Questions</h5>
                                <p className="text-muted mb-3">
                                    NOTE: You do not need to disclose any academic dismissal, suspension or probation that was due entirely to poor grades.
                                    If you answered any of the questions below with a "YES", please list all actions or charges and provide specifics.
                                </p>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Are you currently or have you ever been subject to disciplinary action for misconduct at an educational institution?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                name="disciplinary_action"
                                                id="disciplinary_action_yes"
                                                label="Yes"
                                                value="true"
                                                checked={formData.disciplinary_action === true}
                                                onChange={() => setFormData(prev => ({ ...prev, disciplinary_action: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="disciplinary_action"
                                                id="disciplinary_action_no"
                                                label="No"
                                                value="false"
                                                checked={formData.disciplinary_action === false}
                                                onChange={() => setFormData(prev => ({ ...prev, disciplinary_action: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Have you ever been convicted of a felony?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                name="felony_conviction"
                                                id="felony_conviction_yes"
                                                label="Yes"
                                                value="true"
                                                checked={formData.felony_conviction === true}
                                                onChange={() => setFormData(prev => ({ ...prev, felony_conviction: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="felony_conviction"
                                                id="felony_conviction_no"
                                                label="No"
                                                value="false"
                                                checked={formData.felony_conviction === false}
                                                onChange={() => setFormData(prev => ({ ...prev, felony_conviction: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>In the past 10 years, and including any pending charges, have you been the subject of any criminal proceedings other than a minor traffic violation? DUI is a crime, not a "minor" traffic violation.</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                name="criminal_proceedings"
                                                id="criminal_proceedings_yes"
                                                label="Yes"
                                                value="true"
                                                checked={formData.criminal_proceedings === true}
                                                onChange={() => setFormData(prev => ({ ...prev, criminal_proceedings: true }))}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="criminal_proceedings"
                                                id="criminal_proceedings_no"
                                                label="No"
                                                value="false"
                                                checked={formData.criminal_proceedings === false}
                                                onChange={() => setFormData(prev => ({ ...prev, criminal_proceedings: false }))}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Disclaimer Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Disclaimer</h5>
                                <p className="text-muted mb-3">
                                    NOTE EXPUNGED RECORDS: We are not responsible if records you believe were expunged are revealed to the university.
                                    Please provide any specifics on a separate sheet of paper which you did not have space to include.
                                </p>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormCheck
                                            type="checkbox"
                                            id="certification"
                                            name="certification"
                                            label="I certify the information provided on this form to be true and accurate."
                                            checked={formData.certification}
                                            onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.checked }))}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Submit Button */}
                            <div className="d-flex justify-content-end">
                                <CButton
                                    type="submit"
                                    color="primary"
                                    size="lg"
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
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
