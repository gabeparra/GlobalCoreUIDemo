from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

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