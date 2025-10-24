from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import os
import uuid
from pathlib import Path

from app import models, schemas
from app.database import get_db
from app.utils import (
    create_request_from_schema,
    create_request_from_form_data,
    get_requests,
    get_request_by_id,
    delete_request_by_id,
    delete_all_requests,
    create_request_with_files,
    save_upload_file,
    handle_file_uploads,
    REQUEST_CONFIGS
)

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Welcome to the I-20 Request API"}

@router.post("/debug/", status_code=200)
async def debug_endpoint(request_body: dict):
    """Debug endpoint that accepts any JSON and returns it with status info"""
    print(f"Debug endpoint received: {request_body}")
    return {
        "status": "received",
        "received_data": request_body,
        "message": "This is a debug endpoint that echoes back any JSON sent to it"
    }

# =============================================================================
# SCHEMA-BASED ROUTES (Using Pydantic models)
# =============================================================================

@router.post("/i20-requests/", response_model=schemas.I20Request)
def create_i20_request(request: schemas.I20RequestCreate, db: Session = Depends(get_db)):
    """Create a new I-20 request using schema-based approach"""
    return create_request_from_schema(
        db=db,
        model_class=models.I20Request,
        request_schema=request,
        program_name="I-20 Request",
        exclude_fields=["student_name", "student_id", "program", "other_reason"]
    )

@router.get("/i20-requests/", response_model=List[schemas.I20Request])
def get_i20_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all I-20 requests with pagination"""
    return get_requests(db, models.I20Request, skip, limit)

@router.get("/i20-requests/{request_id}", response_model=schemas.I20Request)
def get_i20_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific I-20 request by ID"""
    return get_request_by_id(db, models.I20Request, request_id, "I-20 request")

@router.delete("/i20-requests/{request_id}", status_code=204)
def delete_i20_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific I-20 request"""
    return delete_request_by_id(db, models.I20Request, request_id, "I-20 request")

@router.delete("/i20-requests/", status_code=204)
def delete_all_i20_requests(db: Session = Depends(get_db)):
    """Delete all I-20 requests from the database"""
    return delete_all_requests(db, models.I20Request, "I-20 request")

# =============================================================================
# ADMINISTRATIVE RECORD ROUTES
# =============================================================================

@router.post("/administrative-record/", response_model=schemas.AdministrativeRecordRequest)
def create_administrative_record_request(request: schemas.AdministrativeRecordRequestCreate, db: Session = Depends(get_db)):
    """Create a new Administrative Record request"""
    return create_request_from_schema(
        db=db,
        model_class=models.AdministrativeRecordRequest,
        request_schema=request,
        program_name="Administrative Record Change"
    )

@router.get("/administrative-record/", response_model=List[schemas.AdministrativeRecordRequest])
def get_administrative_record_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Administrative Record requests"""
    return get_requests(db, models.AdministrativeRecordRequest, skip, limit)

@router.get("/administrative-record/{request_id}", response_model=schemas.AdministrativeRecordRequest)
def get_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Administrative Record request by ID"""
    return get_request_by_id(db, models.AdministrativeRecordRequest, request_id, "Administrative Record request")

@router.delete("/administrative-record/{request_id}", status_code=204)
def delete_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Administrative Record request"""
    return delete_request_by_id(db, models.AdministrativeRecordRequest, request_id, "Administrative Record request")

@router.delete("/administrative-record/", status_code=204)
def delete_all_administrative_record_requests(db: Session = Depends(get_db)):
    """Delete all Administrative Record requests"""
    return delete_all_requests(db, models.AdministrativeRecordRequest, "Administrative Record request")

# =============================================================================
# CONVERSATION PARTNER ROUTES
# =============================================================================

@router.post("/conversation-partner/", response_model=schemas.ConversationPartnerRequest)
def create_conversation_partner_request(request: schemas.ConversationPartnerRequestCreate, db: Session = Depends(get_db)):
    """Create a new Conversation Partner request"""
    return create_request_from_schema(
        db=db,
        model_class=models.ConversationPartnerRequest,
        request_schema=request,
        program_name="Conversation Partner"
    )

@router.get("/conversation-partner/", response_model=List[schemas.ConversationPartnerRequest])
def get_conversation_partner_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Conversation Partner requests"""
    return get_requests(db, models.ConversationPartnerRequest, skip, limit)

@router.get("/conversation-partner/{request_id}", response_model=schemas.ConversationPartnerRequest)
def get_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Conversation Partner request by ID"""
    return get_request_by_id(db, models.ConversationPartnerRequest, request_id, "Conversation Partner request")

