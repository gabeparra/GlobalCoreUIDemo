from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text
from app.database import Base

class I20Request(Base):
    __tablename__ = "i20_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)  # Removed unique constraint to allow multiple submissions
    program = Column(String)
    submission_date = Column(DateTime)
    status = Column(String)
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)
    
    # Store large text fields separately
    other_reason = Column(Text, nullable=True)

class AcademicTrainingRequest(Base):
    __tablename__ = "academic_training_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Academic Training")
    completion_type = Column(String)  # 'pre' or 'post'
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)
    
    # Store comments separately
    comments = Column(Text, nullable=True)

class AdministrativeRecordRequest(Base):
    __tablename__ = "administrative_record_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Administrative Record Change")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class ConversationPartnerRequest(Base):
    __tablename__ = "conversation_partner_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Conversation Partner")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class OPTRequest(Base):
    __tablename__ = "opt_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="OPT Request")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class DocumentRequest(Base):
    __tablename__ = "document_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Document Request")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class EnglishLanguageVolunteerRequest(Base):
    __tablename__ = "english_language_volunteer_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="English Language Program Volunteer")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class OffCampusHousingRequest(Base):
    __tablename__ = "off_campus_housing_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Off Campus Housing Application")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class FloridaStatute101035Request(Base):
    __tablename__ = "florida_statute_101035_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Florida Statute 1010.35")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Leave Request")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class OptStemExtensionReport(Base):
    __tablename__ = "opt_stem_extension_reports"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="OPT STEM Extension Reporting")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class OptStemExtensionApplication(Base):
    __tablename__ = "opt_stem_extension_applications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="OPT STEM Extension Application")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class ExitForm(Base):
    __tablename__ = "exit_forms"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Exit Form")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

# Pathway Programs Intent to Progress Routes
class PathwayProgramsIntentToProgress(Base):
    __tablename__ = "pathway_programs_intent_to_progress"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)  # Removed unique constraint to allow multiple submissions
    program = Column(String)
    submission_date = Column(DateTime)
    status = Column(String)
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

# Pathway Programs Next Steps
class PathwayProgramsNextSteps(Base):
    __tablename__ = "pathway_programs_next_steps"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)  # Removed unique constraint to allow multiple submissions
    program = Column(String)
    submission_date = Column(DateTime)
    status = Column(String)
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class ReducedCourseLoadRequest(Base):
    __tablename__ = "reduced_course_load_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)  # Removed unique constraint to allow multiple submissions
    program = Column(String)
    submission_date = Column(DateTime)
    status = Column(String)
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class GlobalTransferOutRequest(Base):
    __tablename__ = "global_transfer_out_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String)
    submission_date = Column(DateTime)
    status = Column(String)
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class UCFGlobalRecordsReleaseForm(Base):
    __tablename__ = "ucf_global_records_release_forms"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="UCF Global Records Release")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)

class VirtualCheckInRequest(Base):
    __tablename__ = "virtual_checkin_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # Required basic fields
    student_name = Column(String, index=True)
    student_id = Column(String, index=True)
    program = Column(String, default="Virtual Check In")
    submission_date = Column(DateTime)
    status = Column(String, default="pending")
    
    # Store all form data as JSON
    form_data = Column(JSON, nullable=True)
    
    # Store remarks separately for better handling
    remarks = Column(Text, nullable=True)