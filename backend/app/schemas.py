from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Address(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

class Dependent(BaseModel):
    relationship: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    legal_sex: Optional[str] = None
    date_of_birth: Optional[str] = None
    city_of_birth: Optional[str] = None
    country_of_birth: Optional[str] = None
    country_of_citizenship: Optional[str] = None
    # Note: passport file handling would require additional setup

class I20RequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Additional form fields
    student_type: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    legal_sex: Optional[str] = None
    date_of_birth: Optional[str] = None
    city_of_birth: Optional[str] = None
    country_of_birth: Optional[str] = None
    country_of_citizenship: Optional[str] = None
    
    # Contact information
    ucf_email: Optional[str] = None
    personal_email: Optional[str] = None
    us_telephone: Optional[str] = None
    non_us_telephone: Optional[str] = None
    
    # Address information
    has_us_address: Optional[bool] = True
    has_non_us_address: Optional[bool] = True
    us_address: Optional[Address] = None
    non_us_address: Optional[Address] = None
    
    # Academic information
    current_level: Optional[str] = None
    new_level: Optional[str] = None
    previous_major: Optional[str] = None
    new_major: Optional[str] = None
    
    # Program extension
    program_ext_end_term: Optional[str] = None
    program_ext_end_year: Optional[str] = None
    
    # Status change
    status_change_method: Optional[str] = None
    status_level: Optional[str] = None
    status_major: Optional[str] = None
    status_start_term: Optional[str] = None
    status_start_year: Optional[str] = None
    
    # Absence information
    absence_level: Optional[str] = None
    absence_major: Optional[str] = None
    absence_start_term: Optional[str] = None
    absence_start_year: Optional[str] = None
    
    # Travel information
    departure_date: Optional[str] = None
    planned_return_date: Optional[str] = None
    
    # Dependent information
    dependent_action: Optional[str] = None
    dependents: Optional[List[Dependent]] = None
    
    # Other
    other_reason: Optional[str] = None
    certification_checked: Optional[bool] = False
    
    # Raw form data for debugging/completeness
    raw_form_data: Optional[Dict[str, Any]] = None

class I20RequestCreate(I20RequestBase):
    pass

class I20Request(I20RequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None
    other_reason: Optional[str] = None

class AcademicTrainingRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Academic Training"
    completion_type: str  # 'pre' or 'post'
    
    # Personal Information
    sevis_id: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    legal_sex: Optional[str] = None
    date_of_birth: Optional[str] = None
    city_of_birth: Optional[str] = None
    country_of_birth: Optional[str] = None
    country_of_citizenship: Optional[str] = None
    country_of_legal_residence: Optional[str] = None
    
    # U.S. Address
    has_us_address: Optional[bool] = True
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    
    # Contact Information
    us_telephone: Optional[str] = None
    non_us_telephone: Optional[str] = None
    
    # Questionnaire
    enrolled_full_time: Optional[bool] = None
    academic_training_start_date: Optional[str] = None
    academic_training_end_date: Optional[str] = None
    employed_on_campus: Optional[bool] = None
    previously_authorized: Optional[bool] = None
    
    # Documents (file paths or references)
    offer_letter: Optional[str] = None
    training_authorization: Optional[str] = None
    
    # Statements of Agreement
    understand_pre_completion: Optional[bool] = False
    understand_post_completion: Optional[bool] = False
    understand_medical_insurance: Optional[bool] = False
    understand_employer_specific: Optional[bool] = False
    understand_consult_advisor: Optional[bool] = False
    
    # Submission
    comments: Optional[str] = None
    certify_information: Optional[bool] = False
    
    # Raw form data for debugging/completeness
    raw_form_data: Optional[Dict[str, Any]] = None

class AcademicTrainingRequestCreate(AcademicTrainingRequestBase):
    pass

class AcademicTrainingRequest(AcademicTrainingRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None
    comments: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class AdministrativeRecordRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Administrative Record Change"
    
    # Student Information
    ucf_id: Optional[str] = None
    sevis_id: Optional[str] = None
    date: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    student_email: Optional[str] = None
    preferred_phone: Optional[str] = None
    current_program: Optional[str] = None
    
    # Visa Information
    visa_type: Optional[str] = None
    visa_status: Optional[str] = None
    visa_info_correct: Optional[str] = None
    
    # Action Requested
    action_requested: Optional[List[str]] = None
    
    # Certification
    certification_checked: Optional[bool] = False

class AdministrativeRecordRequestCreate(AdministrativeRecordRequestBase):
    pass

class AdministrativeRecordRequest(AdministrativeRecordRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class ConversationPartnerRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Conversation Partner"
    
    # Personal Information
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    ucf_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Academic Information
    academic_level: Optional[str] = None
    major: Optional[str] = None
    minor: Optional[str] = None
    legal_sex: Optional[str] = None
    
    # Partner Preferences
    speaks_foreign_language: Optional[str] = None
    opposite_sex_partner: Optional[str] = None
    multiple_partners: Optional[str] = None
    sign_off_needed: Optional[str] = None
    semester_commitment: Optional[str] = None
    
    # Consent
    agree_to_expectations: Optional[bool] = False
    consent_to_share_email: Optional[bool] = False

class ConversationPartnerRequestCreate(ConversationPartnerRequestBase):
    pass

class ConversationPartnerRequest(ConversationPartnerRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class OPTRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "OPT Request"
    
    # Contact Information
    ucf_id: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    legal_sex: Optional[str] = None
    country_of_citizenship: Optional[str] = None
    academic_level: Optional[str] = None
    academic_program: Optional[str] = None
    
    # Address Information
    address: Optional[str] = None
    address2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Contact Details
    ucf_email_address: Optional[str] = None
    secondary_email_address: Optional[str] = None
    telephone_number: Optional[str] = None
    information_correct: Optional[bool] = False
    
    # Questionnaire
    full_time_student: Optional[str] = None
    intent_to_graduate: Optional[str] = None
    semester_of_graduation: Optional[str] = None
    desired_opt_start_date: Optional[str] = None
    desired_opt_end_date: Optional[str] = None
    currently_employed_on_campus: Optional[str] = None
    previous_opt_authorization: Optional[str] = None
    
    # Document Uploads (file paths)
    photo2x2: Optional[str] = None
    passport_biographical: Optional[str] = None
    f1_visa_or_uscis_notice: Optional[str] = None
    i94: Optional[str] = None
    form_i765: Optional[str] = None
    form_g1145: Optional[str] = None
    previous_i20s: Optional[str] = None
    previous_ead: Optional[str] = None
    
    # Statements of Agreement
    opt_workshop_completed: Optional[bool] = False
    opt_request_timeline: Optional[bool] = False
    ead_card_copy: Optional[bool] = False
    report_changes: Optional[bool] = False
    unemployment_limit: Optional[bool] = False
    employment_start_date: Optional[bool] = False

class OPTRequestCreate(OPTRequestBase):
    pass

class OPTRequest(OPTRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class DocumentRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Document Request"
    
    # Personal Information
    request_id: Optional[str] = None
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    
    # Document Information
    global_student_document: Optional[str] = None
    undergrad_document: Optional[str] = None
    format: Optional[str] = None
    additional_info: Optional[str] = None

class DocumentRequestCreate(DocumentRequestBase):
    pass

class DocumentRequest(DocumentRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class EnglishLanguageVolunteerRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Personal information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    ucf_email: Optional[str] = None
    academic_level: Optional[str] = None
    
    # Course information
    course_name: Optional[str] = None
    course_instructor: Optional[str] = None
    college: Optional[str] = None
    term: Optional[str] = None
    
    # Position preferences
    position_intensive_english: Optional[bool] = False
    position_online_english: Optional[bool] = False
    hours_per_week: Optional[str] = None
    
    # Availability (all days and time slots)
    availability_monday_morning: Optional[bool] = False
    availability_monday_afternoon: Optional[bool] = False
    availability_monday_evening: Optional[bool] = False
    availability_tuesday_morning: Optional[bool] = False
    availability_tuesday_afternoon: Optional[bool] = False
    availability_tuesday_evening: Optional[bool] = False
    availability_wednesday_morning: Optional[bool] = False
    availability_wednesday_afternoon: Optional[bool] = False
    availability_wednesday_evening: Optional[bool] = False
    availability_thursday_morning: Optional[bool] = False
    availability_thursday_afternoon: Optional[bool] = False
    availability_thursday_evening: Optional[bool] = False
    availability_friday_morning: Optional[bool] = False
    availability_friday_afternoon: Optional[bool] = False
    availability_friday_evening: Optional[bool] = False
    
    # Additional information
    remarks: Optional[str] = None

class EnglishLanguageVolunteerRequestCreate(EnglishLanguageVolunteerRequestBase):
    pass

class EnglishLanguageVolunteerRequest(EnglishLanguageVolunteerRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class OffCampusHousingRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Personal information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    email_address: Optional[str] = None
    program_type: Optional[str] = None
    
    # Housing selections
    housing_spring_2026: Optional[bool] = False
    housing_spring_2026_session_2: Optional[bool] = False
    housing_summer_2026: Optional[bool] = False
    housing_summer_2026_session_2: Optional[bool] = False
    housing_fall_2025: Optional[bool] = False
    
    # Payment information
    acknowledgement: Optional[bool] = False
    amount_due: Optional[float] = 250.00
    payment_status: Optional[str] = "PENDING"

class OffCampusHousingRequestCreate(OffCampusHousingRequestBase):
    pass

class OffCampusHousingRequest(OffCampusHousingRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class FloridaStatute101035RequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Personal information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    telephone_number: Optional[str] = None
    email_address: Optional[str] = None
    sevis_number: Optional[str] = None
    
    # University information
    college: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    
    # Immigration information
    has_passport: Optional[str] = None
    has_ds160: Optional[str] = None
    
    # Document paths (for file uploads)
    passport_document_path: Optional[str] = None

class FloridaStatute101035RequestCreate(FloridaStatute101035RequestBase):
    pass

class FloridaStatute101035Request(FloridaStatute101035RequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class LeaveRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Leave information
    leave_type: Optional[str] = None
    from_date: Optional[str] = None
    from_time: Optional[str] = None
    to_date: Optional[str] = None
    to_time: Optional[str] = None
    hours_requested: Optional[float] = None
    reason: Optional[str] = None
    
    # Faculty information
    course_name: Optional[str] = None
    
    # Documentation path (for file upload)
    documentation_path: Optional[str] = None

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequest(LeaveRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class OptStemExtensionReportBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Personal Information
    ucf_id: Optional[str] = None
    sevis_id: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    street_address: Optional[str] = None
    apartment_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    ucf_email_address: Optional[str] = None
    secondary_email_address: Optional[str] = None
    us_telephone_number: Optional[str] = None
    
    # Employment Authorization
    standard_opt: Optional[bool] = False
    stem_extension: Optional[bool] = False

class OptStemExtensionReportCreate(OptStemExtensionReportBase):
    pass

class OptStemExtensionReport(OptStemExtensionReportBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class OptStemExtensionApplicationBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str
    
    # Contact Information
    ucf_id: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    country_of_citizenship: Optional[str] = None
    academic_level: Optional[str] = None
    academic_program: Optional[str] = None
    
    # Current U.S. Mailing Address
    address: Optional[str] = None
    address_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    ucf_email_address: Optional[str] = None
    secondary_email_address: Optional[str] = None
    telephone_number: Optional[str] = None
    
    # Employment Information
    job_title: Optional[str] = None
    employer_name: Optional[str] = None
    employer_ein: Optional[str] = None
    employment_street_address: Optional[str] = None
    employment_city: Optional[str] = None
    employment_state: Optional[str] = None
    employment_postal_code: Optional[str] = None
    supervisor_first_name: Optional[str] = None
    supervisor_last_name: Optional[str] = None
    supervisor_email: Optional[str] = None
    supervisor_telephone: Optional[str] = None
    hours_per_week: Optional[str] = None
    is_paid_position: Optional[bool] = None
    is_staffing_firm: Optional[bool] = None
    has_e_verify: Optional[bool] = None
    
    # Additional Information
    based_on_previous_stem_degree: Optional[bool] = None
    
    # Document paths (all optional for testing)
    photo_2x2_path: Optional[str] = None
    form_i983_path: Optional[str] = None
    passport_path: Optional[str] = None
    f1_visa_path: Optional[str] = None
    i94_path: Optional[str] = None
    ead_card_path: Optional[str] = None
    form_i765_path: Optional[str] = None
    form_g1145_path: Optional[str] = None
    diploma_path: Optional[str] = None
    transcripts_path: Optional[str] = None
    previous_i20s_path: Optional[str] = None
    
    # Statements of Agreement
    completed_stem_workshop: Optional[bool] = None
    provide_ead_copy: Optional[bool] = None
    understand_unemployment_limits: Optional[bool] = None
    notify_changes: Optional[bool] = None
    submit_updated_i983: Optional[bool] = None
    comply_reporting_requirements: Optional[bool] = None
    reviewed_photo_requirements: Optional[bool] = None
    reviewed_fee_payment: Optional[bool] = None

class OptStemExtensionApplicationCreate(OptStemExtensionApplicationBase):
    pass

class OptStemExtensionApplication(OptStemExtensionApplicationBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class ExitFormBase(BaseModel):
    # Biographical Information
    ucf_id: str
    sevis_id: Optional[str] = None
    visa_type: Optional[str] = None
    given_name: str
    family_name: str
    
    # U.S. Address
    us_street_address: Optional[str] = None
    apartment_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Foreign Address
    foreign_street_address: Optional[str] = None
    foreign_city: Optional[str] = None
    foreign_postal_code: Optional[str] = None
    country: Optional[str] = None
    
    # Contact Information
    ucf_email: str
    secondary_email: Optional[str] = None
    us_telephone: Optional[str] = None
    foreign_telephone: Optional[str] = None
    
    # Current Academic Information
    education_level: Optional[str] = None
    employed_on_campus: Optional[str] = None
    
    # Departure Information
    departure_date: Optional[str] = None
    flight_itinerary: Optional[str] = None
    departure_reason: Optional[str] = None
    
    # Statements of Agreement
    work_authorization_acknowledgment: Optional[bool] = None
    cpt_opt_acknowledgment: Optional[bool] = None
    financial_obligations_acknowledgment: Optional[bool] = None
    remarks: Optional[str] = None

class ExitFormCreate(ExitFormBase):
    pass

class ExitForm(BaseModel):
    id: int
    student_name: str
    student_id: str
    program: str
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class PathwayProgramsIntentToProgressBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Pathway Programs Intent to Progress"

    # Student Information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    ethnicity: Optional[str] = None

    # Permanent Address
    street_address: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

    # UCF Global Program
    ucf_global_program: Optional[str] = None

    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_street_address: Optional[str] = None
    emergency_contact_city: Optional[str] = None
    emergency_contact_state: Optional[str] = None
    emergency_contact_postal_code: Optional[str] = None
    emergency_contact_country: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    # Application Information
    expected_progression_term: Optional[str] = None
    academic_credits_earned: Optional[str] = None
    intended_major: Optional[str] = None
    has_accelerated_credits: Optional[bool] = None

    # Post-Secondary Information
    attended_other_institutions: Optional[bool] = None

    # College Entrance Exams
    sat_total_score: Optional[str] = None
    sat_date_taken: Optional[str] = None
    act_total_score: Optional[str] = None
    act_date_taken: Optional[str] = None

    # Crime/Disciplinary Questions
    disciplinary_action: Optional[bool] = None
    felony_conviction: Optional[bool] = None
    criminal_proceedings: Optional[bool] = None

    # Disclaimer
    certification: Optional[bool] = None

    # Raw form data for debugging/completeness
    raw_form_data: Optional[Dict[str, Any]] = None

class PathwayProgramsIntentToProgressCreate(PathwayProgramsIntentToProgressBase):
    pass

class PathwayProgramsIntentToProgress(PathwayProgramsIntentToProgressBase):
    id: int
    submission_date: Optional[datetime] = None
    status: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class PathwayProgramsNextStepsBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Pathway Programs Next Steps"

    # Personal Information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    legal_sex: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None

    # Academic Information
    academic_program: Optional[str] = None
    academic_track: Optional[str] = None
    intended_major: Optional[str] = None

    # Dietary Requirements
    dietary_requirements: Optional[str] = None

    # Housing
    housing_selection: Optional[str] = None

    # Acknowledgements
    program_acknowledgement: Optional[bool] = False
    housing_acknowledgement: Optional[bool] = False
    health_insurance_acknowledgement: Optional[bool] = False

    class Config:
        from_attributes = True
        populate_by_name = True

class PathwayProgramsNextSteps(PathwayProgramsNextStepsBase):
    id: int
    submission_date: Optional[datetime] = None
    status: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class PathwayProgramsNextStepsCreate(PathwayProgramsNextStepsBase):
    pass

class ReducedCourseLoadRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Reduced Course Load Request"

    # Student Information
    ucf_id: Optional[str] = None
    sevis_id: Optional[str] = None
    visa_type: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    street_address: Optional[str] = None
    apartment_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    ucf_email_address: Optional[str] = None
    secondary_email_address: Optional[str] = None
    us_telephone_number: Optional[str] = None

    # Academic Information
    academic_level: Optional[str] = None
    academic_program_major: Optional[str] = None
    rcl_term: Optional[str] = None
    rcl_year: Optional[str] = None
    desired_credits: Optional[str] = None
    in_person_credits: Optional[str] = None

    # RCL Reason
    rcl_reason: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class ReducedCourseLoadRequestCreate(ReducedCourseLoadRequestBase):
    pass

class ReducedCourseLoadRequest(ReducedCourseLoadRequestBase):
    id: int
    submission_date: Optional[datetime] = None
    status: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class GlobalTransferOutRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Global Transfer Out Request"

    # Student Information
    ucf_id: Optional[str] = None
    sevis_id: Optional[str] = None
    visa_type: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    street_address: Optional[str] = None
    apartment_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    ucf_email_address: Optional[str] = None
    secondary_email_address: Optional[str] = None
    us_telephone_number: Optional[str] = None

    # Current Academic Information
    ucf_education_level: Optional[str] = None
    campus_employment: Optional[str] = None

    # New School Information
    new_school_name: Optional[str] = None
    new_school_start_date: Optional[str] = None
    desired_sevis_release_date: Optional[str] = None
    new_school_international_advisor_name: Optional[str] = None
    new_school_international_advisor_email: Optional[str] = None
    new_school_international_advisor_phone: Optional[str] = None

    # Additional Information Checkboxes
    understanding_sevis_release: Optional[bool] = False
    permission_to_communicate: Optional[bool] = False
    understanding_work_authorization: Optional[bool] = False
    understanding_financial_obligations: Optional[bool] = False

    class Config:
        from_attributes = True
        populate_by_name = True

class GlobalTransferOutRequestCreate(GlobalTransferOutRequestBase):
    pass

class GlobalTransferOutRequest(GlobalTransferOutRequestBase):
    id: int
    submission_date: Optional[datetime] = None
    status: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class UCFGlobalRecordsReleaseFormBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "UCF Global Records Release"

    # Personal Information
    ucf_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    ucf_email: Optional[str] = None
    personal_email: Optional[str] = None

    # Records Release Information
    records_to_release: Optional[List[str]] = None
    release_recipient: Optional[str] = None

    # Authorization
    authorization_checked: Optional[bool] = False
    signature: Optional[str] = None
    signature_date: Optional[str] = None

    # Raw form data for debugging/completeness
    raw_form_data: Optional[Dict[str, Any]] = None

class UCFGlobalRecordsReleaseFormCreate(UCFGlobalRecordsReleaseFormBase):
    # Also accept nested form_data structure from frontend
    form_data: Optional[Dict[str, Any]] = None

class UCFGlobalRecordsReleaseForm(UCFGlobalRecordsReleaseFormBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class VirtualCheckInRequestBase(BaseModel):
    # Required basic fields
    student_name: str
    student_id: str
    program: str = "Virtual Check In"
    
    # Personal Information
    ucf_id: Optional[str] = None
    sevis_id: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    visa_type: Optional[str] = None  # F-1 or J-1
    
    # U.S. Address (THIS IS REQUIRED)
    street_address: Optional[str] = None
    apartment_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    us_telephone: Optional[str] = None
    has_us_telephone: Optional[bool] = True
    ucf_email: Optional[str] = None
    secondary_email: Optional[str] = None
    
    # Emergency Contact
    emergency_given_name: Optional[str] = None
    emergency_family_name: Optional[str] = None
    emergency_relationship: Optional[str] = None
    emergency_street_address: Optional[str] = None
    emergency_city: Optional[str] = None
    emergency_state_province: Optional[str] = None
    emergency_country: Optional[str] = None
    emergency_postal_code: Optional[str] = None
    emergency_us_telephone: Optional[str] = None
    emergency_non_us_telephone: Optional[str] = None
    emergency_has_us_telephone: Optional[bool] = True
    emergency_has_non_us_telephone: Optional[bool] = True
    emergency_email: Optional[str] = None
    
    # Required Documents (file paths will be stored)
    visa_notice_of_action_path: Optional[str] = None
    form_i94_path: Optional[str] = None
    passport_path: Optional[str] = None
    other_documents_path: Optional[str] = None
    
    # Dependent(s) Information - placeholder for future expansion
    has_dependents: Optional[bool] = False
    
    # Submission
    authorization_checked: Optional[bool] = False
    
    # Remarks
    remarks: Optional[str] = None
    
    # Raw form data for debugging/completeness
    raw_form_data: Optional[Dict[str, Any]] = None

class VirtualCheckInRequestCreate(VirtualCheckInRequestBase):
    pass

class VirtualCheckInRequest(VirtualCheckInRequestBase):
    id: int
    submission_date: datetime
    status: str
    form_data: Optional[Dict[str, Any]] = None
    remarks: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True