@router.delete("/conversation-partner/{request_id}", status_code=204)
def delete_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Conversation Partner request"""
    return delete_request_by_id(db, models.ConversationPartnerRequest, request_id, "Conversation Partner request")

@router.delete("/conversation-partner/", status_code=204)
def delete_all_conversation_partner_requests(db: Session = Depends(get_db)):
    """Delete all Conversation Partner requests"""
    return delete_all_requests(db, models.ConversationPartnerRequest, "Conversation Partner request")

# =============================================================================
# DOCUMENT REQUEST ROUTES
# =============================================================================

@router.post("/document-requests/", response_model=schemas.DocumentRequest)
def create_document_request(request: schemas.DocumentRequestCreate, db: Session = Depends(get_db)):
    """Create a new Document Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.DocumentRequest,
        request_schema=request,
        program_name="Document Request"
    )

@router.get("/document-requests/", response_model=List[schemas.DocumentRequest])
def get_document_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Document requests"""
    return get_requests(db, models.DocumentRequest, skip, limit)

@router.get("/document-requests/{request_id}", response_model=schemas.DocumentRequest)
def get_document_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Document request by ID"""
    return get_request_by_id(db, models.DocumentRequest, request_id, "Document request")

@router.delete("/document-requests/{request_id}", status_code=204)
def delete_document_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Document request"""
    return delete_request_by_id(db, models.DocumentRequest, request_id, "Document request")

@router.delete("/document-requests/", status_code=204)
def delete_all_document_requests(db: Session = Depends(get_db)):
    """Delete all Document requests"""
    return delete_all_requests(db, models.DocumentRequest, "Document request")

# =============================================================================
# ENGLISH LANGUAGE VOLUNTEER ROUTES
# =============================================================================

@router.post("/english-language-volunteer/", response_model=schemas.EnglishLanguageVolunteerRequest)
def create_english_language_volunteer_request(request: schemas.EnglishLanguageVolunteerRequestCreate, db: Session = Depends(get_db)):
    """Create a new English Language Volunteer request"""
    return create_request_from_schema(
        db=db,
        model_class=models.EnglishLanguageVolunteerRequest,
        request_schema=request,
        program_name="English Language Volunteer"
    )

@router.get("/english-language-volunteer/", response_model=List[schemas.EnglishLanguageVolunteerRequest])
def get_english_language_volunteer_requests(db: Session = Depends(get_db)):
    """Get all English Language Volunteer requests"""
    return get_requests(db, models.EnglishLanguageVolunteerRequest)

@router.get("/english-language-volunteer/{request_id}", response_model=schemas.EnglishLanguageVolunteerRequest)
def get_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific English Language Volunteer request by ID"""
    return get_request_by_id(db, models.EnglishLanguageVolunteerRequest, request_id, "English Language Volunteer request")

@router.delete("/english-language-volunteer/{request_id}")
def delete_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific English Language Volunteer request"""
    return delete_request_by_id(db, models.EnglishLanguageVolunteerRequest, request_id, "English Language Volunteer request")

@router.delete("/english-language-volunteer/")
def delete_all_english_language_volunteer_requests(db: Session = Depends(get_db)):
    """Delete all English Language Volunteer requests"""
    return delete_all_requests(db, models.EnglishLanguageVolunteerRequest, "English Language Volunteer request")

# =============================================================================
# OFF CAMPUS HOUSING ROUTES
# =============================================================================

@router.post("/off-campus-housing/", response_model=schemas.OffCampusHousingRequest)
def create_off_campus_housing_request(request: schemas.OffCampusHousingRequestCreate, db: Session = Depends(get_db)):
    """Create a new Off Campus Housing request"""
    return create_request_from_schema(
        db=db,
        model_class=models.OffCampusHousingRequest,
        request_schema=request,
        program_name="Off Campus Housing"
    )

@router.get("/off-campus-housing/", response_model=List[schemas.OffCampusHousingRequest])
def get_off_campus_housing_requests(db: Session = Depends(get_db)):
    """Get all Off Campus Housing requests"""
    return get_requests(db, models.OffCampusHousingRequest)

@router.get("/off-campus-housing/{request_id}", response_model=schemas.OffCampusHousingRequest)
def get_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Off Campus Housing request by ID"""
    return get_request_by_id(db, models.OffCampusHousingRequest, request_id, "Off Campus Housing request")

