"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CListGroup,
    CListGroupItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
    cilFile,
    cilEducation,
    cilClipboard,
    cilCalendar,
    cilLink,
    cilHome,
    cilChart,
    cilCheckCircle,
    cilAccountLogout,
    cilArrowRight,
    cilPeople,
    cilAirplaneMode,
    cilBook,
    cilEnvelopeOpen,
    cilSpeech,
    cilGlobeAlt,
    cilSearch,
    cilCheckAlt,
} from "@coreui/icons"

const menuItems = [
    {
        title: "I-20 Request Form",
        description:
            "Request changes to your I-20, including program extensions, change of major, academic level changes, and more.",
        icon: cilFile,
        path: "/forms/i20-request",
        color: "primary",
    },
    {
        title: "Academic Training Request",
        description: "Submit a request for Academic Training authorization for J-1 students.",
        icon: cilEducation,
        path: "/forms/academic-training",
        color: "secondary",
    },
    {
        title: "Administrative Record Change",
        description:
            "Request changes to your administrative records including late drops, program changes, and other administrative actions.",
        icon: cilClipboard,
        path: "/forms/administrative-record-change",
        color: "warning",
    },
    {
        title: "Conversation Partner Request",
        description: "Request to be a conversation partner for an international student.",
        icon: cilSpeech,
        path: "/forms/conversation-partner",
        color: "success",
    },
    {
        title: "OPT Request Form",
        description: "Submit your Optional Practical Training request for F-1 students.",
        icon: cilCheckCircle,
        path: "/forms/opt-request",
        color: "info",
    },
    {
        title: "Document Request",
        description: "Request a document from UCF Global.",
        icon: cilEnvelopeOpen,
        path: "/forms/document-request",
        color: "primary",
    },
    {
        title: "English Language Programs Volunteer",
        description: "Volunteer to help international students improve their English language skills.",
        icon: cilBook,
        path: "/forms/english-language-programs-volunteer",
        color: "success",
    },
    {
        title: "Florida Statute 101035",
        description: "Request a document from UCF Global.",
        icon: cilFile,
        path: "/forms/florida-statute-101035",
        color: "secondary",
    },
    {
        title: "Leave Request",
        description: "Submit a request for leave including sick leave, vacation, and administrative leave.",
        icon: cilCalendar,
        path: "/forms/leave-request",
        color: "danger",
    },
    {
        title: "Linkages Application",
        description: "Submit a new application or renewal for UCF Global Linkages program.",
        icon: cilLink,
        path: "/forms/linkages-application",
        color: "warning",
    },
    {
        title: "Off Campus Housing Application",
        description: "Apply for off-campus housing at The Verge. $250 processing fee required.",
        icon: cilHome,
        path: "/forms/off-campus-housing",
        color: "success",
    },
    {
        title: "OPT and STEM Extension Reporting",
        description:
            "Report changes in employment status, employer, or residential address for OPT and STEM Extension participants.",
        icon: cilChart,
        path: "/forms/opt-stem-reporting",
        color: "info",
    },
    {
        title: "OPT STEM Extension Application",
        description: "Submit your OPT STEM Extension application with all required documents and information.",
        icon: cilEducation,
        path: "/forms/opt-stem-extension-application",
        color: "primary",
    },
    {
        title: "Exit Form",
        description: "Submit your exit form when leaving the University of Central Florida.",
        icon: cilAccountLogout,
        path: "/forms/exit",
        color: "danger",
    },
    {
        title: "Pathway Programs Intent to Progress",
        description: "Submit your Intent to Progress for Pathway Programs at UCF Global.",
        icon: cilArrowRight,
        path: "/forms/pathway-programs-intent-to-progress",
        color: "info",
    },
    {
        title: "Pathway Programs Next Steps",
        description: "Complete your next steps for UCF Global Pathway Programs.",
        icon: cilArrowRight,
        path: "/forms/pathway-programs-next-steps",
        color: "primary",
    },
    {
        title: "Reduced Course Load Request",
        description: "Request approval for a reduced course load while maintaining international student status.",
        icon: cilBook,
        path: "/forms/reduced-course-load",
        color: "success",
    },
    {
        title: "SPEAK Test Registration",
        description:
            "Register for the Speaking Proficiency English Assessment Kit (SPEAK) Test for international students.",
        icon: cilPeople,
        path: "/forms/speak-test-registration",
        color: "warning",
    },
    {
        title: "Global Transfer Out",
        description: "Transfer your SEVIS record from UCF to a new school in the United States.",
        icon: cilGlobeAlt,
        path: "/forms/global-transfer-out",
        color: "info",
    },
    {
        title: "Travel Approval Petition",
        description: "Submit a petition for international travel approval as required by UCF Policy.",
        icon: cilAirplaneMode,
        path: "/forms/travel-approval-petition",
        color: "primary",
    },
    {
        title: "UCF Global Records Release",
        description: "Submit a request to release your UCF Global records.",
        icon: cilFile,
        path: "/forms/ucf-global-records-release",
        color: "secondary",
    },
    {
        title: "Virtual Check In",
        description:
            "Complete your virtual check-in process by providing personal information, U.S. address, emergency contact, and required documents.",
        icon: cilCheckAlt,
        path: "/forms/virtual-checkin",
        color: "success",
    },
    {
        title: "View All Form Submissions",
        description: "View all submitted forms including I-20 requests and Academic Training requests.",
        icon: cilClipboard,
        path: "/forms/all-requests",
        color: "secondary",
    },
]

