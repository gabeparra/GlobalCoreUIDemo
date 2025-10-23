import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormCheck,
    CButton, CAlert, CSpinner, CFormLabel, CFormTextarea
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function OptStemExtensionApplication() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Form data with values from .env or fallback defaults
    const [formData, setFormData] = useState({
        // Contact Information - using .env values
        ucf_id: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '12345678',
        given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || 'Alex',
        family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || 'Rodriguez',
        date_of_birth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || '1997-03-22',
        gender: import.meta.env.VITE_PLACEHOLDER_LEGAL_SEX === 'male' ? 'Male' : 'Female',
        country_of_citizenship: import.meta.env.VITE_PLACEHOLDER_COUNTRY_OF_CITIZENSHIP || 'United States',
        academic_level: 'Graduate',
        academic_program: 'Computer Science',

        // Current U.S. Mailing Address - using .env values
        address: import.meta.env.VITE_PLACEHOLDER_STREET_ADDRESS || '456 Innovation Drive',
        address_2: '',
        city: import.meta.env.VITE_PLACEHOLDER_CITY || 'Orlando',
        state: import.meta.env.VITE_PLACEHOLDER_STATE || 'FL',
        postal_code: '32816',
        ucf_email_address: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || 'student@knights.ucf.edu',
        secondary_email_address: '',
        telephone_number: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '(407) 555-9876',

        // Employment Information - fake data
        job_title: 'Software Engineer',
        employer_name: 'Tech Innovations LLC',
        employer_ein: '98-7654321',
        employment_street_address: '789 Business Park Blvd',
        employment_city: 'Orlando',
        employment_state: 'Florida',
        employment_postal_code: '32801',
        supervisor_first_name: 'Jane',
        supervisor_last_name: 'Williams',
        supervisor_email: 'jane.williams@techinnovations.com',
        supervisor_telephone: '407-555-2468',
        hours_per_week: '40',
        is_paid_position: 'true',
        is_staffing_firm: 'false',
        has_e_verify: 'true',

        // Additional Information
        based_on_previous_stem_degree: 'false',

        // Statements of Agreement - all pre-checked for testing
        completed_stem_workshop: 'true',
        provide_ead_copy: 'true',
        understand_unemployment_limits: 'true',
        notify_changes: 'true',
        submit_updated_i983: 'true',
        comply_reporting_requirements: 'true',
        reviewed_photo_requirements: 'true',
        reviewed_fee_payment: 'true'
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked.toString() : value
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
                    submitData.append(key, formData[key])
                }
            })

            const response = await fetch('http://localhost:8000/api/opt-stem-applications/', {
                method: 'POST',
                body: submitData
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`Server error: ${response.status} - ${errorData}`)
            }

            const result = await response.json()
            console.log('OPT STEM Extension Application submitted successfully:', result)

            setSubmitSuccess(true)

            // Redirect to All Requests List after 2 seconds
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (error) {
            console.error('Error submitting OPT STEM Extension Application:', error)
            setSubmitError(`Failed to submit application: ${error.message}`)
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
                                <strong>OPT STEM EXTENSION APPLICATION</strong>
                                <small className="ms-2 text-white">Submit your OPT STEM Extension application</small>
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
                                OPT STEM Extension Application submitted successfully! Redirecting to All Requests List...
                            </CAlert>
                        )}

                        <CForm onSubmit={handleSubmit}>
                            {/* Contact Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">
                                    <i className="cil-user me-2"></i>
                                    Contact Information
                                </h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="ucf_id">UCFID</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="ucf_id"
                                            name="ucf_id"
                                            value={formData.ucf_id}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="given_name">Given Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="given_name"
                                            name="given_name"
                                            value={formData.given_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="family_name">Family Name / Surname</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="family_name"
                                            name="family_name"
                                            value={formData.family_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="date_of_birth">Date Of Birth</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="gender">Gender</CFormLabel>
                                        <CFormSelect
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select one</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="country_of_citizenship">Country of Citizenship</CFormLabel>
                                        <CFormSelect
                                            id="country_of_citizenship"
                                            name="country_of_citizenship"
                                            value={formData.country_of_citizenship}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select one</option>
                                            <option value="Colombia">Colombia</option>
                                            <option value="Mexico">Mexico</option>
                                            <option value="Brazil">Brazil</option>
                                            <option value="India">India</option>
                                            <option value="China">China</option>
                                            <option value="Other">Other</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="academic_level">Academic Level</CFormLabel>
                                        <CFormSelect
                                            id="academic_level"
                                            name="academic_level"
                                            value={formData.academic_level}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select One</option>
                                            <option value="Undergraduate">Undergraduate</option>
                                            <option value="Graduate">Graduate</option>
                                            <option value="Doctoral">Doctoral</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="academic_program">Academic Program / Plan</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="academic_program"
                                            name="academic_program"
                                            value={formData.academic_program}
                                            onChange={handleInputChange}
                                            placeholder="Academic Program / Plan"
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Current U.S. Mailing Address Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Current U.S. Mailing Address</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="address">Address</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="address_2">Address 2</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="address_2"
                                            name="address_2"
                                            value={formData.address_2}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="city">City</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="state">State</CFormLabel>
                                        <CFormSelect
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select one</option>
                                            <option value="Florida">Florida</option>
                                            <option value="California">California</option>
                                            <option value="Texas">Texas</option>
                                            <option value="New York">New York</option>
                                            <option value="Other">Other</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="postal_code">Postal Code</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="postal_code"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="ucf_email_address">UCF Email Address</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            id="ucf_email_address"
                                            name="ucf_email_address"
                                            value={formData.ucf_email_address}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="secondary_email_address">Secondary Email Address</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            id="secondary_email_address"
                                            name="secondary_email_address"
                                            value={formData.secondary_email_address}
                                            onChange={handleInputChange}
                                            placeholder="Secondary Email"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="telephone_number">Telephone Number</CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            id="telephone_number"
                                            name="telephone_number"
                                            value={formData.telephone_number}
                                            onChange={handleInputChange}
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Employment Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">
                                    <i className="cil-briefcase me-2"></i>
                                    Employment Information
                                </h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="job_title">Job Title / Position</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="job_title"
                                            name="job_title"
                                            value={formData.job_title}
                                            onChange={handleInputChange}
                                            placeholder="Job Title / Position"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employer_name">Employer (Company) Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="employer_name"
                                            name="employer_name"
                                            value={formData.employer_name}
                                            onChange={handleInputChange}
                                            placeholder="Employer Name"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employer_ein">Employer EIN</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="employer_ein"
                                            name="employer_ein"
                                            value={formData.employer_ein}
                                            onChange={handleInputChange}
                                            placeholder="EIN"
                                        />
                                        <small className="text-muted">
                                            Note: An Employer Identification Number (EIN) is a nine-digit number assigned to an employer by the Internal Revenue Service (IRS) for the purpose of taxation.
                                        </small>
                                    </CCol>
                                </CRow>

                                <h6 className="mt-4 mb-3">Physical Address of Employment</h6>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employment_street_address">Street Address</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="employment_street_address"
                                            name="employment_street_address"
                                            value={formData.employment_street_address}
                                            onChange={handleInputChange}
                                            placeholder="Address"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employment_city">City</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="employment_city"
                                            name="employment_city"
                                            value={formData.employment_city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employment_state">State</CFormLabel>
                                        <CFormSelect
                                            id="employment_state"
                                            name="employment_state"
                                            value={formData.employment_state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select one</option>
                                            <option value="Florida">Florida</option>
                                            <option value="California">California</option>
                                            <option value="Texas">Texas</option>
                                            <option value="New York">New York</option>
                                            <option value="Other">Other</option>
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="employment_postal_code">Postal Code</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="employment_postal_code"
                                            name="employment_postal_code"
                                            value={formData.employment_postal_code}
                                            onChange={handleInputChange}
                                            placeholder="Postal Code"
                                        />
                                    </CCol>
                                </CRow>

                                <h6 className="mt-4 mb-3">Supervisor Information</h6>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="supervisor_first_name">Supervisor First Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="supervisor_first_name"
                                            name="supervisor_first_name"
                                            value={formData.supervisor_first_name}
                                            onChange={handleInputChange}
                                            placeholder="Supervisor First Name"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="supervisor_last_name">Supervisor Last Name</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="supervisor_last_name"
                                            name="supervisor_last_name"
                                            value={formData.supervisor_last_name}
                                            onChange={handleInputChange}
                                            placeholder="Supervisor Last Name"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="supervisor_email">Supervisor Email Address</CFormLabel>
                                        <CFormInput
                                            type="email"
                                            id="supervisor_email"
                                            name="supervisor_email"
                                            value={formData.supervisor_email}
                                            onChange={handleInputChange}
                                            placeholder="Supervisor Email"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="supervisor_telephone">Supervisor Telephone Number</CFormLabel>
                                        <CFormInput
                                            type="tel"
                                            id="supervisor_telephone"
                                            name="supervisor_telephone"
                                            value={formData.supervisor_telephone}
                                            onChange={handleInputChange}
                                            placeholder="Supervisor Phone"
                                        />
                                    </CCol>
                                </CRow>

                                <h6 className="mt-4 mb-3">Work Hours and Employment Type Questions</h6>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="hours_per_week">Hours per week</CFormLabel>
                                        <CFormInput
                                            type="number"
                                            id="hours_per_week"
                                            name="hours_per_week"
                                            value={formData.hours_per_week}
                                            onChange={handleInputChange}
                                            placeholder="Hours"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Is this a paid position?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                id="is_paid_position_yes"
                                                name="is_paid_position"
                                                value="true"
                                                checked={formData.is_paid_position === 'true'}
                                                onChange={handleInputChange}
                                                label="Yes"
                                            />
                                            <CFormCheck
                                                type="radio"
                                                id="is_paid_position_no"
                                                name="is_paid_position"
                                                value="false"
                                                checked={formData.is_paid_position === 'false'}
                                                onChange={handleInputChange}
                                                label="No"
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Are you being employed through a staffing or consulting firm ("temp" agency)?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                id="is_staffing_firm_yes"
                                                name="is_staffing_firm"
                                                value="true"
                                                checked={formData.is_staffing_firm === 'true'}
                                                onChange={handleInputChange}
                                                label="Yes"
                                            />
                                            <CFormCheck
                                                type="radio"
                                                id="is_staffing_firm_no"
                                                name="is_staffing_firm"
                                                value="false"
                                                checked={formData.is_staffing_firm === 'false'}
                                                onChange={handleInputChange}
                                                label="No"
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel>Does your employer have an E-Verify number?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                id="has_e_verify_yes"
                                                name="has_e_verify"
                                                value="true"
                                                checked={formData.has_e_verify === 'true'}
                                                onChange={handleInputChange}
                                                label="Yes"
                                            />
                                            <CFormCheck
                                                type="radio"
                                                id="has_e_verify_no"
                                                name="has_e_verify"
                                                value="false"
                                                checked={formData.has_e_verify === 'false'}
                                                onChange={handleInputChange}
                                                label="No"
                                            />
                                        </div>
                                        <small className="text-muted">
                                            Note: An E-Verify number is not the same as an EIN. An E-Verify number is a 4-7 digit number assigned to an employer by the Department of Homeland Security for the purposes of lawful hiring.
                                        </small>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Additional Information Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">+ Additional Information</h5>
                                <CRow className="mb-3">
                                    <CCol>
                                        <CFormLabel>Is this OPT STEM Extension Application based on a previous STEM degree you have earned prior to your most recent degree?</CFormLabel>
                                        <div>
                                            <CFormCheck
                                                type="radio"
                                                id="based_on_previous_stem_degree_yes"
                                                name="based_on_previous_stem_degree"
                                                value="true"
                                                checked={formData.based_on_previous_stem_degree === 'true'}
                                                onChange={handleInputChange}
                                                label="Yes"
                                            />
                                            <CFormCheck
                                                type="radio"
                                                id="based_on_previous_stem_degree_no"
                                                name="based_on_previous_stem_degree"
                                                value="false"
                                                checked={formData.based_on_previous_stem_degree === 'false'}
                                                onChange={handleInputChange}
                                                label="No"
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Document Upload Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">
                                    <i className="cil-file me-2"></i>
                                    Document Upload
                                </h5>
                                <p className="text-muted mb-3">All document uploads are optional for testing purposes.</p>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="photo_2x2">2 Inch X 2 Inch Photo</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="photo_2x2"
                                            name="photo_2x2"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, photo_2x2: file }))
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="form_i983">Form I-983</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="form_i983"
                                            name="form_i983"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, form_i983: file }))
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="passport">Passport (biographical page)</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="passport"
                                            name="passport"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, passport: file }))
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="f1_visa">Most Recent F-1 Visa (Located in passport) or USCIS Notice of Action</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="f1_visa"
                                            name="f1_visa"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, f1_visa: file }))
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="i94">Most Recent I-94</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="i94"
                                            name="i94"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, i94: file }))
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="ead_card">Most Recent Employment Authorization Document (EAD Card)</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="ead_card"
                                            name="ead_card"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, ead_card: file }))
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="form_i765">Form I-765</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="form_i765"
                                            name="form_i765"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, form_i765: file }))
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <small className="text-muted">
                                            Students filing the I-765 online must upload the "Draft Snapshot" of the I-765 which can be downloaded from the Online I-765. View the <a href="#" target="_blank">STEM Extension WebCourse</a> for additional information.
                                        </small>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="form_g1145">Form G-1145</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="form_g1145"
                                            name="form_g1145"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, form_g1145: file }))
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <small className="text-muted">
                                            Students filing the I-765 online do not complete the G-1145.
                                        </small>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="diploma">Diploma</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="diploma"
                                            name="diploma"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, diploma: file }))
                                                }
                                            }}
                                            accept="image/*,.pdf"
                                        />
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Transcripts and Forms I-20 Uploads Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">Transcripts and Forms I-20 Uploads</h5>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="transcripts">Transcripts</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="transcripts"
                                            name="transcripts"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, transcripts: file }))
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="previous_i20s">Copies of all previous Forms I-20 (order from newest to oldest)</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            id="previous_i20s"
                                            name="previous_i20s"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    setFormData(prev => ({ ...prev, previous_i20s: file }))
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <small className="text-muted">
                                            Students filing the I-765 online are not required to provide copies of previous Forms I-20.
                                        </small>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Statements of Agreement Section */}
                            <div className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">
                                    <i className="cil-check me-2"></i>
                                    Statements of Agreement
                                </h5>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="completed_stem_workshop"
                                        name="completed_stem_workshop"
                                        checked={formData.completed_stem_workshop === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, completed_stem_workshop: e.target.checked.toString() }))}
                                        label="I certify that I have completed the UCF Global STEM OPT Workshop in WebCourses and scored a 100% on the quiz."
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="provide_ead_copy"
                                        name="provide_ead_copy"
                                        checked={formData.provide_ead_copy === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, provide_ead_copy: e.target.checked.toString() }))}
                                        label="I will provide a photocopy of the extended EAD card (front and back) to UCF Global once it is received."
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="understand_unemployment_limits"
                                        name="understand_unemployment_limits"
                                        checked={formData.understand_unemployment_limits === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, understand_unemployment_limits: e.target.checked.toString() }))}
                                        label="I understand my unemployment limits during the OPT STEM Extension period (60 additional days of unemployment, not including unused unemployment days from previous OPT period)"
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="notify_changes"
                                        name="notify_changes"
                                        checked={formData.notify_changes === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notify_changes: e.target.checked.toString() }))}
                                        label="I will notify UCF Global of any changes of address, legal name, employer name, or physical employment address within 10 days of the change."
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="submit_updated_i983"
                                        name="submit_updated_i983"
                                        checked={formData.submit_updated_i983 === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, submit_updated_i983: e.target.checked.toString() }))}
                                        label="I agree to submit an updated Form I-983 Training Plan within 10 days of the change if changing employers or a \ material change\ occurs in employment. Please refer to the OPT STEM Extension Webcourse for examples of a \ material change.\"
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="comply_reporting_requirements"
                                        name="comply_reporting_requirements"
                                        checked={formData.comply_reporting_requirements === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, comply_reporting_requirements: e.target.checked.toString() }))}
                                        label="I agree to comply with the reporting and evaluation requirements as detailed in the OPT STEM Extension Webcourse."
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="reviewed_photo_requirements"
                                        name="reviewed_photo_requirements"
                                        checked={formData.reviewed_photo_requirements === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, reviewed_photo_requirements: e.target.checked.toString() }))}
                                        label="I confirm that I have reviewed the \ Photo Requirements\ section of the STEM Extension WebCourse and my photos meet the requirements."
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormCheck
                                        type="checkbox"
                                        id="reviewed_fee_payment"
                                        name="reviewed_fee_payment"
                                        checked={formData.reviewed_fee_payment === 'true'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, reviewed_fee_payment: e.target.checked.toString() }))}
                                        label="I confirm that I have reviewed the I-765 fee payment options and will include the proper fee with my application."
                                    />
                                </div>
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
                                        'Submit Application'
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
