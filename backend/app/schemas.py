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