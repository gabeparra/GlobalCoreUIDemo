// src/views/forms/OPTRequestForm.js
import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormCheck,
    CButton, CAlert, CSpinner, CContainer, CFormLabel,
    CFormTextarea, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function OPTRequestForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    // Contact Information State
    const [contactInfo, setContactInfo] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '1234567',
        givenName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || 'John',
        familyName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || 'Smith',
        dateOfBirth: import.meta.env.VITE_PLACEHOLDER_DATE_OF_BIRTH || '1995-01-15',
        legalSex: import.meta.env.VITE_PLACEHOLDER_LEGAL_SEX || 'Male',
        countryOfCitizenship: 'United States',
        academicLevel: 'Graduate',
        academicProgram: 'Computer Science',
        address: import.meta.env.VITE_PLACEHOLDER_ADDRESS || '123 Main Street',
        address2: '',
        city: import.meta.env.VITE_PLACEHOLDER_CITY || 'Orlando',
        state: import.meta.env.VITE_PLACEHOLDER_STATE || 'Florida',
        postalCode: import.meta.env.VITE_PLACEHOLDER_POSTAL_CODE || '32825',
        ucfEmailAddress: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || 'john.smith@ucf.edu',
        secondaryEmailAddress: 'john.smith.personal@gmail.com',
        telephoneNumber: import.meta.env.VITE_PLACEHOLDER_PHONE || '407-123-4567',
        informationCorrect: true
    })

    // Questionnaire State
    const [questionnaire, setQuestionnaire] = useState({
        fullTimeStudent: 'Yes',
        intentToGraduate: 'Yes',
        semesterOfGraduation: 'Spring 2025',
        desiredOPTStartDate: '2025-06-01',
        desiredOPTEndDate: '2026-05-31',
        currentlyEmployedOnCampus: 'No',
        previousOPTAuthorization: 'No'
    })

    // Document Upload State
    const [documents, setDocuments] = useState({
        photo2x2: null,
        passportBiographical: null,
        f1VisaOrUSCISNotice: null,
        i94: null,
        formI765: null,
        formG1145: null,
        previousI20s: null,
        previousEAD: null
    })

    // Statements of Agreement State
    const [agreements, setAgreements] = useState({
        optWorkshopCompleted: true,
        optRequestTimeline: true,
        eadCardCopy: true,
        reportChanges: true,
        unemploymentLimit: true,
        employmentStartDate: true
    })

    const handleContactInfoChange = (field, value) => {
        setContactInfo(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleQuestionnaireChange = (field, value) => {
        setQuestionnaire(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleDocumentChange = (field, file) => {
        setDocuments(prev => ({
            ...prev,
            [field]: file
        }))
    }

    const handleAgreementChange = (field, checked) => {
        setAgreements(prev => ({
            ...prev,
            [field]: checked
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Validate required fields
            if (!contactInfo.informationCorrect) {
                throw new Error('Please confirm that your information is correct and up to date.')
            }

            if (!agreements.optWorkshopCompleted) {
                throw new Error('You must certify completion of the UCF Global OPT Workshop.')
            }

            if (!agreements.optRequestTimeline) {
                throw new Error('You must understand the OPT Request timeline requirements.')
            }

            if (!agreements.eadCardCopy) {
                throw new Error('You must agree to provide a copy of your EAD card.')
            }

            if (!agreements.reportChanges) {
                throw new Error('You must agree to report changes to UCF Global.')
            }

            if (!agreements.unemploymentLimit) {
                throw new Error('You must understand the unemployment limit requirements.')
            }

            if (!agreements.employmentStartDate) {
                throw new Error('You must understand the employment start date requirements.')
            }

            // Create FormData for file uploads
            const formData = new FormData()

            // Add contact information with snake_case conversion
            const contactInfoSnakeCase = {
                ucf_id: contactInfo.ucfId,
                given_name: contactInfo.givenName,
                family_name: contactInfo.familyName,
                date_of_birth: contactInfo.dateOfBirth,
                legal_sex: contactInfo.legalSex,
                country_of_citizenship: contactInfo.countryOfCitizenship,
                academic_level: contactInfo.academicLevel,
                academic_program: contactInfo.academicProgram,
                address: contactInfo.address,
                address2: contactInfo.address2,
                city: contactInfo.city,
                state: contactInfo.state,
                postal_code: contactInfo.postalCode,
                ucf_email_address: contactInfo.ucfEmailAddress,
                secondary_email_address: contactInfo.secondaryEmailAddress,
                telephone_number: contactInfo.telephoneNumber,
                information_correct: contactInfo.informationCorrect
            }

            Object.keys(contactInfoSnakeCase).forEach(key => {
                formData.append(key, contactInfoSnakeCase[key])
            })

            // Add questionnaire data with snake_case conversion
            const questionnaireSnakeCase = {
                full_time_student: questionnaire.fullTimeStudent,
                intent_to_graduate: questionnaire.intentToGraduate,
                semester_of_graduation: questionnaire.semesterOfGraduation,
                desired_opt_start_date: questionnaire.desiredOPTStartDate,
                desired_opt_end_date: questionnaire.desiredOPTEndDate,
                currently_employed_on_campus: questionnaire.currentlyEmployedOnCampus,
                previous_opt_authorization: questionnaire.previousOPTAuthorization
            }

            Object.keys(questionnaireSnakeCase).forEach(key => {
                formData.append(key, questionnaireSnakeCase[key])
            })

            // Add document files with snake_case conversion
            const documentsSnakeCase = {
                photo2x2: documents.photo2x2,
                passport_biographical: documents.passportBiographical,
                f1_visa_or_uscis_notice: documents.f1VisaOrUSCISNotice,
                i94: documents.i94,
                form_i765: documents.formI765,
                form_g1145: documents.formG1145,
                previous_i20s: documents.previousI20s,
                previous_ead: documents.previousEAD
            }

            Object.keys(documentsSnakeCase).forEach(key => {
                if (documentsSnakeCase[key]) {
                    formData.append(key, documentsSnakeCase[key])
                }
            })

            // Add agreements with snake_case conversion
            const agreementsSnakeCase = {
                opt_workshop_completed: agreements.optWorkshopCompleted,
                opt_request_timeline: agreements.optRequestTimeline,
                ead_card_copy: agreements.eadCardCopy,
                report_changes: agreements.reportChanges,
                unemployment_limit: agreements.unemploymentLimit,
                employment_start_date: agreements.employmentStartDate
            }

            Object.keys(agreementsSnakeCase).forEach(key => {
                formData.append(key, agreementsSnakeCase[key])
            })

            // Add metadata
            formData.append('program', 'OPT Request')
            formData.append('submission_date', new Date().toISOString())

            console.log('Submitting OPT Request Form...')
            console.log('Contact Info:', contactInfo)
            console.log('Questionnaire:', questionnaire)
            console.log('Documents:', Object.keys(documents).filter(key => documents[key]))
            console.log('Agreements:', agreements)

            const response = await fetch('http://localhost:8000/api/opt-requests/', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`Server error: ${response.status} - ${errorData}`)
            }

            const result = await response.json()
            console.log('OPT Request submitted successfully:', result)

            setSuccess(true)
            setTimeout(() => {
                navigate('/')
            }, 2000)

        } catch (err) {
            console.error('Error submitting OPT Request:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    return (
        <CContainer fluid>
            <CRow className="justify-content-center">
                <CCol xs={12} lg={10}>
                    <CCard>
                        <CCardHeader className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">OPT REQUEST FORM</h4>
                                    <small>UCF Global - Optional Practical Training Request</small>
                                </div>
                                <div className="text-end">
                                    <small>Complete all sections below</small>
                                </div>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            {error && <CAlert color="danger">{error}</CAlert>}
                            {success && <CAlert color="success">OPT Request submitted successfully! Redirecting...</CAlert>}

                            <CForm onSubmit={handleSubmit}>
                                {/* Contact Information Section */}
                                <CAccordion activeItemKey="contact-info">
                                    <CAccordionItem itemKey="contact-info">
                                        <CAccordionHeader>
                                            <div className="d-flex align-items-center">
                                                <i className="cil-user me-2"></i>
                                                Contact Information
                                            </div>
                                        </CAccordionHeader>
                                        <CAccordionBody>
                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="ucfId">UCF ID</CFormLabel>
                                                    <CFormInput
                                                        id="ucfId"
                                                        type="text"
                                                        value={contactInfo.ucfId}
                                                        onChange={(e) => handleContactInfoChange('ucfId', e.target.value)}
                                                        placeholder="e.g., 1234567"
                                                        required
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="givenName">Given Name</CFormLabel>
                                                    <CFormInput
                                                        id="givenName"
                                                        type="text"
                                                        value={contactInfo.givenName}
                                                        onChange={(e) => handleContactInfoChange('givenName', e.target.value)}
                                                        placeholder="e.g., John"
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="familyName">Family Name / Surname</CFormLabel>
                                                    <CFormInput
                                                        id="familyName"
                                                        type="text"
                                                        value={contactInfo.familyName}
                                                        onChange={(e) => handleContactInfoChange('familyName', e.target.value)}
                                                        placeholder="e.g., Smith"
                                                        required
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="dateOfBirth">Date of Birth</CFormLabel>
                                                    <CFormInput
                                                        id="dateOfBirth"
                                                        type="date"
                                                        value={contactInfo.dateOfBirth}
                                                        onChange={(e) => handleContactInfoChange('dateOfBirth', e.target.value)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="legalSex">Legal Sex</CFormLabel>
                                                    <CFormSelect
                                                        id="legalSex"
                                                        value={contactInfo.legalSex}
                                                        onChange={(e) => handleContactInfoChange('legalSex', e.target.value)}
                                                        required
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="countryOfCitizenship">Country of Citizenship</CFormLabel>
                                                    <CFormSelect
                                                        id="countryOfCitizenship"
                                                        value={contactInfo.countryOfCitizenship}
                                                        onChange={(e) => handleContactInfoChange('countryOfCitizenship', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select one</option>
                                                        <option value="United States">United States</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Mexico">Mexico</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="Germany">Germany</option>
                                                        <option value="France">France</option>
                                                        <option value="China">China</option>
                                                        <option value="India">India</option>
                                                        <option value="Brazil">Brazil</option>
                                                        <option value="Other">Other</option>
                                                    </CFormSelect>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="academicLevel">Academic Level</CFormLabel>
                                                    <CFormSelect
                                                        id="academicLevel"
                                                        value={contactInfo.academicLevel}
                                                        onChange={(e) => handleContactInfoChange('academicLevel', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select One</option>
                                                        <option value="Undergraduate">Undergraduate</option>
                                                        <option value="Graduate">Graduate</option>
                                                        <option value="Doctoral">Doctoral</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="academicProgram">Academic Program / Plan</CFormLabel>
                                                    <CFormInput
                                                        id="academicProgram"
                                                        type="text"
                                                        value={contactInfo.academicProgram}
                                                        onChange={(e) => handleContactInfoChange('academicProgram', e.target.value)}
                                                        placeholder="Academic Program / Plan"
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <h5 className="mt-4 mb-3">Address Information</h5>
                                            <CRow className="mb-3">
                                                <CCol md={8}>
                                                    <CFormLabel htmlFor="address">Address</CFormLabel>
                                                    <CFormInput
                                                        id="address"
                                                        type="text"
                                                        value={contactInfo.address}
                                                        onChange={(e) => handleContactInfoChange('address', e.target.value)}
                                                        placeholder="e.g., 123 Main St"
                                                        required
                                                    />
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="address2">Address 2</CFormLabel>
                                                    <CFormInput
                                                        id="address2"
                                                        type="text"
                                                        value={contactInfo.address2}
                                                        onChange={(e) => handleContactInfoChange('address2', e.target.value)}
                                                        placeholder="e.g., Apt 2B, Suite 100"
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="city">City</CFormLabel>
                                                    <CFormInput
                                                        id="city"
                                                        type="text"
                                                        value={contactInfo.city}
                                                        onChange={(e) => handleContactInfoChange('city', e.target.value)}
                                                        placeholder="e.g., Orlando"
                                                        required
                                                    />
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="state">State</CFormLabel>
                                                    <CFormSelect
                                                        id="state"
                                                        value={contactInfo.state}
                                                        onChange={(e) => handleContactInfoChange('state', e.target.value)}
                                                        required
                                                    >
                                                        <option value="Florida">Florida</option>
                                                        <option value="California">California</option>
                                                        <option value="New York">New York</option>
                                                        <option value="Texas">Texas</option>
                                                        <option value="Other">Other</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={4}>
                                                    <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
                                                    <CFormInput
                                                        id="postalCode"
                                                        type="text"
                                                        value={contactInfo.postalCode}
                                                        onChange={(e) => handleContactInfoChange('postalCode', e.target.value)}
                                                        placeholder="e.g., 32825"
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <h5 className="mt-4 mb-3">Contact Details</h5>
                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="ucfEmailAddress">UCF Email Address</CFormLabel>
                                                    <CFormInput
                                                        id="ucfEmailAddress"
                                                        type="email"
                                                        value={contactInfo.ucfEmailAddress}
                                                        onChange={(e) => handleContactInfoChange('ucfEmailAddress', e.target.value)}
                                                        placeholder="e.g., john.smith@ucf.edu"
                                                        required
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="secondaryEmailAddress">Secondary Email Address</CFormLabel>
                                                    <CFormInput
                                                        id="secondaryEmailAddress"
                                                        type="email"
                                                        value={contactInfo.secondaryEmailAddress}
                                                        onChange={(e) => handleContactInfoChange('secondaryEmailAddress', e.target.value)}
                                                        placeholder="Secondary Email"
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="telephoneNumber">Telephone Number</CFormLabel>
                                                    <CFormInput
                                                        id="telephoneNumber"
                                                        type="tel"
                                                        value={contactInfo.telephoneNumber}
                                                        onChange={(e) => handleContactInfoChange('telephoneNumber', e.target.value)}
                                                        placeholder="e.g., 407-123-4567"
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="informationCorrect"
                                                        label="The above information is correct and up to date."
                                                        checked={contactInfo.informationCorrect}
                                                        onChange={(e) => handleContactInfoChange('informationCorrect', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                                {/* Questionnaire Section */}
                                <CAccordion className="mt-3">
                                    <CAccordionItem itemKey="questionnaire">
                                        <CAccordionHeader>
                                            <div className="d-flex align-items-center">
                                                <i className="cil-speech me-2"></i>
                                                Questionnaire
                                            </div>
                                        </CAccordionHeader>
                                        <CAccordionBody>
                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormLabel>Have you been enrolled as a full-time student for the previous academic year (Fall & Spring semesters)?</CFormLabel>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <CFormCheck
                                                            type="radio"
                                                            name="fullTimeStudent"
                                                            id="fullTimeYes"
                                                            label="Yes"
                                                            value="Yes"
                                                            checked={questionnaire.fullTimeStudent === 'Yes'}
                                                            onChange={(e) => handleQuestionnaireChange('fullTimeStudent', e.target.value)}
                                                        />
                                                        <CFormCheck
                                                            type="radio"
                                                            name="fullTimeStudent"
                                                            id="fullTimeNo"
                                                            label="No"
                                                            value="No"
                                                            checked={questionnaire.fullTimeStudent === 'No'}
                                                            onChange={(e) => handleQuestionnaireChange('fullTimeStudent', e.target.value)}
                                                        />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormLabel>Have you filed an intent to graduate?</CFormLabel>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <CFormCheck
                                                            type="radio"
                                                            name="intentToGraduate"
                                                            id="intentYes"
                                                            label="Yes"
                                                            value="Yes"
                                                            checked={questionnaire.intentToGraduate === 'Yes'}
                                                            onChange={(e) => handleQuestionnaireChange('intentToGraduate', e.target.value)}
                                                        />
                                                        <CFormCheck
                                                            type="radio"
                                                            name="intentToGraduate"
                                                            id="intentNo"
                                                            label="No"
                                                            value="No"
                                                            checked={questionnaire.intentToGraduate === 'No'}
                                                            onChange={(e) => handleQuestionnaireChange('intentToGraduate', e.target.value)}
                                                        />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="semesterOfGraduation">Semester of Intended Graduation</CFormLabel>
                                                    <CFormSelect
                                                        id="semesterOfGraduation"
                                                        value={questionnaire.semesterOfGraduation}
                                                        onChange={(e) => handleQuestionnaireChange('semesterOfGraduation', e.target.value)}
                                                    >
                                                        <option value="">Select one</option>
                                                        <option value="Fall 2024">Fall 2024</option>
                                                        <option value="Spring 2025">Spring 2025</option>
                                                        <option value="Summer 2025">Summer 2025</option>
                                                        <option value="Fall 2025">Fall 2025</option>
                                                        <option value="Spring 2026">Spring 2026</option>
                                                        <option value="Summer 2026">Summer 2026</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormLabel htmlFor="desiredOPTStartDate">Desired OPT Start Date</CFormLabel>
                                                    <CFormInput
                                                        id="desiredOPTStartDate"
                                                        type="date"
                                                        value={questionnaire.desiredOPTStartDate}
                                                        onChange={(e) => handleQuestionnaireChange('desiredOPTStartDate', e.target.value)}
                                                    />
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormLabel htmlFor="desiredOPTEndDate">Desired OPT End Date</CFormLabel>
                                                    <CFormInput
                                                        id="desiredOPTEndDate"
                                                        type="date"
                                                        value={questionnaire.desiredOPTEndDate}
                                                        onChange={(e) => handleQuestionnaireChange('desiredOPTEndDate', e.target.value)}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormLabel>Are you currently employed on campus?</CFormLabel>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <CFormCheck
                                                            type="radio"
                                                            name="currentlyEmployedOnCampus"
                                                            id="employedYes"
                                                            label="Yes"
                                                            value="Yes"
                                                            checked={questionnaire.currentlyEmployedOnCampus === 'Yes'}
                                                            onChange={(e) => handleQuestionnaireChange('currentlyEmployedOnCampus', e.target.value)}
                                                        />
                                                        <CFormCheck
                                                            type="radio"
                                                            name="currentlyEmployedOnCampus"
                                                            id="employedNo"
                                                            label="No"
                                                            value="No"
                                                            checked={questionnaire.currentlyEmployedOnCampus === 'No'}
                                                            onChange={(e) => handleQuestionnaireChange('currentlyEmployedOnCampus', e.target.value)}
                                                        />
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormLabel>Have you ever been authorized for Optional Practical Training (OPT) in the past?</CFormLabel>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <CFormCheck
                                                            type="radio"
                                                            name="previousOPTAuthorization"
                                                            id="previousOPTYes"
                                                            label="Yes"
                                                            value="Yes"
                                                            checked={questionnaire.previousOPTAuthorization === 'Yes'}
                                                            onChange={(e) => handleQuestionnaireChange('previousOPTAuthorization', e.target.value)}
                                                        />
                                                        <CFormCheck
                                                            type="radio"
                                                            name="previousOPTAuthorization"
                                                            id="previousOPTNo"
                                                            label="No"
                                                            value="No"
                                                            checked={questionnaire.previousOPTAuthorization === 'No'}
                                                            onChange={(e) => handleQuestionnaireChange('previousOPTAuthorization', e.target.value)}
                                                        />
                                                    </div>
                                                </CCol>
                                            </CRow>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                                {/* Document Upload and Statements Section */}
                                <CAccordion className="mt-3">
                                    <CAccordionItem itemKey="documents">
                                        <CAccordionHeader>
                                            <div className="d-flex align-items-center">
                                                <i className="cil-cloud-upload me-2"></i>
                                                Document Upload & Statements of Agreement
                                            </div>
                                        </CAccordionHeader>
                                        <CAccordionBody>
                                            <h5 className="mb-3">Document Upload</h5>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="photo2x2">2 Inch X 2 Inch Photo</CFormLabel>
                                                    <CFormInput
                                                        id="photo2x2"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleDocumentChange('photo2x2', e.target.files[0])}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="passportBiographical">Passport (Biographical Page)</CFormLabel>
                                                    <CFormInput
                                                        id="passportBiographical"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleDocumentChange('passportBiographical', e.target.files[0])}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="f1VisaOrUSCISNotice">Most Recent F-1 Visa (Located in Passport) or USCIS Notice of Action</CFormLabel>
                                                    <CFormInput
                                                        id="f1VisaOrUSCISNotice"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleDocumentChange('f1VisaOrUSCISNotice', e.target.files[0])}
                                                    />
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="i94">Most Recent I-94</CFormLabel>
                                                    <CFormInput
                                                        id="i94"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleDocumentChange('i94', e.target.files[0])}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="formI765">Form I-765</CFormLabel>
                                                    <CFormInput
                                                        id="formI765"
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => handleDocumentChange('formI765', e.target.files[0])}
                                                    />
                                                    <small className="text-muted">
                                                        Students filing the I-765 online must upload the "Draft Snapshot" of the I-765 which can be downloaded from the Online I-765.
                                                    </small>
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="formG1145">Form G-1145</CFormLabel>
                                                    <CFormInput
                                                        id="formG1145"
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => handleDocumentChange('formG1145', e.target.files[0])}
                                                    />
                                                    <small className="text-muted">
                                                        Students filing the I-765 online do not complete the G-1145.
                                                    </small>
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="previousI20s">Copies of previous Forms I-20s showing CPT at this degree level or previous OPT at a different degree level</CFormLabel>
                                                    <CFormInput
                                                        id="previousI20s"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleDocumentChange('previousI20s', e.target.files[0])}
                                                    />
                                                    <small className="text-muted">
                                                        If you have never obtained previous CPT or OPT work authorization, do not upload anything here.
                                                    </small>
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormLabel htmlFor="previousEAD">Scanned copy of previous EAD, if applicable</CFormLabel>
                                                    <CFormInput
                                                        id="previousEAD"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleDocumentChange('previousEAD', e.target.files[0])}
                                                    />
                                                </CCol>
                                            </CRow>

                                            <h5 className="mt-4 mb-3">Statements of Agreement</h5>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="optWorkshopCompleted"
                                                        label="I certify that I have completed the UCF Global OPT Workshop in WebCourses including passing all 5 quizzes with a 100%."
                                                        checked={agreements.optWorkshopCompleted}
                                                        onChange={(e) => handleAgreementChange('optWorkshopCompleted', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="optRequestTimeline"
                                                        label="I understand that my OPT Request must be received by United States Citizenship and Immigration Services (USCIS) within 30 days of the date the OPT recommendation was entered into SEVIS and before the end of my 60-day grace period."
                                                        checked={agreements.optRequestTimeline}
                                                        onChange={(e) => handleAgreementChange('optRequestTimeline', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="eadCardCopy"
                                                        label="I agree to provide UCF Global with a copy of my Employment Authorization Document (EAD card) once it is received."
                                                        checked={agreements.eadCardCopy}
                                                        onChange={(e) => handleAgreementChange('eadCardCopy', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="reportChanges"
                                                        label="I agree to report to UCF Global any changes of address, changes of legal name, changes of employment, and/or any interruption of employment within 10 days of the change."
                                                        checked={agreements.reportChanges}
                                                        onChange={(e) => handleAgreementChange('reportChanges', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="unemploymentLimit"
                                                        label="I understand that I must not accrue an aggregate of more than 90 days of unemployment during OPT."
                                                        checked={agreements.unemploymentLimit}
                                                        onChange={(e) => handleAgreementChange('unemploymentLimit', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>

                                            <CRow className="mb-3">
                                                <CCol>
                                                    <CFormCheck
                                                        id="employmentStartDate"
                                                        label="I understand that I must not begin employment until I receive the EAD card and until the 'valid from' date on the EAD card has been reached."
                                                        checked={agreements.employmentStartDate}
                                                        onChange={(e) => handleAgreementChange('employmentStartDate', e.target.checked)}
                                                        required
                                                    />
                                                </CCol>
                                            </CRow>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                                {/* Submit Buttons */}
                                <CRow className="mt-4">
                                    <CCol className="d-flex justify-content-end gap-2">
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            Cancel Changes
                                        </CButton>
                                        <CButton
                                            type="submit"
                                            color="success"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <CSpinner size="sm" className="me-2" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="cil-check me-2"></i>
                                                    Submit
                                                </>
                                            )}
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}