@router.delete("/off-campus-housing/{request_id}")
def delete_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Off Campus Housing request"""
    return delete_request_by_id(db, models.OffCampusHousingRequest, request_id, "Off Campus Housing request")

@router.delete("/off-campus-housing/")
def delete_all_off_campus_housing_requests(db: Session = Depends(get_db)):
    """Delete all Off Campus Housing requests"""
    return delete_all_requests(db, models.OffCampusHousingRequest, "Off Campus Housing request")

# =============================================================================
# OPT STEM EXTENSION REPORT ROUTES
# =============================================================================

@router.post("/opt-stem-reports/", response_model=schemas.OptStemExtensionReport)
def create_opt_stem_report(request: schemas.OptStemExtensionReportCreate, db: Session = Depends(get_db)):
    """Create a new OPT STEM Extension Report"""
    return create_request_from_schema(
        db=db,
        model_class=models.OptStemExtensionReport,
        request_schema=request,
        program_name="OPT STEM Extension Report"
    )

@router.get("/opt-stem-reports/", response_model=List[schemas.OptStemExtensionReport])
def get_opt_stem_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all OPT STEM Extension reports"""
    return get_requests(db, models.OptStemExtensionReport, skip, limit)

@router.get("/opt-stem-reports/{request_id}", response_model=schemas.OptStemExtensionReport)
def get_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Get a specific OPT STEM Extension report by ID"""
    return get_request_by_id(db, models.OptStemExtensionReport, request_id, "OPT STEM Extension report")

@router.delete("/opt-stem-reports/{request_id}", status_code=204)
def delete_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT STEM Extension report"""
    return delete_request_by_id(db, models.OptStemExtensionReport, request_id, "OPT STEM Extension report")

@router.delete("/opt-stem-reports/", status_code=204)
def delete_all_opt_stem_reports(db: Session = Depends(get_db)):
    """Delete all OPT STEM Extension reports"""
    return delete_all_requests(db, models.OptStemExtensionReport, "OPT STEM Extension report")

# =============================================================================
# PATHWAY PROGRAMS INTENT TO PROGRESS ROUTES
# =============================================================================

@router.post("/pathway-programs-intent-to-progress/", response_model=schemas.PathwayProgramsIntentToProgress)
def create_pathway_programs_intent_to_progress(request: schemas.PathwayProgramsIntentToProgressCreate, db: Session = Depends(get_db)):
    """Create a new Pathway Programs Intent to Progress request"""
    return create_request_from_schema(
        db=db,
        model_class=models.PathwayProgramsIntentToProgress,
        request_schema=request,
        program_name="Pathway Programs Intent to Progress"
    )

@router.get("/pathway-programs-intent-to-progress/", response_model=List[schemas.PathwayProgramsIntentToProgress])
def get_pathway_programs_intent_to_progress(db: Session = Depends(get_db)):
    """Get all Pathway Programs Intent to Progress requests"""
    return get_requests(db, models.PathwayProgramsIntentToProgress)

@router.get("/pathway-programs-intent-to-progress/{request_id}", response_model=schemas.PathwayProgramsIntentToProgress)
def get_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Pathway Programs Intent to Progress request by ID"""
    return get_request_by_id(db, models.PathwayProgramsIntentToProgress, request_id, "Pathway Programs Intent to Progress request")

@router.delete("/pathway-programs-intent-to-progress/{request_id}", status_code=204)
def delete_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Intent to Progress request"""
    return delete_request_by_id(db, models.PathwayProgramsIntentToProgress, request_id, "Pathway Programs Intent to Progress request")

@router.delete("/pathway-programs-intent-to-progress/", status_code=204)
def delete_all_pathway_programs_intent_to_progress_requests(db: Session = Depends(get_db)):
    """Delete all Pathway Programs Intent to Progress requests"""
    return delete_all_requests(db, models.PathwayProgramsIntentToProgress, "Pathway Programs Intent to Progress request")

# =============================================================================
# PATHWAY PROGRAMS NEXT STEPS ROUTES
# =============================================================================

@router.post("/pathway-programs-next-steps/", response_model=schemas.PathwayProgramsNextSteps)
def create_pathway_programs_next_steps(request: schemas.PathwayProgramsNextStepsCreate, db: Session = Depends(get_db)):
    """Create a new Pathway Programs Next Steps request"""
    return create_request_from_schema(
        db=db,
        model_class=models.PathwayProgramsNextSteps,
        request_schema=request,
        program_name="Pathway Programs Next Steps"
    )

