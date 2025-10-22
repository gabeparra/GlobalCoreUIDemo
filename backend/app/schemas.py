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