const submittedForms = [
    {
        name: "Form DS-2019 Request - Professional Categories for",
        submittedOn: "10/22/2025",
        workflowStatus: "Pending",
        processOutcome: "",
        currentStep: "Initial Review",
        assignedTo: "Global Services Team",
        assignedOn: "10/22/2025",
    },
    {
        name: "I-20 Request Form - Program Extension",
        submittedOn: "10/15/2025",
        workflowStatus: "Approved",
        processOutcome: "Completed",
        currentStep: "Closed",
        assignedTo: "John Smith",
        assignedOn: "10/15/2025",
    },
]

const actionRequiredTasks = [
    {
        name: "Complete Virtual Check-In",
        submittedBy: "System",
        submittedOn: "10/20/2025",
        priority: "High",
    },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")

    const filteredItems = menuItems.filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getStatusColor = (status) => {
        const statusColors = {
            Pending: "warning",
            Approved: "success",
            Rejected: "danger",
        }
        return statusColors[status] || "secondary"
    }

    return (
        <div style={{ minHeight: "10vh" }}>
            <div style={{ borderBottom: "1px solid #dee2e6", padding: "0.2rem 0" }}>
                <CContainer>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.25rem" }}>UCF Global Services</h1>
                    <p style={{ color: "#6c757d", fontSize: "0.75rem" }}>Manage your forms and submissions</p>
                </CContainer>
            </div>

            <CContainer className="py-4">
                <CRow>
                    <CCol lg={8}>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">eForms I Can Submit</h5>
                                    <CBadge color="secondary">{menuItems.length} forms</CBadge>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon={cilSearch} size="sm" />
                                    </CInputGroupText>
                                    <CFormInput
                                        placeholder="Search forms..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </CInputGroup>

                                <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                                    <CListGroup>
                                        {filteredItems.map((item, index) => (
                                            <CListGroupItem
                                                key={index}
                                                component="button"
                                                onClick={() => {
                                                    navigate(item.path)
                                                }}
                                                className="d-flex align-items-start"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div
                                                    className={`bg-${item.color} text-white rounded d-flex align-items-center justify-content-center me-3`}
                                                    style={{ width: "40px", height: "40px", flexShrink: 0 }}
                                                >
                                                    <CIcon icon={item.icon} size="lg" />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">{item.title}</h6>
                                                    <small className="text-muted">{item.description}</small>
                                                </div>
                                                <CIcon icon={cilArrowRight} size="lg" className="text-muted ms-2" style={{ flexShrink: 0 }} />
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </div>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-5">
                                        <CIcon icon={cilSearch} size="3xl" className="text-muted mb-3" />
                                        <p className="text-muted">No forms found matching your search</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol lg={4}>
                        <CCard>
                            <CCardHeader>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Action Required</h5>
                                    <CBadge color="danger" shape="rounded-pill">
                                        {actionRequiredTasks.length}
                                    </CBadge>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                {actionRequiredTasks.length > 0 ? (
                                    <CListGroup>
                                        {actionRequiredTasks.map((task, index) => (
                                            <CListGroupItem key={index} className="mb-2">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="mb-0">{task.name}</h6>
                                                    <CBadge color="danger">{task.priority}</CBadge>
                                                </div>
                                                <small className="text-muted d-block">Submitted by: {task.submittedBy}</small>
                                                <small className="text-muted d-block">Date: {task.submittedOn}</small>
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                ) : (
                                    <div className="text-center py-4">
                                        <CIcon icon={cilCheckAlt} size="3xl" className="text-success mb-2" />
                                        <p className="text-muted mb-0">No actions required</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                <CRow className="mt-3">
                    <CCol>
                        <CCard>
                            <CCardHeader>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">My Submitted eForms</h5>
                                    <CBadge color="secondary">{submittedForms.length} items</CBadge>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CTable hover responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Name</CTableHeaderCell>
                                            <CTableHeaderCell>Submitted On</CTableHeaderCell>
                                            <CTableHeaderCell>Workflow Status</CTableHeaderCell>
                                            <CTableHeaderCell>Process Outcome</CTableHeaderCell>
                                            <CTableHeaderCell>Current Step</CTableHeaderCell>
                                            <CTableHeaderCell>Assigned To</CTableHeaderCell>
                                            <CTableHeaderCell>Assigned On</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {submittedForms.map((form, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell>{form.name}</CTableDataCell>
                                                <CTableDataCell>{form.submittedOn}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge color={getStatusColor(form.workflowStatus)}>{form.workflowStatus}</CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>{form.processOutcome || "-"}</CTableDataCell>
                                                <CTableDataCell>{form.currentStep}</CTableDataCell>
                                                <CTableDataCell>{form.assignedTo}</CTableDataCell>
                                                <CTableDataCell>{form.assignedOn}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>

                                {submittedForms.length === 0 && (
                                    <div className="text-center py-5">
                                        <CIcon icon={cilFile} size="3xl" className="text-muted mb-3" />
                                        <p className="text-muted">No forms submitted yet</p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}