@router.get("/pathway-programs-next-steps/", response_model=List[schemas.PathwayProgramsNextSteps])
def get_pathway_programs_next_steps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Pathway Programs Next Steps requests"""
    return get_requests(db, models.PathwayProgramsNextSteps, skip, limit)

@router.delete("/pathway-programs-next-steps/{request_id}", status_code=204)
def delete_pathway_programs_next_steps_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Next Steps request"""
    return delete_request_by_id(db, models.PathwayProgramsNextSteps, request_id, "Pathway Programs Next Steps request")

@router.delete("/pathway-programs-next-steps/", status_code=204)
def delete_all_pathway_programs_next_steps_requests(db: Session = Depends(get_db)):
    """Delete all Pathway Programs Next Steps requests"""
    return delete_all_requests(db, models.PathwayProgramsNextSteps, "Pathway Programs Next Steps request")

# =============================================================================
# REDUCED COURSE LOAD ROUTES
# =============================================================================

@router.post("/reduced-course-load/", response_model=schemas.ReducedCourseLoadRequest)
def create_reduced_course_load_request(request: schemas.ReducedCourseLoadRequestCreate, db: Session = Depends(get_db)):
    """Create a new Reduced Course Load Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.ReducedCourseLoadRequest,
        request_schema=request,
        program_name="Reduced Course Load Request"
    )

@router.get("/reduced-course-load/", response_model=List[schemas.ReducedCourseLoadRequest])
def get_reduced_course_load_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Reduced Course Load Requests"""
    return get_requests(db, models.ReducedCourseLoadRequest, skip, limit)

@router.delete("/reduced-course-load/{request_id}", status_code=204)
def delete_reduced_course_load_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Reduced Course Load Request"""
    return delete_request_by_id(db, models.ReducedCourseLoadRequest, request_id, "Reduced Course Load Request")

@router.delete("/reduced-course-load/", status_code=204)
def delete_all_reduced_course_load_requests(db: Session = Depends(get_db)):
    """Delete all Reduced Course Load Requests"""
    return delete_all_requests(db, models.ReducedCourseLoadRequest, "Reduced Course Load Request")

# =============================================================================
# GLOBAL TRANSFER OUT ROUTES
# =============================================================================

@router.post("/global-transfer-out/", response_model=schemas.GlobalTransferOutRequest)
def create_global_transfer_out_request(request: schemas.GlobalTransferOutRequestCreate, db: Session = Depends(get_db)):
    """Create a new Global Transfer Out Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.GlobalTransferOutRequest,
        request_schema=request,
        program_name="Global Transfer Out Request"
    )

@router.get("/global-transfer-out/", response_model=List[schemas.GlobalTransferOutRequest])
def get_global_transfer_out_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Global Transfer Out Requests"""
    return get_requests(db, models.GlobalTransferOutRequest, skip, limit)

@router.delete("/global-transfer-out/{request_id}", status_code=204)
def delete_global_transfer_out_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Global Transfer Out Request"""
    return delete_request_by_id(db, models.GlobalTransferOutRequest, request_id, "Global Transfer Out Request")

@router.delete("/global-transfer-out/", status_code=204)
def delete_all_global_transfer_out_requests(db: Session = Depends(get_db)):
    """Delete all Global Transfer Out Requests"""
    return delete_all_requests(db, models.GlobalTransferOutRequest, "Global Transfer Out Request")

