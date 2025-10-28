import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "@coreui/coreui/dist/css/coreui.min.css"
import {
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CFormTextarea,
    CButton,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CAlert,
    CSpinner,
} from "@coreui/react"

export default function LeaveRequestForm() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        employeeId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "1234567",
        given_name: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "John",
        family_name: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "Doe",
        leaveType: import.meta.env.VITE_PLACEHOLDER_LEAVE_TYPE || "sick",
        documentation: null,
        fromDate: import.meta.env.VITE_PLACEHOLDER_LEAVE_FROM_DATE || "2025-10-24",
        fromTime: import.meta.env.VITE_PLACEHOLDER_LEAVE_FROM_TIME || "08:00",
        toDate: import.meta.env.VITE_PLACEHOLDER_LEAVE_TO_DATE || "2025-10-25",
        toTime: import.meta.env.VITE_PLACEHOLDER_LEAVE_TO_TIME || "17:00",
        hoursRequested: import.meta.env.VITE_PLACEHOLDER_LEAVE_HOURS || "8",
        reason: import.meta.env.VITE_PLACEHOLDER_LEAVE_REASON || "I am requesting leave for personal reasons.",
        courseName: import.meta.env.VITE_PLACEHOLDER_COURSE_NAME || "English 101",
        classes: [],
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
            // Validate required fields
            if (!formData.employeeId || !formData.given_name || !formData.family_name ||
                !formData.leaveType || !formData.fromDate || !formData.fromTime ||
                !formData.toDate || !formData.toTime || !formData.hoursRequested) {
                throw new Error('Please fill in all required fields')
            }

            // Create FormData for file upload
            const submitData = new FormData()

            // Add all form fields
            submitData.append('employee_id', formData.employeeId)
            submitData.append('given_name', formData.given_name)
            submitData.append('family_name', formData.family_name)
            submitData.append('leave_type', formData.leaveType)
            submitData.append('from_date', formData.fromDate)
            submitData.append('from_time', formData.fromTime)
            submitData.append('to_date', formData.toDate)
            submitData.append('to_time', formData.toTime)
            submitData.append('hours_requested', formData.hoursRequested)
            submitData.append('reason', formData.reason || '')
            submitData.append('course_name', formData.courseName || '')

            // Add file if present
            if (formData.documentation) {
                submitData.append('documentation', formData.documentation)
            }

            // Submit to backend
            const response = await fetch('http://localhost:8000/api/leave-requests/', {
                method: 'POST',
                body: submitData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to submit leave request')
            }

            const result = await response.json()
            console.log('Leave request submitted successfully:', result)
            setSubmitSuccess(true)

            // Redirect to All Requests List after 2 seconds
            setTimeout(() => {
                navigate('/forms/all-requests')
            }, 2000)

        } catch (error) {
            console.error('Error submitting leave request:', error)
            setSubmitError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        console.log("Changes cancelled")
        // Reset form or navigate away
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, documentation: file })
    }

    const getClasses = () => {
        // Mock function to simulate fetching classes
        console.log("Fetching classes...")
        // In a real implementation, this would make an API call
        setFormData({
            ...formData, classes: [
                { startTime: "9:00 AM", dates: "Mon, Wed, Fri", room: "ENG 101", substituteName: "This is fake data" },
                { startTime: "2:00 PM", dates: "Tue, Thu", room: "LIB 205", substituteName: "This is fake data" }
            ]
        })
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
                        Leave Request
                    </h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    <CForm onSubmit={handleSubmit}>
                        {/* Success/Error Messages */}
                        {submitSuccess && (
                            <CAlert color="success" className="mb-4">
                                ✓ Leave request submitted successfully! Redirecting to all requests...
                            </CAlert>
                        )}
                        {submitError && (
                            <CAlert color="danger" className="mb-4">
                                ✕ {submitError}
                            </CAlert>
                        )}

                        {/* Employee Information Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">👤</span>Employee Information
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="mb-3">
                                    <CCol md={4}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                Employee ID
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.employeeId}
                                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={4}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                First Name
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.given_name}
                                                onChange={(e) => setFormData({ ...formData, given_name: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={4}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                Last Name
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.family_name}
                                                onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {/* Leave Information Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">🕐</span>Leave Information
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                Leave Type
                                            </CFormLabel>
                                            <CFormSelect
                                                value={formData.leaveType}
                                                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                            >
                                                <option value="">Select one</option>
                                                <option value="sick">Sick Leave</option>
                                                <option value="vacation">Vacation Leave</option>
                                                <option value="personal">Personal Leave</option>
                                                <option value="administrative">Administrative Leave</option>
                                                <option value="bereavement">Bereavement Leave</option>
                                                <option value="jury-duty">Jury Duty</option>
                                                <option value="military">Military Leave</option>
                                            </CFormSelect>
                                        </div>
                                    </CCol>
                                </CRow>

                                <div className="mb-4">
                                    <h6 className="mb-3">Documentation</h6>
                                    <div className="mb-3">
                                        <CFormInput
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileUpload}
                                            style={{ maxWidth: "400px" }}
                                        />
                                    </div>
                                    {formData.documentation && (
                                        <div className="mb-3">
                                            <small className="text-success">
                                                ✓ File selected: {formData.documentation.name}
                                            </small>
                                        </div>
                                    )}
                                    <ul className="text-muted small">
                                        <li>Appropriate documentation may be requested at any time for sick leave.</li>
                                        <li>Appropriate documentation must be provided for administrative leave.</li>
                                        <li>Please attach all documents for this request.</li>
                                    </ul>
                                </div>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <h6 className="mb-3">From</h6>
                                        <div className="d-flex align-items-center mb-2">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "80px" }}>
                                                Date
                                            </CFormLabel>
                                            <CFormInput
                                                type="date"
                                                value={formData.fromDate}
                                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "80px" }}>
                                                Time
                                            </CFormLabel>
                                            <CFormInput
                                                type="time"
                                                value={formData.fromTime}
                                                onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <h6 className="mb-3">To</h6>
                                        <div className="d-flex align-items-center mb-2">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "80px" }}>
                                                Date
                                            </CFormLabel>
                                            <CFormInput
                                                type="date"
                                                value={formData.toDate}
                                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "80px" }}>
                                                Time
                                            </CFormLabel>
                                            <CFormInput
                                                type="time"
                                                value={formData.toTime}
                                                onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                                Hours Requested
                                            </CFormLabel>
                                            <CFormInput
                                                type="number"
                                                step="0.5"
                                                value={formData.hoursRequested}
                                                onChange={(e) => setFormData({ ...formData, hoursRequested: e.target.value })}
                                                placeholder="8"
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow className="mb-3">
                                    <CCol md={8}>
                                        <CFormLabel className="mb-2">Reason</CFormLabel>
                                        <CFormTextarea
                                            rows={4}
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            placeholder="Please provide a detailed reason for your leave request..."
                                        />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {/* Faculty Section */}
                        <CCard className="mb-4">
                            <CCardHeader className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <span className="me-2">💼</span>Faculty
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <div className="d-flex align-items-center">
                                            <CFormLabel className="mb-0 me-3" style={{ minWidth: "120px" }}>
                                                Course Name
                                            </CFormLabel>
                                            <CFormInput
                                                type="text"
                                                value={formData.courseName}
                                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                                placeholder="Enter course name"
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <CButton
                                            color="warning"
                                            className="text-dark"
                                            onClick={getClasses}
                                        >
                                            <span className="me-2">📋</span>Get Classes
                                        </CButton>
                                    </CCol>
                                </CRow>

                                {formData.classes.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="mb-3">Class Schedule</h6>
                                        <CTable striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Start Time</th>
                                                    <th>Date(s)</th>
                                                    <th>Room</th>
                                                    <th>Substitute Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.classes.map((classItem, index) => (
                                                    <tr key={index}>
                                                        <td>{classItem.startTime}</td>
                                                        <td>{classItem.dates}</td>
                                                        <td>{classItem.room}</td>
                                                        <td>
                                                            <CFormInput
                                                                type="text"
                                                                value={classItem.substituteName}
                                                                onChange={(e) => {
                                                                    const updatedClasses = [...formData.classes]
                                                                    updatedClasses[index].substituteName = e.target.value
                                                                    setFormData({ ...formData, classes: updatedClasses })
                                                                }}
                                                                placeholder="Enter substitute name"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </CTable>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <CSpinner size="sm" className="me-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <span className="me-2">✓</span>Submit
                                    </>
                                )}
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white" disabled={isSubmitting}>
                                <span className="me-2">✕</span>Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
