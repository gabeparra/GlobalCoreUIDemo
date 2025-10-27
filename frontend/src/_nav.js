import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilNotes, cilPencil, cilUser } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Forms',
    to: '/forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'I-20 Request',
        to: '/forms/i20-request',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Academic Training',
        to: '/forms/academic-training',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Administrative Record Change',
        to: '/forms/administrative-record-change',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Conversation Partner',
        to: '/forms/conversation-partner',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'OPT Request',
        to: '/forms/opt-request',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Document Request',
        to: '/forms/document-request',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'English Language Programs Volunteer',
        to: '/forms/english-language-programs-volunteer',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Florida Statute 101035',
        to: '/forms/florida-statute-101035',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Leave Request',
        to: '/forms/leave-request',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Linkages Application',
        to: '/forms/linkages-application',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Off Campus Housing',
        to: '/forms/off-campus-housing',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'OPT and STEM Extension Reporting',
        to: '/forms/opt-stem-reporting',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'OPT STEM Extension Application',
        to: '/forms/opt-stem-extension-application',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Exit Form',
        to: '/forms/exit',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Pathway Programs Next Steps',
        to: '/forms/pathway-programs-next-steps',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Pathway Programs Intent to Progress',
        to: '/forms/pathway-programs-intent-to-progress',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Reduced Course Load Request',
        to: '/forms/reduced-course-load',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'SPEAK Test Registration',
        to: '/forms/speak-test-registration',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Global Transfer Out',
        to: '/forms/global-transfer-out',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Travel Approval Petition',
        to: '/forms/travel-approval-petition',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'UCF Global Records Release',
        to: '/forms/ucf-global-records-release',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Virtual Check In',
        to: '/forms/virtual-checkin',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'All Submissions',
        to: '/forms/all-requests',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav