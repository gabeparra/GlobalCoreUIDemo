import React from 'react'

const LandingPage = React.lazy(() => import('./views/LandingPage'))
const I20RequestForm = React.lazy(() => import('./views/forms/I20RequestForm'))
const AcademicTrainingForm = React.lazy(() => import('./views/forms/AcademicTrainingForm'))
const AdministrativeRecordChangeForm = React.lazy(() => import('./views/forms/AdministrativeRecordChangeForm'))
const ConversationPartnerForm = React.lazy(() => import('./views/forms/ConversationPartner'))
const OPTRequestForm = React.lazy(() => import('./views/forms/OPTRequestForm'))
const DocumentRequestForm = React.lazy(() => import('./views/forms/DocumentRequest'))
const EnglishLanguageProgramVolunteerForm = React.lazy(() => import('./views/forms/EnglishLanguageProgramVolunteerForm'))
const FloridaStatute101035Form = React.lazy(() => import('./views/forms/FloridaStatute101035Form'))
const LeaveRequestForm = React.lazy(() => import('./views/forms/LeaveRequestForm'))
const LinkagesApplicationForm = React.lazy(() => import('./views/forms/LinkagesApplicationForm'))
const OffCampusHousingApplicationForm = React.lazy(() => import('./views/forms/OffCampusHousingApplicationForm'))
const OptStemExtensionReportingForm = React.lazy(() => import('./views/forms/OptStemExtensionReportingForm'))
const OptStemExtensionApplicationForm = React.lazy(() => import('./views/forms/OptStemExtensionApplication'))
const ExitForm = React.lazy(() => import('./views/forms/ExitForm'))
const AllRequestsList = React.lazy(() => import('./views/forms/AllRequestsList'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: LandingPage },
  { path: '/forms/i20-request', name: 'I-20 Request Form', element: I20RequestForm },
  { path: '/forms/academic-training', name: 'Academic Training Request Form', element: AcademicTrainingForm },
  { path: '/forms/administrative-record-change', name: 'Administrative Record Change', element: AdministrativeRecordChangeForm },
  { path: '/forms/conversation-partner', name: 'Conversation Partner Request', element: ConversationPartnerForm },
  { path: '/forms/opt-request', name: 'OPT Request Form', element: OPTRequestForm },
  { path: '/forms/document-request', name: 'Document Request', element: DocumentRequestForm },
  { path: '/forms/english-language-programs-volunteer', name: 'English Language Programs Volunteer', element: EnglishLanguageProgramVolunteerForm },
  { path: '/forms/florida-statute-101035', name: 'Florida Statute 101035', element: FloridaStatute101035Form },
  { path: '/forms/leave-request', name: 'Leave Request Form', element: LeaveRequestForm },
  { path: '/forms/linkages-application', name: 'Linkages Application Form', element: LinkagesApplicationForm },
  { path: '/forms/off-campus-housing', name: 'Off Campus Housing Application Form', element: OffCampusHousingApplicationForm },
  { path: '/forms/opt-stem-reporting', name: 'OPT and STEM Extension Reporting Form', element: OptStemExtensionReportingForm },
  { path: '/forms/opt-stem-extension-application', name: 'OPT STEM Extension Application Form', element: OptStemExtensionApplicationForm },
  { path: '/forms/exit', name: 'Exit Form', element: ExitForm },
  { path: '/forms/all-requests', name: 'All Form Submissions', element: AllRequestsList },
]

export default routes