/**
 * Administrative Record Change Form
 * 
 * This component provides a form for students to request changes to their administrative records,
 * including late drops, program changes, swaps, and other administrative actions.
 * 
 * The form collects student information, visa information, and the specific administrative 
 * actions being requested.
 */
import React, { useState } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CForm, CFormInput, CFormSelect, CFormCheck,
    CButton, CAlert, CSpinner, CFormLabel
} from '@coreui/react'

export default function AdministrativeRecordChangeForm() {
    /**
     * Form state initialization
     * 
     * This state object contains all form fields organized by section:
     * - Student Information: Basic identification and contact details
     * - Visa Information: Current visa type and status with confirmation
     * - Action Requested: Array of selected administrative actions
     * - Form submission state: Tracks certification checkbox
     */
    const [form, setForm] = useState({
        // Student Information
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || '',
        sevisId: import.meta.env.VITE_PLACEHOLDER_SEVIS_ID || '',
        date: new Date().toISOString().split('T')[0], // Today's date
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || '',
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || '',
        studentEmail: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || '',
        preferredPhone: import.meta.env.VITE_PLACEHOLDER_US_TELEPHONE || '',
        currentProgram: 'Graduate',

        // Visa Information
        visaType: 'F-1',         // Default visa type
        visaStatus: 'Active', // Default visa status
        visaInfoCorrect: 'Yes',

        // Action Requested - stores array of selected actions
        actionRequested: ['Late Drop'],

        // Form submission state
        certificationChecked: true
    })

    /**
     * Form state management
     * 
     * errors: Object to store validation errors for each field
     * submitting: Boolean flag to track form submission in progress
     * submitted: Boolean flag to indicate successful form submission
     */
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    /**
     * Generic update handler for form fields
     * 
     * This function handles changes to input fields, select dropdowns, and radio buttons.
     * It updates the form state and clears any validation errors for the changed field.
     * 
     * @param {Object} e - The event object from the input change
     */
    const update = (e) => {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
        setErrors((errs) => ({ ...errs, [name]: undefined }))
    }

    /**
     * Handle checkbox changes for action requested
     * 
     * This function toggles actions in the actionRequested array:
     * - If the action already exists, it removes it (unchecking)
     * - If the action doesn't exist, it adds it (checking)
     * 
     * @param {string} action - The action identifier to toggle
     */
    const handleActionChange = (action) => {
        setForm((f) => {
            const currentActions = [...f.actionRequested]
            if (currentActions.includes(action)) {
                // Remove action if already selected (unchecking)
                return { ...f, actionRequested: currentActions.filter(a => a !== action) }
            } else {
                // Add action if not already selected (checking)
                return { ...f, actionRequested: [...currentActions, action] }
            }
        })
    }

    /**
     * Form validation function
     * 
     * Validates all form fields and returns an object containing error messages.
     * If the returned object is empty, the form is valid.
     * 
     * @returns {Object} Object with field names as keys and error messages as values
     */
    const validate = () => {
        const e = {}

        // Validate Student Information
        if (!form.ucfId) e.ucfId = 'UCF ID is required'
        if (!form.sevisId) e.sevisId = 'SEVIS ID is required'
        if (!form.date) e.date = 'Date is required'
        if (!form.firstName) e.firstName = 'First name is required'
        if (!form.lastName) e.lastName = 'Last name is required'
        if (!form.studentEmail) e.studentEmail = 'Student email is required'
        else if (!/^[^\s@]+@ucf\.edu$/.test(form.studentEmail)) e.studentEmail = 'Must be a valid UCF email address'
        if (!form.preferredPhone) e.preferredPhone = 'Phone number is required'
        if (!form.currentProgram) e.currentProgram = 'Current program is required'

        // Validate Visa Information
        if (!form.visaInfoCorrect) e.visaInfoCorrect = 'Please confirm if your visa information is correct'

        // Validate Action Requested - at least one action must be selected
        if (form.actionRequested.length === 0) e.actionRequested = 'Please select at least one action'

        // Validate certification checkbox
        if (!form.certificationChecked) e.certificationChecked = 'You must certify that the information provided is accurate'

        return e
    }

    /**
     * Form submission handler
     * 
     * This async function handles the form submission process:
     * 1. Validates the form data
     * 2. Submits the data to the backend API
     * 3. Handles success/error states
     * 4. Resets the form on successful submission
     * 
     * @param {Object} e - The form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Run form validation and display errors if any
        const formErrors = validate()
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors)
            window.scrollTo(0, 0) // Scroll to top to show errors
            return
        }

        // Set submitting state to show loading spinner
        setSubmitting(true)

        try {
            // Simulate API call with delay (for demonstration purposes)
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Prepare form data in the format expected by the backend API
            const payload = {
                student_name: `${form.firstName} ${form.lastName}`,
                student_id: form.ucfId,
                program: 'Administrative Record Change',
                ucf_id: form.ucfId,
                sevis_id: form.sevisId,
                date: form.date,
                first_name: form.firstName,
                last_name: form.lastName,
                student_email: form.studentEmail,
                preferred_phone: form.preferredPhone,
                current_program: form.currentProgram,
                visa_type: form.visaType,
                visa_status: form.visaStatus,
                visa_info_correct: form.visaInfoCorrect,
                action_requested: form.actionRequested,
                certification_checked: form.certificationChecked
            }

            console.log('Submitting to administrative-record endpoint:', payload)

            // Send form data to backend API
            const response = await fetch('http://localhost:8000/api/administrative-record/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            // Handle non-successful HTTP responses
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            // Handle successful submission
            setSubmitted(true)

            // Reset form to initial state
            setForm({
                ucfId: '',
                sevisId: '',
                date: '',
                firstName: '',
                lastName: '',
                studentEmail: '',
                preferredPhone: '',
                currentProgram: '',
                visaType: 'ASL',
                visaStatus: 'Applied For',
                visaInfoCorrect: '',
                actionRequested: [],
                certificationChecked: false
            })

            // Scroll to top to show success message
            window.scrollTo(0, 0)
        } catch (error) {
            // Handle submission errors
            console.error('Error submitting form:', error)
            setErrors({ submit: 'Failed to submit form. Please try again.' })
        } finally {
            // Reset submitting state regardless of outcome
            setSubmitting(false)
        }
    }

    /**
     * Component render method
     * 
     * The UI is structured as follows:
     * 1. Main container with card layout
     * 2. Success message (when form is submitted)
     * 3. Form with multiple sections:
     *    - Student Information section
     *    - Visa Information section
     *    - Action Requested section
     *    - Certification and submit button
     */
    return (
        <CRow>
            <CCol xs={12}>
                {/* Main form container card */}
                <CCard className="form-card">
                    <CCardHeader className="bg-primary text-white">
                        <strong>Administrative Record Change</strong>
                    </CCardHeader>
                    <CCardBody>
                        {/* Conditional rendering based on submission state */}
                        {submitted ? (
                            // Success message shown after successful submission
                            <div className="form-success">
                                <h4>Form Submitted Successfully!</h4>
                                <p>Your Administrative Record Change request has been submitted. You will be notified when it has been processed.</p>
                                <CButton color="primary" onClick={() => setSubmitted(false)}>Submit Another Request</CButton>
                            </div>
                        ) : (
                            // Form content shown before submission
                            <CForm onSubmit={handleSubmit}>
                                {/* General submission error alert */}
                                {errors.submit && <CAlert color="danger">{errors.submit}</CAlert>}

                                {/* Student Information Section */}
                                <div className="form-section">
                                    <h4>Student Information</h4>
                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="ucfId" className="required-field">UCF ID:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="ucfId"
                                                name="ucfId"
                                                value={form.ucfId}
                                                onChange={update}
                                                invalid={!!errors.ucfId}
                                                feedback={errors.ucfId}
                                            />
                                        </CCol>
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="sevisId" className="required-field">SEVIS ID:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="sevisId"
                                                name="sevisId"
                                                value={form.sevisId}
                                                onChange={update}
                                                invalid={!!errors.sevisId}
                                                feedback={errors.sevisId}
                                            />
                                        </CCol>
                                    </CRow>

                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="date" className="required-field">Date:</CFormLabel>
                                            <CFormInput
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={form.date}
                                                onChange={update}
                                                invalid={!!errors.date}
                                                feedback={errors.date}
                                            />
                                        </CCol>
                                    </CRow>

                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="firstName" className="required-field">First Name:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={form.firstName}
                                                onChange={update}
                                                invalid={!!errors.firstName}
                                                feedback={errors.firstName}
                                            />
                                        </CCol>
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="lastName" className="required-field">Last Name:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={form.lastName}
                                                onChange={update}
                                                invalid={!!errors.lastName}
                                                feedback={errors.lastName}
                                            />
                                        </CCol>
                                    </CRow>

                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="studentEmail" className="required-field">Student Email Address:</CFormLabel>
                                            <CFormInput
                                                type="email"
                                                id="studentEmail"
                                                name="studentEmail"
                                                value={form.studentEmail}
                                                onChange={update}
                                                invalid={!!errors.studentEmail}
                                                feedback={errors.studentEmail}
                                            />
                                        </CCol>
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="preferredPhone" className="required-field">Preferred Contact Phone:</CFormLabel>
                                            <CFormInput
                                                type="tel"
                                                id="preferredPhone"
                                                name="preferredPhone"
                                                value={form.preferredPhone}
                                                onChange={update}
                                                invalid={!!errors.preferredPhone}
                                                feedback={errors.preferredPhone}
                                            />
                                        </CCol>
                                    </CRow>

                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="currentProgram" className="required-field">Current Program:</CFormLabel>
                                            <CFormSelect
                                                id="currentProgram"
                                                name="currentProgram"
                                                value={form.currentProgram}
                                                onChange={update}
                                                invalid={!!errors.currentProgram}
                                                feedback={errors.currentProgram}
                                            >
                                                <option value="">Select One</option>
                                                <option value="Undergraduate">Undergraduate</option>
                                                <option value="Graduate">Graduate</option>
                                                <option value="Doctoral">Doctoral</option>
                                                <option value="Non-Degree">Non-Degree</option>
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Visa Information Section */}
                                <div className="form-section">
                                    <h4>Visa Information</h4>
                                    <CRow className="form-grid">
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="visaType">Visa Type:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="visaType"
                                                name="visaType"
                                                value={form.visaType}
                                                onChange={update}
                                                disabled
                                            />
                                        </CCol>
                                        <CCol md={6} className="form-field-group">
                                            <CFormLabel htmlFor="visaStatus">Visa Status:</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id="visaStatus"
                                                name="visaStatus"
                                                value={form.visaStatus}
                                                onChange={update}
                                                disabled
                                            />
                                        </CCol>
                                    </CRow>

                                    <CRow className="form-grid">
                                        <CCol md={12} className="form-field-group">
                                            <CFormLabel className="required-field">Is your visa information above correct?</CFormLabel>
                                            <div className="checkbox-group">
                                                <CFormCheck
                                                    inline
                                                    type="radio"
                                                    name="visaInfoCorrect"
                                                    id="visaInfoYes"
                                                    value="Yes"
                                                    label="Yes"
                                                    checked={form.visaInfoCorrect === 'Yes'}
                                                    onChange={update}
                                                />
                                                <CFormCheck
                                                    inline
                                                    type="radio"
                                                    name="visaInfoCorrect"
                                                    id="visaInfoNo"
                                                    value="No"
                                                    label="No"
                                                    checked={form.visaInfoCorrect === 'No'}
                                                    onChange={update}
                                                />
                                            </div>
                                            {errors.visaInfoCorrect && (
                                                <div className="invalid-feedback">{errors.visaInfoCorrect}</div>
                                            )}
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Action Requested Section - Checkboxes for administrative actions */}
                                <div className="form-section">
                                    <h4>Action Requested</h4>
                                    {errors.actionRequested && (
                                        <div className="invalid-feedback">{errors.actionRequested}</div>
                                    )}

                                    <div className="checkbox-group">
                                        <CRow>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="lateDrop"
                                                    label="Late Drop"
                                                    checked={form.actionRequested.includes('Late Drop')}
                                                    onChange={() => handleActionChange('Late Drop')}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="programChange"
                                                    label="Program Change"
                                                    checked={form.actionRequested.includes('Program Change')}
                                                    onChange={() => handleActionChange('Program Change')}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="swap"
                                                    label="Swap"
                                                    checked={form.actionRequested.includes('Swap')}
                                                    onChange={() => handleActionChange('Swap')}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="iepToOep"
                                                    label="IEP to OEP"
                                                    checked={form.actionRequested.includes('IEP to OEP')}
                                                    onChange={() => handleActionChange('IEP to OEP')}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="lateAdd"
                                                    label="Late Add"
                                                    checked={form.actionRequested.includes('Late Add')}
                                                    onChange={() => handleActionChange('Late Add')}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="oepToIep"
                                                    label="OEP to IEP"
                                                    checked={form.actionRequested.includes('OEP to IEP')}
                                                    onChange={() => handleActionChange('OEP to IEP')}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="withdrawal"
                                                    label="Withdrawal"
                                                    checked={form.actionRequested.includes('Withdrawal')}
                                                    onChange={() => handleActionChange('Withdrawal')}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="override"
                                                    label="Override"
                                                    checked={form.actionRequested.includes('Override')}
                                                    onChange={() => handleActionChange('Override')}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="medicalWithdrawal"
                                                    label="Medical Withdrawal"
                                                    checked={form.actionRequested.includes('Medical Withdrawal')}
                                                    onChange={() => handleActionChange('Medical Withdrawal')}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="classFull"
                                                    label="Class Full"
                                                    checked={form.actionRequested.includes('Class Full')}
                                                    onChange={() => handleActionChange('Class Full')}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow>
                                            <CCol md={6}>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormCheck
                                                    id="repeatClass"
                                                    label="Repeat Class"
                                                    checked={form.actionRequested.includes('Repeat Class')}
                                                    onChange={() => handleActionChange('Repeat Class')}
                                                />
                                            </CCol>
                                        </CRow>
                                    </div>
                                </div>


                                {/* Certification Checkbox - Legal confirmation */}
                                <CRow className="mb-4">
                                    <CCol xs={12}>
                                        <CFormCheck
                                            id="certificationCheck"
                                            label="I certify that the information provided in this form is accurate and complete to the best of my knowledge."
                                            checked={form.certificationChecked}
                                            onChange={(e) => setForm((f) => ({ ...f, certificationChecked: e.target.checked }))}
                                            invalid={!!errors.certificationChecked}
                                            feedback={errors.certificationChecked}
                                        />
                                    </CCol>
                                </CRow>

                                {/* Form Submit Button - Shows spinner when submitting */}
                                <div className="form-buttons">
                                    <CButton type="submit" color="primary" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <CSpinner size="sm" className="me-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Request'
                                        )}
                                    </CButton>
                                </div>
                            </CForm>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}

