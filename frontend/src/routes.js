import React, { Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

// Lazy load components
const LandingPage = lazy(() => import('./views/LandingPage'))
const AllRequestsList = lazy(() => import('./views/forms/AllRequestsList'))

// Import all form components
const I20RequestForm = lazy(() => import('./views/forms/I20RequestForm'))
const AcademicTrainingForm = lazy(() => import('./views/forms/AcademicTrainingForm'))
const AdministrativeRecordChangeForm = lazy(() => import('./views/forms/AdministrativeRecordChangeForm'))
const ConversationPartnerForm = lazy(() => import('./views/forms/ConversationPartner'))
const OPTRequestForm = lazy(() => import('./views/forms/OPTRequestForm'))
const DocumentRequestForm = lazy(() => import('./views/forms/DocumentRequest'))
const EnglishLanguageVolunteerForm = lazy(() => import('./views/forms/EnglishLanguageProgramVolunteerForm'))
const OffCampusHousingApplicationForm = lazy(() => import('./views/forms/OffCampusHousingApplicationForm'))
const FloridaStatute101035Form = lazy(() => import('./views/forms/FloridaStatute101035Form'))
const LeaveRequestForm = lazy(() => import('./views/forms/LeaveRequestForm'))
const OptStemExtensionReportingForm = lazy(() => import('./views/forms/OptStemExtensionReportingForm'))
const OptStemExtensionApplicationForm = lazy(() => import('./views/forms/OptStemExtensionApplication'))
const ExitForm = lazy(() => import('./views/forms/ExitForm'))
const PathwayProgramsIntentToProgressForm = lazy(() => import('./views/forms/PathwayProgramsIntentToProgress'))
const PathwayProgramsNextStepsForm = lazy(() => import('./views/forms/PathwayProgramsNextSteps'))
const LinkagesApplicationForm = lazy(() => import('./views/forms/LinkagesApplicationForm'))
const ReducedCourseLoadRequestForm = lazy(() => import('./views/forms/ReducedCourseLoadRequestForm'))
const SpeakTestRegistrationForm = lazy(() => import('./views/forms/SpeakTestRegistrationForm'))
const GlobalTransferOutForm = lazy(() => import('./views/forms/GlobalTransferOutForm'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: LandingPage },
  { path: '/forms/all-requests', name: 'All Requests', element: AllRequestsList },
  // Form Routes
  { path: '/forms/i20-request', name: 'I-20 Request', element: I20RequestForm },
  { path: '/forms/academic-training', name: 'Academic Training', element: AcademicTrainingForm },
  { path: '/forms/administrative-record-change', name: 'Administrative Record Change', element: AdministrativeRecordChangeForm },
  { path: '/forms/conversation-partner', name: 'Conversation Partner', element: ConversationPartnerForm },
  { path: '/forms/opt-request', name: 'OPT Request', element: OPTRequestForm },
  { path: '/forms/document-request', name: 'Document Request', element: DocumentRequestForm },
  { path: '/forms/english-language-programs-volunteer', name: 'English Language Volunteer', element: EnglishLanguageVolunteerForm },
  { path: '/forms/off-campus-housing', name: 'Off Campus Housing', element: OffCampusHousingApplicationForm },
  { path: '/forms/florida-statute-101035', name: 'Florida Statute 1010.35', element: FloridaStatute101035Form },
  { path: '/forms/leave-request', name: 'Leave Request', element: LeaveRequestForm },
  { path: '/forms/opt-stem-reporting', name: 'OPT STEM Extension Reporting', element: OptStemExtensionReportingForm },
  { path: '/forms/opt-stem-extension-application', name: 'OPT STEM Extension Application', element: OptStemExtensionApplicationForm },
  { path: '/forms/exit', name: 'Exit Form', element: ExitForm },
  { path: '/forms/pathway-programs-intent-to-progress', name: 'Pathway Programs Intent to Progress', element: PathwayProgramsIntentToProgressForm },
  { path: '/forms/pathway-programs-next-steps', name: 'Pathway Programs Next Steps', element: PathwayProgramsNextStepsForm },
  { path: '/forms/linkages-application', name: 'Linkages Application', element: LinkagesApplicationForm },
  { path: '/forms/reduced-course-load', name: 'Reduced Course Load Request', element: ReducedCourseLoadRequestForm },
  { path: '/forms/speak-test-registration', name: 'SPEAK Test Registration', element: SpeakTestRegistrationForm },
  { path: '/forms/global-transfer-out', name: 'Global Transfer Out', element: GlobalTransferOutForm }
]

export default routes