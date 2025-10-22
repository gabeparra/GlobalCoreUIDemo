import { useState } from "react"
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
} from "@coreui/react"

export default function EnglishLanguageProgramsVolunteerForm() {
    const [formData, setFormData] = useState({
        ucfId: import.meta.env.VITE_PLACEHOLDER_UCF_ID || "",
        firstName: import.meta.env.VITE_PLACEHOLDER_GIVEN_NAME || "",
        lastName: import.meta.env.VITE_PLACEHOLDER_FAMILY_NAME || "",
        ucfEmail: import.meta.env.VITE_PLACEHOLDER_STUDENT_EMAIL || "",
        academicLevel: "",
        courseName: "English 101",
        courseInstructor: "Dr. John Doe",
        college: "College of Arts and Humanities",
        term: "Fall 2025",
        positions: {
            intensiveEnglish: false,
            onlineEnglish: false,
        },
        hoursPerWeek: "1-2 hours",
        availability: {
            monday: { morning: false, afternoon: false, evening: false },
            tuesday: { morning: false, afternoon: false, evening: false },
            wednesday: { morning: false, afternoon: false, evening: false },
            thursday: { morning: false, afternoon: false, evening: false },
            friday: { morning: false, afternoon: false, evening: false },
        },
        remarks: "I am available to help international students improve their English language skills.",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    const handleCancel = () => {
        console.log("Changes cancelled")
    }

    const handleGetStudentInfo = () => {
        console.log("Getting student information for UCF ID:", formData.ucfId)
    }

    const handlePositionChange = (position) => {
        setFormData({
            ...formData,
            positions: {
                ...formData.positions,
                [position]: !formData.positions[position],
            },
        })
    }

    const handleAvailabilityChange = (day, timeOfDay) => {
        setFormData({
            ...formData,
            availability: {
                ...formData.availability,
                [day]: {
                    ...formData.availability[day],
                    [timeOfDay]: !formData.availability[day][timeOfDay],
                },
            },
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CContainer fluid className="p-0">
                {/* Header with Logo */}
                <div className="bg-white border-b-4 border-warning py-4 px-4">
                    <div className="d-flex align-items-center mb-3">
                        <img
                            src="https://www.ucf.edu/brand/wp-content/blogs.dir/13/files/2016/07/UCF-Tab-gray2.png"
                            alt="UCF Logo"
                            style={{ height: "60px", marginRight: "20px" }}
                        />
                        <div>
                            <h2 className="m-0 fw-bold">UCF Global</h2>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-center m-0">English Language Programs Volunteer Form</h1>
                </div>

                {/* Form Content */}
                <CContainer className="py-4">
                    <CForm onSubmit={handleSubmit}>
                        {/* Volunteer Information Section */}
                        <div className="bg-warning text-dark px-3 py-2 mb-3 fw-semibold">Volunteer Information</div>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center gap-2">
                                    <CFormLabel className="mb-0" style={{ minWidth: "140px" }}>
                                        UCF ID
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.ucfId}
                                        onChange={(e) => setFormData({ ...formData, ucfId: e.target.value })}
                                        style={{ maxWidth: "200px" }}
                                    />
                                    <CButton color="warning" onClick={handleGetStudentInfo}>
                                        Get Student Information
                                    </CButton>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        First Name
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="bg-light"
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Last Name
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="bg-light"
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        UCF Email
                                    </CFormLabel>
                                    <CFormInput
                                        type="email"
                                        value={formData.ucfEmail}
                                        onChange={(e) => setFormData({ ...formData, ucfEmail: e.target.value })}
                                        className="bg-light"
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Academic Level
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.academicLevel}
                                        onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                                    >
                                        <option value="">Select one</option>
                                        <option value="freshman">Freshman</option>
                                        <option value="sophomore">Sophomore</option>
                                        <option value="junior">Junior</option>
                                        <option value="senior">Senior</option>
                                        <option value="graduate">Graduate</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Course Name
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.courseName}
                                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Course Instructor
                                    </CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={formData.courseInstructor}
                                        onChange={(e) => setFormData({ ...formData, courseInstructor: e.target.value })}
                                    />
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        College
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    >
                                        <option value="">Select one:</option>
                                        <option value="arts-humanities">College of Arts and Humanities</option>
                                        <option value="business">College of Business</option>
                                        <option value="education">College of Education</option>
                                        <option value="engineering">College of Engineering and Computer Science</option>
                                        <option value="sciences">College of Sciences</option>
                                        <option value="other">Other</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Term
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.term}
                                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                    >
                                        <option value="">Select one:</option>
                                        <option value="fall-2024">Fall 2024</option>
                                        <option value="spring-2025">Spring 2025</option>
                                        <option value="summer-2025">Summer 2025</option>
                                        <option value="fall-2025">Fall 2025</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Position Section */}
                        <CRow className="mb-3">
                            <CCol md={6}>
                                <div className="d-flex">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Position
                                    </CFormLabel>
                                    <div>
                                        <div className="mb-2">
                                            <CFormCheck
                                                id="intensiveEnglish"
                                                label="Intensive English Program Conversation Hour"
                                                checked={formData.positions.intensiveEnglish}
                                                onChange={() => handlePositionChange("intensiveEnglish")}
                                            />
                                        </div>
                                        <div>
                                            <CFormCheck
                                                id="onlineEnglish"
                                                label="Online English Program Conversation Hour"
                                                checked={formData.positions.onlineEnglish}
                                                onChange={() => handlePositionChange("onlineEnglish")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mb-4">
                            <CCol md={6}>
                                <div className="d-flex align-items-center">
                                    <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                        Number of Hours Available per week
                                    </CFormLabel>
                                    <CFormSelect
                                        value={formData.hoursPerWeek}
                                        onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                                    >
                                        <option value="">Select one:</option>
                                        <option value="1-2">1-2 hours</option>
                                        <option value="3-4">3-4 hours</option>
                                        <option value="5-6">5-6 hours</option>
                                        <option value="7+">7+ hours</option>
                                    </CFormSelect>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Availability Section */}
                        {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => (
                            <CRow className="mb-3" key={day}>
                                <CCol md={6}>
                                    <div className="d-flex">
                                        <CFormLabel className="mb-0 me-3" style={{ minWidth: "140px" }}>
                                            Availability on {day.charAt(0).toUpperCase() + day.slice(1)}s
                                        </CFormLabel>
                                        <div>
                                            <div className="mb-2">
                                                <CFormCheck
                                                    id={`${day}-morning`}
                                                    label="Morning"
                                                    checked={formData.availability[day].morning}
                                                    onChange={() => handleAvailabilityChange(day, "morning")}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <CFormCheck
                                                    id={`${day}-afternoon`}
                                                    label="Afternoon"
                                                    checked={formData.availability[day].afternoon}
                                                    onChange={() => handleAvailabilityChange(day, "afternoon")}
                                                />
                                            </div>
                                            <div>
                                                <CFormCheck
                                                    id={`${day}-evening`}
                                                    label="Evening"
                                                    checked={formData.availability[day].evening}
                                                    onChange={() => handleAvailabilityChange(day, "evening")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>
                        ))}

                        {/* Remarks Section */}
                        <div className="bg-warning text-dark px-3 py-2 mb-3 fw-semibold">Remarks</div>

                        <CRow className="mb-4">
                            <CCol md={8}>
                                <CFormTextarea
                                    rows={5}
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                />
                            </CCol>
                        </CRow>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton type="submit" color="success" className="text-white">
                                Submit
                            </CButton>
                            <CButton type="button" color="danger" onClick={handleCancel} className="text-white">
                                Cancel Changes
                            </CButton>
                        </div>
                    </CForm>
                </CContainer>
            </CContainer>
        </div>
    )
}