# ACADEMIC TRAINING ROUTES
# =============================================================================
@router.post("/academic-training/", response_model=schemas.AcademicTrainingRequest)
async def create_academic_training_request(
    request: Request,
    offer_letter: UploadFile = File(None),
    training_authorization: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Create Academic Training request with file uploads"""
    form_data = await request.form()
    file_fields = {'offer_letter': offer_letter, 'training_authorization': training_authorization}
    
    return await create_request_with_files(
        db=db, model_class=models.AcademicTrainingRequest,
        form_fields=dict(form_data), file_fields=file_fields,
        program_name="Academic Training", upload_dir="uploads/academic_training"
    )

@router.get("/academic-training/", response_model=List[schemas.AcademicTrainingRequest])
def get_academic_training_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Academic Training requests"""
    return get_requests(db, models.AcademicTrainingRequest, skip, limit)

@router.get("/academic-training/{request_id}", response_model=schemas.AcademicTrainingRequest)
def get_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Academic Training request by ID"""
    return get_request_by_id(db, models.AcademicTrainingRequest, request_id, "Academic Training request")

@router.delete("/academic-training/{request_id}", status_code=204)
def delete_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Academic Training request"""
    return delete_request_by_id(db, models.AcademicTrainingRequest, request_id, "Academic Training request")

@router.delete("/academic-training/", status_code=204)
def delete_all_academic_training_requests(db: Session = Depends(get_db)):
    """Delete all Academic Training requests"""
    return delete_all_requests(db, models.AcademicTrainingRequest, "Academic Training request")

# OTP REQUEST ROUTES
# =============================================================================

@router.post("/opt-requests/", response_model=schemas.OPTRequest)
def create_opt_request(request: schemas.OPTRequestCreate, db: Session = Depends(get_db)):
    """Create a new OPT Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.OPTRequest,
        request_schema=request,
        program_name="OPT Request"
    )

@router.get("/opt-requests/", response_model=List[schemas.OPTRequest])
def get_opt_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all OPT Requests"""
    return get_requests(db, models.OPTRequest, skip, limit)

@router.get("/opt-requests/{request_id}", response_model=schemas.OPTRequest)
def get_opt_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific OPT Request by ID"""
    return get_request_by_id(db, models.OPTRequest, request_id, "OPT Request")

@router.delete("/opt-requests/{request_id}", status_code=204)
def delete_opt_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT Request"""
    return delete_request_by_id(db, models.OPTRequest, request_id, "OPT Request")

@router.delete("/opt-requests/", status_code=204)
def delete_all_opt_requests(db: Session = Depends(get_db)):
    """Delete all OPT Requests"""
    return delete_all_requests(db, models.OPTRequest, "OPT Request")

#flORIDA STATUTE 1010.35 ROUTES
# =============================================================================

@router.post("/florida-statute-101035/", response_model=schemas.FloridaStatute101035Request)
def create_florida_statute_101035_request(request: schemas.FloridaStatute101035RequestCreate, db: Session = Depends(get_db)):
    """Create a new Florida Statute 1010.35 Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.FloridaStatute101035Request,
        request_schema=request,
        program_name="Florida Statute 1010.35"
    )

@router.get("/florida-statute-101035/", response_model=List[schemas.FloridaStatute101035Request])
def get_florida_statute_101035_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Florida Statute 1010.35 Requests"""
    return get_requests(db, models.FloridaStatute101035Request, skip, limit)

@router.get("/florida-statute-101035/{request_id}", response_model=schemas.FloridaStatute101035Request)
def get_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Florida Statute 1010.35 Request by ID"""
    return get_request_by_id(db, models.FloridaStatute101035Request, request_id, "Florida Statute 1010.35 request")

@router.delete("/florida-statute-101035/{request_id}", status_code=204)
def delete_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Florida Statute 1010.35 Request"""
    return delete_request_by_id(db, models.FloridaStatute101035Request, request_id, "Florida Statute 1010.35 request")

@router.delete("/florida-statute-101035/", status_code=204)
def delete_all_florida_statute_101035_requests(db: Session = Depends(get_db)):
    """Delete all Florida Statute 1010.35 Requests"""
    return delete_all_requests(db, models.FloridaStatute101035Request, "Florida Statute 1010.35 request")

# LEAVE REQUEST ROUTES
# =============================================================================

@router.post("/leave-requests/", response_model=schemas.LeaveRequest)
def create_leave_request(request: schemas.LeaveRequestCreate, db: Session = Depends(get_db)):
    """Create a new Leave Request"""
    return create_request_from_schema(
        db=db,
        model_class=models.LeaveRequest,
        request_schema=request,
        program_name="Leave Request"
    )
    
# Add this missing route after line 508:
@router.get("/leave-requests/", response_model=List[schemas.LeaveRequest])
def get_leave_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Leave Requests"""
    return get_requests(db, models.LeaveRequest, skip, limit)    

@router.get("/leave-requests/{request_id}", response_model=schemas.LeaveRequest)
def get_leave_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Leave Request by ID"""
    return get_request_by_id(db, models.LeaveRequest, request_id, "Leave Request")

@router.delete("/leave-requests/{request_id}", status_code=204)
def delete_leave_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Leave Request"""
    return delete_request_by_id(db, models.LeaveRequest, request_id, "Leave Request")

@router.delete("/leave-requests/", status_code=204)
def delete_all_leave_requests(db: Session = Depends(get_db)):
    """Delete all Leave Requests"""
    return delete_all_requests(db, models.LeaveRequest, "Leave Request")

 
 # OPT STEM EXTENSION REPORT ROUTES
 # =============================================================================

@router.post("/opt-stem-reports/", response_model=schemas.OptStemExtensionReport)
def create_opt_stem_report(request: schemas.OptStemExtensionReportCreate, db: Session = Depends(get_db)):
    """Create a new OPT STEM Extension Report"""
    return create_request_from_schema(
        db=db,
        model_class=models.OptStemExtensionReport,
        request_schema=request,
        program_name="OPT STEM Extension Report"
    )

@router.get("/opt-stem-reports/", response_model=List[schemas.OptStemExtensionReport])
def get_opt_stem_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all OPT STEM Extension reports"""
    return get_requests(db, models.OptStemExtensionReport, skip, limit)

@router.get("/opt-stem-reports/{request_id}", response_model=schemas.OptStemExtensionReport)
def get_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Get a specific OPT STEM Extension report by ID"""
    return get_request_by_id(db, models.OptStemExtensionReport, request_id, "OPT STEM Extension report")

@router.delete("/opt-stem-reports/{request_id}", status_code=204)
def delete_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT STEM Extension report"""
    return delete_request_by_id(db, models.OptStemExtensionReport, request_id, "OPT STEM Extension report")

@router.delete("/opt-stem-reports/", status_code=204)
def delete_all_opt_stem_reports(db: Session = Depends(get_db)):
    """Delete all OPT STEM Extension reports"""
    return delete_all_requests(db, models.OptStemExtensionReport, "OPT STEM Extension report")

# OPT STEM EXTENSION APPLICATION ROUTES
# =============================================================================

@router.post("/opt-stem-applications/", response_model=schemas.OptStemExtensionApplication)
def create_opt_stem_extension_application(request: schemas.OptStemExtensionApplicationCreate, db: Session = Depends(get_db)):
    """Create a new OPT STEM Extension Application"""
    return create_request_from_schema(
        db=db,
        model_class=models.OptStemExtensionApplication,
        request_schema=request,
        program_name="OPT STEM Extension Application"
    )

@router.get("/opt-stem-applications/", response_model=List[schemas.OptStemExtensionApplication])
def get_opt_stem_extension_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all OPT STEM Extension Applications"""
    return get_requests(db, models.OptStemExtensionApplication, skip, limit)

@router.get("/opt-stem-applications/{request_id}", response_model=schemas.OptStemExtensionApplication)
def get_opt_stem_extension_application(request_id: int, db: Session = Depends(get_db)):
    """Get a specific OPT STEM Extension Application by ID"""
    return get_request_by_id(db, models.OptStemExtensionApplication, request_id, "OPT STEM Extension Application")

@router.delete("/opt-stem-appli cation/{request_id}", status_code=204)
def delete_opt_stem_extension_application(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT STEM Extension Application"""
    return delete_request_by_id(db, models.OptStemExtensionApplication, request_id, "OPT STEM Extension Application")

@router.delete("/opt-stem-applications/", status_code=204)
def delete_all_opt_stem_extension_applications(db: Session = Depends(get_db)):
    """Delete all OPT STEM Extension Applications"""
    return delete_all_requests(db, models.OptStemExtensionApplication, "OPT STEM Extension Application")

#exit form routes
# =============================================================================

@router.post("/exit-forms/", response_model=schemas.ExitForm)
def create_exit_form(request: schemas.ExitFormCreate, db: Session = Depends(get_db)):
    """Create a new Exit Form"""
    return create_request_from_schema(
        db=db,
        model_class=models.ExitForm,
        request_schema=request,
        program_name="Exit Form"
    )

@router.get("/exit-forms/", response_model=List[schemas.ExitForm])
def get_exit_forms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all Exit Forms"""
    return get_requests(db, models.ExitForm, skip, limit)

@router.get("/exit-forms/{request_id}", response_model=schemas.ExitForm)
def get_exit_form(request_id: int, db: Session = Depends(get_db)):
    """Get a specific Exit Form by ID"""
    return get_request_by_id(db, models.ExitForm, request_id, "Exit Form")
    
@router.delete("/exit-forms/{request_id}", status_code=204)
def delete_exit_form(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Exit Form"""
    return delete_request_by_id(db, models.ExitForm, request_id, "Exit Form")

@router.delete("/exit-forms/", status_code=204)
def delete_all_exit_forms(db: Session = Depends(get_db)):
    """Delete all Exit Forms"""
    return delete_all_requests(db, models.ExitForm, "Exit Form")

# PATHWAY PROGRAMS INTENT TO PROGRESS ROUTES