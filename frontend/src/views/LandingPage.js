import React from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CContainer,
    CButton
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    const menuItems = [
        {
            title: 'I-20 Request Form',
            description: 'Request changes to your I-20, including program extensions, change of major, academic level changes, and more.',
            icon: '📄',
            path: '/forms/i20-request'
        },
        {
            title: 'Academic Training Request',
            description: 'Submit a request for Academic Training authorization for J-1 students.',
            icon: '🎓',
            path: '/forms/academic-training'
        },
        {
            title: 'Administrative Record Change',
            description: 'Request changes to your administrative records including late drops, program changes, and other administrative actions.',
            icon: '📝',
            path: '/forms/administrative-record-change'
        },
        {
            title: 'Conversation Partner Request',
            description: 'Request to be a conversation partner for an international student.',
            icon: '📝',
            path: '/forms/conversation-partner'
        },
        {
            title: 'OPT Request Form',
            description: 'Submit your Optional Practical Training request for F-1 students.',
            icon: '💼',
            path: '/forms/opt-request'
        },
        {
            title: 'Document Request',
            description: 'Request a document from UCF Global.',
            icon: '📝',
            path: '/forms/document-request'
        },
        {
            title: 'English Language Programs Volunteer',
            description: 'Volunteer to help international students improve their English language skills.',
            icon: '📝',
            path: '/forms/english-language-programs-volunteer'
        },
        {
            title: 'Florida Statute 101035',
            description: 'Request a document from UCF Global.',
            icon: '📝',
            path: '/forms/florida-statute-101035'
        },
        {
            title: 'Leave Request',
            description: 'Submit a request for leave including sick leave, vacation, and administrative leave.',
            icon: '📅',
            path: '/forms/leave-request'
        },
        {
            title: 'Linkages Application',
            description: 'Submit a new application or renewal for UCF Global Linkages program.',
            icon: '🔗',
            path: '/forms/linkages-application'
        },
        {
            title: 'Off Campus Housing Application',
            description: 'Apply for off-campus housing at The Verge. $250 processing fee required.',
            icon: '🏠',
            path: '/forms/off-campus-housing'
        },
        {
            title: 'OPT and STEM Extension Reporting',
            description: 'Report changes in employment status, employer, or residential address for OPT and STEM Extension participants.',
            icon: '📊',
            path: '/forms/opt-stem-reporting'
        },
        {
            title: 'OPT STEM Extension Application',
            description: 'Submit your OPT STEM Extension application with all required documents and information.',
            icon: '📋',
            path: '/forms/opt-stem-extension-application'
        },
        {
            title: 'Exit Form',
            description: 'Submit your exit form when leaving the University of Central Florida.',
            icon: '🚪',
            path: '/forms/exit'
        },
        {
            title: 'Pathway Programs Intent to Progress',
            description: 'Submit your Intent to Progress for Pathway Programs at UCF Global.',
            icon: '📝',
            path: '/forms/pathway-programs-intent-to-progress'
        },
        {
            title: 'Pathway Programs Next Steps',
            description: 'Complete your next steps for UCF Global Pathway Programs.',
            icon: '📝',
            path: '/forms/pathway-programs-next-steps'
        },
        {
            title: 'Reduced Course Load Request',
            description: 'Request approval for a reduced course load while maintaining international student status.',
            icon: '📚',
            path: '/forms/reduced-course-load'
        },
        {
            title: 'View All Form Submissions',
            description: 'View all submitted forms including I-20 requests and Academic Training requests.',
            icon: '📋',
            path: '/forms/all-requests'
        },
        {
            title: 'SPEAK Test Registration',
            description: 'Register for the Speaking Proficiency English Assessment Kit (SPEAK) Test for international students.',
            icon: '📝',
            path: '/forms/speak-test-registration'
        },
        {
            title: 'Global Transfer Out',
            description: 'Transfer your SEVIS record from UCF to a new school in the United States.',
            icon: '🌐',
            path: '/forms/global-transfer-out'
        },
        {
            title: 'Travel Approval Petition',
            description: 'Submit a petition for international travel approval as required by UCF Policy.',
            icon: '✈️',
            path: '/forms/travel-approval-petition'
        }
    ]

    return (
        <CContainer>
            <CRow className="mb-4">
                <CCol>
                    <h2 className="mb-4">Welcome to UCF Global Services</h2>
                    <p className="lead text-muted">
                        Select a service from the options below to get started.
                    </p>
                </CCol>
            </CRow>
            <CRow>
                {menuItems.map((item, index) => (
                    <CCol xs={12} md={6} lg={4} key={index} className="mb-4">
                        <CCard className="h-100">
                            <CCardHeader>
                                <div className="d-flex align-items-center">
                                    <span className="fs-1 me-3">{item.icon}</span>
                                    <strong>{item.title}</strong>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <p>{item.description}</p>
                                <CButton
                                    color="primary"
                                    onClick={() => navigate(item.path)}
                                    className="w-100"
                                >
                                    Get Started
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    )
}