from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import os
import uuid
from pathlib import Path

from app import models, schemas
from app.database import get_db

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

@router.post("/i20-requests/", response_model=schemas.I20Request)
def create_i20_request(request: schemas.I20RequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program", "other_reason"})
        
        # Create the database record
        db_request = models.I20Request(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data,
            other_reason=request.other_reason
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

@router.get("/i20-requests/", response_model=List[schemas.I20Request])
def get_i20_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.I20Request).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} requests with data: {requests[0].form_data if requests else 'No requests'}")
    return requests

@router.get("/i20-requests/{request_id}", response_model=schemas.I20Request)
def get_i20_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.I20Request).filter(models.I20Request.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="I-20 request not found")
    print(f"Returning single request with data: {db_request.form_data}")
    return db_request

@router.delete("/i20-requests/{request_id}", status_code=204)
def delete_i20_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific I-20 request"""
    db_request = db.query(models.I20Request).filter(models.I20Request.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="I-20 request not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted I-20 request ID: {request_id}")
    return {"message": "I-20 request deleted successfully"}

@router.delete("/i20-requests/", status_code=204)
def delete_all_i20_requests(db: Session = Depends(get_db)):
    """Delete all I-20 requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.I20Request).count()
        
        # Delete all records
        db.query(models.I20Request).delete()
        db.commit()
        
        print(f"Deleted {count} I-20 requests")
        return {"message": f"Successfully deleted {count} I-20 requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting I-20 requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting I-20 requests: {str(e)}")

# Helper function to save uploaded files
async def save_upload_file(upload_file: UploadFile, destination_dir: str) -> str:
    """Save an uploaded file and return its path"""
    if not upload_file:
        return None
    
    # Create destination directory if it doesn't exist
    Path(destination_dir).mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(destination_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
    
    print(f"Saved file: {file_path} (original: {upload_file.filename})")
    return file_path

# Academic Training Routes
@router.post("/academic-training/", response_model=schemas.AcademicTrainingRequest)
async def create_academic_training_request(
    # Required fields
    student_name: str = Form(...),
    student_id: str = Form(...),
    program: str = Form(...),
    completion_type: str = Form(...),
    
    # Personal Information
    sevis_id: str = Form(None),
    given_name: str = Form(None),
    family_name: str = Form(None),
    legal_sex: str = Form(None),
    date_of_birth: str = Form(None),
    city_of_birth: str = Form(None),
    country_of_birth: str = Form(None),
    country_of_citizenship: str = Form(None),
    country_of_legal_residence: str = Form(None),
    
    # U.S. Address
    has_us_address: str = Form("true"),
    street_address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    country: str = Form(None),
    
    # Contact Information
    us_telephone: str = Form(None),
    non_us_telephone: str = Form(None),
    
    # Questionnaire
    enrolled_full_time: str = Form(None),
    academic_training_start_date: str = Form(None),
    academic_training_end_date: str = Form(None),
    employed_on_campus: str = Form(None),
    previously_authorized: str = Form(None),
    
    # Statements of Agreement
    understand_pre_completion: str = Form(None),
    understand_post_completion: str = Form(None),
    understand_medical_insurance: str = Form(None),
    understand_employer_specific: str = Form(None),
    understand_consult_advisor: str = Form(None),
    
    # Submission
    comments: str = Form(None),
    certify_information: str = Form(None),
    
    # File uploads
    offer_letter: UploadFile = File(None),
    training_authorization: UploadFile = File(None),
    
    db: Session = Depends(get_db)
):
    try:
        print(f"Received Academic Training request from: {student_name}")
        print(f"Files received - Offer Letter: {offer_letter.filename if offer_letter else 'None'}, Training Auth: {training_authorization.filename if training_authorization else 'None'}")
        
        # Save uploaded files
        offer_letter_path = None
        training_auth_path = None
        
        if offer_letter and offer_letter.filename:
            offer_letter_path = await save_upload_file(offer_letter, "uploads/academic_training/offer_letters")
        
        if training_authorization and training_authorization.filename:
            training_auth_path = await save_upload_file(training_authorization, "uploads/academic_training/training_authorizations")
        
        # Convert string booleans to actual booleans
        has_us_address_bool = has_us_address.lower() == 'true' if has_us_address else True
        enrolled_full_time_bool = enrolled_full_time.lower() == 'true' if enrolled_full_time else False
        employed_on_campus_bool = employed_on_campus.lower() == 'true' if employed_on_campus else False
        previously_authorized_bool = previously_authorized.lower() == 'true' if previously_authorized else False
        understand_pre_bool = understand_pre_completion.lower() == 'true' if understand_pre_completion else False
        understand_post_bool = understand_post_completion.lower() == 'true' if understand_post_completion else False
        understand_med_bool = understand_medical_insurance.lower() == 'true' if understand_medical_insurance else False
        understand_emp_bool = understand_employer_specific.lower() == 'true' if understand_employer_specific else False
        understand_consult_bool = understand_consult_advisor.lower() == 'true' if understand_consult_advisor else False
        certify_bool = certify_information.lower() == 'true' if certify_information else False
        
        # Prepare form data for JSON storage
        form_data = {
            "sevis_id": sevis_id,
            "given_name": given_name,
            "family_name": family_name,
            "legal_sex": legal_sex,
            "date_of_birth": date_of_birth,
            "city_of_birth": city_of_birth,
            "country_of_birth": country_of_birth,
            "country_of_citizenship": country_of_citizenship,
            "country_of_legal_residence": country_of_legal_residence,
            "has_us_address": has_us_address_bool,
            "street_address": street_address,
            "city": city,
            "state": state,
            "country": country,
            "us_telephone": us_telephone,
            "non_us_telephone": non_us_telephone,
            "enrolled_full_time": enrolled_full_time_bool,
            "academic_training_start_date": academic_training_start_date,
            "academic_training_end_date": academic_training_end_date,
            "employed_on_campus": employed_on_campus_bool,
            "previously_authorized": previously_authorized_bool,
            "understand_pre_completion": understand_pre_bool,
            "understand_post_completion": understand_post_bool,
            "understand_medical_insurance": understand_med_bool,
            "understand_employer_specific": understand_emp_bool,
            "understand_consult_advisor": understand_consult_bool,
            "certify_information": certify_bool,
            "offer_letter_path": offer_letter_path,
            "training_authorization_path": training_auth_path
        }
        
        # Create the database record
        db_request = models.AcademicTrainingRequest(
            student_name=student_name,
            student_id=student_id,
            program=program,
            completion_type=completion_type,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data,
            comments=comments
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Academic Training request created with ID: {db_request.id}")
        
        # Return response with file paths
        return db_request
        
    except Exception as e:
        print(f"Error processing Academic Training request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing Academic Training request: {str(e)}")

@router.get("/academic-training/", response_model=List[schemas.AcademicTrainingRequest])
def get_academic_training_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.AcademicTrainingRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} Academic Training requests")
    return requests

@router.get("/academic-training/{request_id}", response_model=schemas.AcademicTrainingRequest)
def get_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.AcademicTrainingRequest).filter(models.AcademicTrainingRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Academic Training request not found")
    print(f"Returning Academic Training request with ID: {request_id}")
    return db_request

@router.delete("/academic-training/{request_id}", status_code=204)
def delete_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Academic Training request"""
    db_request = db.query(models.AcademicTrainingRequest).filter(models.AcademicTrainingRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Academic Training request not found")
    
    # Delete associated files if they exist
    if db_request.form_data:
        offer_letter_path = db_request.form_data.get('offer_letter_path')
        training_auth_path = db_request.form_data.get('training_authorization_path')
        
        if offer_letter_path and os.path.exists(offer_letter_path):
            try:
                os.remove(offer_letter_path)
                print(f"Deleted file: {offer_letter_path}")
            except Exception as e:
                print(f"Error deleting file {offer_letter_path}: {str(e)}")
        
        if training_auth_path and os.path.exists(training_auth_path):
            try:
                os.remove(training_auth_path)
                print(f"Deleted file: {training_auth_path}")
            except Exception as e:
                print(f"Error deleting file {training_auth_path}: {str(e)}")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted Academic Training request ID: {request_id}")
    return {"message": "Academic Training request deleted successfully"}

@router.delete("/academic-training/", status_code=204)
def delete_all_academic_training_requests(db: Session = Depends(get_db)):
    """Delete all Academic Training requests from the database"""
    try:
        # Get all requests to delete associated files
        all_requests = db.query(models.AcademicTrainingRequest).all()
        
        # Delete associated files
        for request in all_requests:
            if request.form_data:
                offer_letter_path = request.form_data.get('offer_letter_path')
                training_auth_path = request.form_data.get('training_authorization_path')
                
                if offer_letter_path and os.path.exists(offer_letter_path):
                    try:
                        os.remove(offer_letter_path)
                    except Exception as e:
                        print(f"Error deleting file {offer_letter_path}: {str(e)}")
                
                if training_auth_path and os.path.exists(training_auth_path):
                    try:
                        os.remove(training_auth_path)
                    except Exception as e:
                        print(f"Error deleting file {training_auth_path}: {str(e)}")
        
        # Count how many records will be deleted
        count = len(all_requests)
        
        # Delete all records
        db.query(models.AcademicTrainingRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Academic Training requests and their files")
        return {"message": f"Successfully deleted {count} Academic Training requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Academic Training requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Academic Training requests: {str(e)}")

# Administrative Record Change Routes
@router.post("/administrative-record/", response_model=schemas.AdministrativeRecordRequest)
def create_administrative_record_request(request: schemas.AdministrativeRecordRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received Administrative Record request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.AdministrativeRecordRequest(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Administrative Record request created with ID: {db_request.id}")
        return db_request
    except Exception as e:
        print(f"Error processing Administrative Record request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing Administrative Record request: {str(e)}")

@router.get("/administrative-record/", response_model=List[schemas.AdministrativeRecordRequest])
def get_administrative_record_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.AdministrativeRecordRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} Administrative Record requests")
    return requests

@router.get("/administrative-record/{request_id}", response_model=schemas.AdministrativeRecordRequest)
def get_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.AdministrativeRecordRequest).filter(models.AdministrativeRecordRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Administrative Record request not found")
    print(f"Returning Administrative Record request with ID: {request_id}")
    return db_request

@router.delete("/administrative-record/{request_id}", status_code=204)
def delete_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Administrative Record request"""
    db_request = db.query(models.AdministrativeRecordRequest).filter(models.AdministrativeRecordRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Administrative Record request not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted Administrative Record request ID: {request_id}")
    return {"message": "Administrative Record request deleted successfully"}

@router.delete("/administrative-record/", status_code=204)
def delete_all_administrative_record_requests(db: Session = Depends(get_db)):
    """Delete all Administrative Record requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.AdministrativeRecordRequest).count()
        
        # Delete all records
        db.query(models.AdministrativeRecordRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Administrative Record requests")
        return {"message": f"Successfully deleted {count} Administrative Record requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Administrative Record requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Administrative Record requests: {str(e)}")

# Conversation Partner Routes
@router.post("/conversation-partner/", response_model=schemas.ConversationPartnerRequest)
def create_conversation_partner_request(request: schemas.ConversationPartnerRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received Conversation Partner request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.ConversationPartnerRequest(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Conversation Partner request created with ID: {db_request.id}")
        return db_request
    except Exception as e:
        print(f"Error processing Conversation Partner request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing Conversation Partner request: {str(e)}")

@router.get("/conversation-partner/", response_model=List[schemas.ConversationPartnerRequest])
def get_conversation_partner_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.ConversationPartnerRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} Conversation Partner requests")
    return requests

@router.get("/conversation-partner/{request_id}", response_model=schemas.ConversationPartnerRequest)
def get_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.ConversationPartnerRequest).filter(models.ConversationPartnerRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Conversation Partner request not found")
    print(f"Returning Conversation Partner request with ID: {request_id}")
    return db_request

@router.delete("/conversation-partner/{request_id}", status_code=204)
def delete_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Conversation Partner request"""
    db_request = db.query(models.ConversationPartnerRequest).filter(models.ConversationPartnerRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Conversation Partner request not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted Conversation Partner request ID: {request_id}")
    return {"message": "Conversation Partner request deleted successfully"}

@router.delete("/conversation-partner/", status_code=204)
def delete_all_conversation_partner_requests(db: Session = Depends(get_db)):
    """Delete all Conversation Partner requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.ConversationPartnerRequest).count()
        
        # Delete all records
        db.query(models.ConversationPartnerRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Conversation Partner requests")
        return {"message": f"Successfully deleted {count} Conversation Partner requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Conversation Partner requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Conversation Partner requests: {str(e)}")

# OPT Request endpoints
@router.post("/opt-requests/", response_model=schemas.OPTRequest)
async def create_opt_request(
    ucf_id: str = Form(...),
    given_name: str = Form(...),
    family_name: str = Form(...),
    date_of_birth: str = Form(...),
    legal_sex: str = Form(...),
    country_of_citizenship: str = Form(...),
    academic_level: str = Form(...),
    academic_program: str = Form(...),
    address: str = Form(...),
    address2: str = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    postal_code: str = Form(...),
    ucf_email_address: str = Form(...),
    secondary_email_address: str = Form(None),
    telephone_number: str = Form(...),
    information_correct: bool = Form(...),
    full_time_student: str = Form(None),
    intent_to_graduate: str = Form(None),
    semester_of_graduation: str = Form(None),
    desired_opt_start_date: str = Form(None),
    desired_opt_end_date: str = Form(None),
    currently_employed_on_campus: str = Form(None),
    previous_opt_authorization: str = Form(None),
    photo2x2: UploadFile = File(None),
    passport_biographical: UploadFile = File(None),
    f1_visa_or_uscis_notice: UploadFile = File(None),
    i94: UploadFile = File(None),
    form_i765: UploadFile = File(None),
    form_g1145: UploadFile = File(None),
    previous_i20s: UploadFile = File(None),
    previous_ead: UploadFile = File(None),
    opt_workshop_completed: bool = Form(...),
    opt_request_timeline: bool = Form(...),
    ead_card_copy: bool = Form(...),
    report_changes: bool = Form(...),
    unemployment_limit: bool = Form(...),
    employment_start_date: bool = Form(...),
    db: Session = Depends(get_db)
):
    """Create a new OPT Request with file uploads"""
    try:
        print("Creating OPT Request...")
        
        # Create student name from given and family name
        student_name = f"{given_name} {family_name}".strip()
        
        # Create form data dictionary
        form_data = {
            "ucf_id": ucf_id,
            "given_name": given_name,
            "family_name": family_name,
            "date_of_birth": date_of_birth,
            "legal_sex": legal_sex,
            "country_of_citizenship": country_of_citizenship,
            "academic_level": academic_level,
            "academic_program": academic_program,
            "address": address,
            "address2": address2,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "ucf_email_address": ucf_email_address,
            "secondary_email_address": secondary_email_address,
            "telephone_number": telephone_number,
            "information_correct": information_correct,
            "full_time_student": full_time_student,
            "intent_to_graduate": intent_to_graduate,
            "semester_of_graduation": semester_of_graduation,
            "desired_opt_start_date": desired_opt_start_date,
            "desired_opt_end_date": desired_opt_end_date,
            "currently_employed_on_campus": currently_employed_on_campus,
            "previous_opt_authorization": previous_opt_authorization,
            "opt_workshop_completed": opt_workshop_completed,
            "opt_request_timeline": opt_request_timeline,
            "ead_card_copy": ead_card_copy,
            "report_changes": report_changes,
            "unemployment_limit": unemployment_limit,
            "employment_start_date": employment_start_date
        }
        
        # Handle file uploads
        upload_dir = "uploads/opt_requests"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_fields = {
            "photo2x2": photo2x2,
            "passport_biographical": passport_biographical,
            "f1_visa_or_uscis_notice": f1_visa_or_uscis_notice,
            "i94": i94,
            "form_i765": form_i765,
            "form_g1145": form_g1145,
            "previous_i20s": previous_i20s,
            "previous_ead": previous_ead
        }
        
        for field_name, file in file_fields.items():
            if file and file.filename:
                file_path = await save_upload_file(file, upload_dir)
                form_data[field_name] = file_path
                print(f"Saved {field_name}: {file_path}")
        
        # Create database record
        db_request = models.OPTRequest(
            student_name=student_name,
            student_id=ucf_id,
            program="OPT Request",
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created OPT Request with ID: {db_request.id}")
        return db_request
        
    except Exception as e:
        db.rollback()
        print(f"Error creating OPT Request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing OPT Request: {str(e)}")

@router.get("/opt-requests/", response_model=List[schemas.OPTRequest])
def get_opt_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.OPTRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} OPT requests")
    return requests

@router.get("/opt-requests/{request_id}", response_model=schemas.OPTRequest)
def get_opt_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.OPTRequest).filter(models.OPTRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="OPT request not found")
    print(f"Returning OPT request with ID: {request_id}")
    return db_request

@router.delete("/opt-requests/{request_id}", status_code=204)
def delete_opt_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT request"""
    db_request = db.query(models.OPTRequest).filter(models.OPTRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="OPT request not found")
    
    # Delete associated files
    if db_request.form_data:
        upload_dir = "uploads/opt_requests"
        file_fields = ["photo2x2", "passport_biographical", "f1_visa_or_uscis_notice", "i94", 
                      "form_i765", "form_g1145", "previous_i20s", "previous_ead"]
        
        for field in file_fields:
            file_path = db_request.form_data.get(field)
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"Deleted file: {file_path}")
                except Exception as e:
                    print(f"Error deleting file {file_path}: {str(e)}")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted OPT request ID: {request_id}")
    return {"message": "OPT request deleted successfully"}

@router.delete("/opt-requests/", status_code=204)
def delete_all_opt_requests(db: Session = Depends(get_db)):
    """Delete all OPT requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.OPTRequest).count()
        
        # Delete all records
        db.query(models.OPTRequest).delete()
        db.commit()
        
        print(f"Deleted {count} OPT requests")
        return {"message": f"Successfully deleted {count} OPT requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting OPT requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting OPT requests: {str(e)}")

# Document Request endpoints
@router.post("/document-requests/", response_model=schemas.DocumentRequest)
def create_document_request(request: schemas.DocumentRequestCreate, db: Session = Depends(get_db)):
    """Create a new Document Request"""
    try:
        print(f"Received Document Request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.DocumentRequest(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Document Request created with ID: {db_request.id}")
        return db_request
    except Exception as e:
        print(f"Error processing Document Request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing Document Request: {str(e)}")

@router.get("/document-requests/", response_model=List[schemas.DocumentRequest])
def get_document_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.DocumentRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} Document requests")
    return requests

@router.get("/document-requests/{request_id}", response_model=schemas.DocumentRequest)
def get_document_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.DocumentRequest).filter(models.DocumentRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Document request not found")
    print(f"Returning Document request with ID: {request_id}")
    return db_request

@router.delete("/document-requests/{request_id}", status_code=204)
def delete_document_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Document request"""
    db_request = db.query(models.DocumentRequest).filter(models.DocumentRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Document request not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted Document request ID: {request_id}")
    return {"message": "Document request deleted successfully"}

@router.delete("/document-requests/", status_code=204)
def delete_all_document_requests(db: Session = Depends(get_db)):
    """Delete all Document requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.DocumentRequest).count()
        
        # Delete all records
        db.query(models.DocumentRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Document requests")
        return {"message": f"Successfully deleted {count} Document requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Document requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Document requests: {str(e)}")

# English Language Volunteer Request endpoints
@router.post("/english-language-volunteer/", response_model=schemas.EnglishLanguageVolunteerRequest)
def create_english_language_volunteer_request(request: schemas.EnglishLanguageVolunteerRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received English Language Volunteer request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.EnglishLanguageVolunteerRequest(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created English Language Volunteer request with ID: {db_request.id}")
        return db_request
    except Exception as e:
        db.rollback()
        print(f"Error creating English Language Volunteer request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/english-language-volunteer/", response_model=List[schemas.EnglishLanguageVolunteerRequest])
def get_english_language_volunteer_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.EnglishLanguageVolunteerRequest).all()
        print(f"Retrieved {len(requests)} English Language Volunteer requests")
        return requests
    except Exception as e:
        print(f"Error retrieving English Language Volunteer requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/english-language-volunteer/{request_id}", response_model=schemas.EnglishLanguageVolunteerRequest)
def get_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.EnglishLanguageVolunteerRequest).filter(models.EnglishLanguageVolunteerRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving English Language Volunteer request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/english-language-volunteer/{request_id}")
def delete_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.EnglishLanguageVolunteerRequest).filter(models.EnglishLanguageVolunteerRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted English Language Volunteer request {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting English Language Volunteer request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting request: {str(e)}")

@router.delete("/english-language-volunteer/")
def delete_all_english_language_volunteer_requests(db: Session = Depends(get_db)):
    try:
        count = db.query(models.EnglishLanguageVolunteerRequest).count()
        
        # Delete all records
        db.query(models.EnglishLanguageVolunteerRequest).delete()
        db.commit()
        
        print(f"Deleted {count} English Language Volunteer requests")
        return {"message": f"Successfully deleted {count} English Language Volunteer requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting English Language Volunteer requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting English Language Volunteer requests: {str(e)}")

# Off Campus Housing Request endpoints
@router.post("/off-campus-housing/", response_model=schemas.OffCampusHousingRequest)
def create_off_campus_housing_request(request: schemas.OffCampusHousingRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received Off Campus Housing request: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.OffCampusHousingRequest(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created Off Campus Housing request with ID: {db_request.id}")
        return db_request
    except Exception as e:
        db.rollback()
        print(f"Error creating Off Campus Housing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/off-campus-housing/", response_model=List[schemas.OffCampusHousingRequest])
def get_off_campus_housing_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.OffCampusHousingRequest).all()
        print(f"Retrieved {len(requests)} Off Campus Housing requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Off Campus Housing requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/off-campus-housing/{request_id}", response_model=schemas.OffCampusHousingRequest)
def get_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OffCampusHousingRequest).filter(models.OffCampusHousingRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Off Campus Housing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/off-campus-housing/{request_id}")
def delete_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OffCampusHousingRequest).filter(models.OffCampusHousingRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted Off Campus Housing request {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Off Campus Housing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting request: {str(e)}")

@router.delete("/off-campus-housing/")
def delete_all_off_campus_housing_requests(db: Session = Depends(get_db)):
    try:
        count = db.query(models.OffCampusHousingRequest).count()
        
        # Delete all records
        db.query(models.OffCampusHousingRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Off Campus Housing requests")
        return {"message": f"Successfully deleted {count} Off Campus Housing requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Off Campus Housing requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Off Campus Housing requests: {str(e)}")

# Florida Statute 1010.35 Routes
@router.post("/florida-statute-101035/", response_model=schemas.FloridaStatute101035Request)
async def create_florida_statute_101035_request(
    ucf_id: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    date_of_birth: str = Form(...),
    telephone_number: str = Form(...),
    email_address: str = Form(...),
    sevis_number: str = Form(None),
    college: str = Form(...),
    department: str = Form(...),
    position: str = Form(...),
    has_passport: str = Form(...),
    has_ds160: str = Form(...),
    passport_document: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Handle file upload if provided
        passport_document_path = None
        if passport_document and passport_document.filename:
            passport_document_path = await save_upload_file(passport_document, "uploads/florida_statute_101035")
        
        # Create student name and ID
        student_name = f"{first_name} {last_name}"
        student_id = ucf_id
        
        # Prepare form data
        form_data = {
            "ucf_id": ucf_id,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth,
            "telephone_number": telephone_number,
            "email_address": email_address,
            "sevis_number": sevis_number,
            "college": college,
            "department": department,
            "position": position,
            "has_passport": has_passport,
            "has_ds160": has_ds160,
            "passport_document_path": passport_document_path
        }
        
        # Create database record
        db_request = models.FloridaStatute101035Request(
            student_name=student_name,
            student_id=student_id,
            program="Florida Statute 1010.35",
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created Florida Statute 1010.35 request for {student_name} (ID: {db_request.id})")
        return db_request
        
    except Exception as e:
        db.rollback()
        print(f"Error creating Florida Statute 1010.35 request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/florida-statute-101035/", response_model=List[schemas.FloridaStatute101035Request])
def get_florida_statute_101035_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.FloridaStatute101035Request).all()
        print(f"Retrieved {len(requests)} Florida Statute 1010.35 requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Florida Statute 1010.35 requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/florida-statute-101035/{request_id}", response_model=schemas.FloridaStatute101035Request)
def get_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.FloridaStatute101035Request).filter(models.FloridaStatute101035Request.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        print(f"Retrieved Florida Statute 1010.35 request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Florida Statute 1010.35 request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/florida-statute-101035/{request_id}")
def delete_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.FloridaStatute101035Request).filter(models.FloridaStatute101035Request.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        # Clean up uploaded files if they exist
        if request.form_data and request.form_data.get("passport_document_path"):
            passport_path = request.form_data["passport_document_path"]
            if os.path.exists(passport_path):
                try:
                    os.remove(passport_path)
                    print(f"Deleted file: {passport_path}")
                except Exception as e:
                    print(f"Error deleting file {passport_path}: {str(e)}")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted Florida Statute 1010.35 request {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Florida Statute 1010.35 request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting request: {str(e)}")

@router.delete("/florida-statute-101035/")
def delete_all_florida_statute_101035_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.FloridaStatute101035Request).all()
        count = len(requests)
        
        # Clean up uploaded files
        for request in requests:
            if request.form_data and request.form_data.get("passport_document_path"):
                passport_path = request.form_data["passport_document_path"]
                if os.path.exists(passport_path):
                    try:
                        os.remove(passport_path)
                        print(f"Deleted file: {passport_path}")
                    except Exception as e:
                        print(f"Error deleting file {passport_path}: {str(e)}")
        
        # Delete all records
        db.query(models.FloridaStatute101035Request).delete()
        db.commit()
        
        print(f"Deleted {count} Florida Statute 1010.35 requests")
        return {"message": f"Successfully deleted {count} Florida Statute 1010.35 requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Florida Statute 1010.35 requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Florida Statute 1010.35 requests: {str(e)}")

# Leave Request Routes
@router.post("/leave-requests/", response_model=schemas.LeaveRequest)
async def create_leave_request(
    employee_id: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    leave_type: str = Form(...),
    from_date: str = Form(...),
    from_time: str = Form(...),
    to_date: str = Form(...),
    to_time: str = Form(...),
    hours_requested: str = Form(...),
    reason: str = Form(...),
    course_name: str = Form(None),
    documentation: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Handle file upload if provided
        documentation_path = None
        if documentation and documentation.filename:
            documentation_path = await save_upload_file(documentation, "uploads/leave_requests")
        
        # Create student name and ID
        student_name = f"{first_name} {last_name}"
        student_id = employee_id
        
        # Prepare form data
        form_data = {
            "employee_id": employee_id,
            "first_name": first_name,
            "last_name": last_name,
            "leave_type": leave_type,
            "from_date": from_date,
            "from_time": from_time,
            "to_date": to_date,
            "to_time": to_time,
            "hours_requested": hours_requested,
            "reason": reason,
            "course_name": course_name,
            "documentation_path": documentation_path
        }
        
        # Create database record
        db_request = models.LeaveRequest(
            student_name=student_name,
            student_id=student_id,
            program="Leave Request",
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created Leave Request for {student_name} (ID: {db_request.id})")
        return db_request
        
    except Exception as e:
        db.rollback()
        print(f"Error creating Leave Request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/leave-requests/", response_model=List[schemas.LeaveRequest])
def get_leave_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.LeaveRequest).all()
        print(f"Retrieved {len(requests)} Leave requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Leave requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/leave-requests/{request_id}", response_model=schemas.LeaveRequest)
def get_leave_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        print(f"Retrieved Leave request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Leave request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/leave-requests/{request_id}")
def delete_leave_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        
        # Clean up uploaded files if they exist
        if request.form_data and request.form_data.get("documentation_path"):
            documentation_path = request.form_data["documentation_path"]
            if os.path.exists(documentation_path):
                try:
                    os.remove(documentation_path)
                    print(f"Deleted file: {documentation_path}")
                except Exception as e:
                    print(f"Error deleting file {documentation_path}: {str(e)}")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted Leave request {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Leave request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting request: {str(e)}")

@router.delete("/leave-requests/")
def delete_all_leave_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.LeaveRequest).all()
        count = len(requests)
        
        # Clean up uploaded files
        for request in requests:
            if request.form_data and request.form_data.get("documentation_path"):
                documentation_path = request.form_data["documentation_path"]
                if os.path.exists(documentation_path):
                    try:
                        os.remove(documentation_path)
                        print(f"Deleted file: {documentation_path}")
                    except Exception as e:
                        print(f"Error deleting file {documentation_path}: {str(e)}")
        
        # Delete all records
        db.query(models.LeaveRequest).delete()
        db.commit()
        
        print(f"Deleted {count} Leave requests")
        return {"message": f"Successfully deleted {count} Leave requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Leave requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Leave requests: {str(e)}")

# OPT STEM Extension Reporting Routes
@router.post("/opt-stem-reports/", response_model=schemas.OptStemExtensionReport)
def create_opt_stem_report(request: schemas.OptStemExtensionReportCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received OPT STEM Extension Report: {request}")
        
        # Convert the request model to a dict for JSON storage
        form_data = request.dict(exclude={"student_name", "student_id", "program"})
        
        # Create the database record
        db_request = models.OptStemExtensionReport(
            student_name=request.student_name,
            student_id=request.student_id,
            program=request.program,
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created OPT STEM Extension Report with ID: {db_request.id}")
        return db_request
    except Exception as e:
        print(f"Error processing OPT STEM Extension Report: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error processing report: {str(e)}")

@router.get("/opt-stem-reports/", response_model=List[schemas.OptStemExtensionReport])
def get_opt_stem_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.OptStemExtensionReport).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} OPT STEM Extension reports")
    return requests

@router.get("/opt-stem-reports/{request_id}", response_model=schemas.OptStemExtensionReport)
def get_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.OptStemExtensionReport).filter(models.OptStemExtensionReport.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="OPT STEM Extension report not found")
    print(f"Returning OPT STEM Extension report with ID: {request_id}")
    return db_request

@router.delete("/opt-stem-reports/{request_id}", status_code=204)
def delete_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT STEM Extension report"""
    db_request = db.query(models.OptStemExtensionReport).filter(models.OptStemExtensionReport.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="OPT STEM Extension report not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted OPT STEM Extension report ID: {request_id}")
    return {"message": "OPT STEM Extension report deleted successfully"}

@router.delete("/opt-stem-reports/", status_code=204)
def delete_all_opt_stem_reports(db: Session = Depends(get_db)):
    """Delete all OPT STEM Extension reports from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.OptStemExtensionReport).count()
        
        # Delete all records
        db.query(models.OptStemExtensionReport).delete()
        db.commit()
        
        print(f"Deleted {count} OPT STEM Extension reports")
        return {"message": f"Successfully deleted {count} OPT STEM Extension reports"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting OPT STEM Extension reports: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting OPT STEM Extension reports: {str(e)}")

# OPT STEM Extension Application Routes
@router.post("/opt-stem-applications/", response_model=schemas.OptStemExtensionApplication)
async def create_opt_stem_application(
    ucf_id: str = Form(...),
    given_name: str = Form(...),
    family_name: str = Form(...),
    date_of_birth: str = Form(None),
    gender: str = Form(None),
    country_of_citizenship: str = Form(None),
    academic_level: str = Form(None),
    academic_program: str = Form(None),
    address: str = Form(None),
    address_2: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal_code: str = Form(None),
    ucf_email_address: str = Form(None),
    secondary_email_address: str = Form(None),
    telephone_number: str = Form(None),
    job_title: str = Form(None),
    employer_name: str = Form(None),
    employer_ein: str = Form(None),
    employment_street_address: str = Form(None),
    employment_city: str = Form(None),
    employment_state: str = Form(None),
    employment_postal_code: str = Form(None),
    supervisor_first_name: str = Form(None),
    supervisor_last_name: str = Form(None),
    supervisor_email: str = Form(None),
    supervisor_telephone: str = Form(None),
    hours_per_week: str = Form(None),
    is_paid_position: str = Form(None),
    is_staffing_firm: str = Form(None),
    has_e_verify: str = Form(None),
    based_on_previous_stem_degree: str = Form(None),
    completed_stem_workshop: str = Form(None),
    provide_ead_copy: str = Form(None),
    understand_unemployment_limits: str = Form(None),
    notify_changes: str = Form(None),
    submit_updated_i983: str = Form(None),
    comply_reporting_requirements: str = Form(None),
    reviewed_photo_requirements: str = Form(None),
    reviewed_fee_payment: str = Form(None),
    # File uploads (all optional)
    photo_2x2: UploadFile = File(None),
    form_i983: UploadFile = File(None),
    passport: UploadFile = File(None),
    f1_visa: UploadFile = File(None),
    i94: UploadFile = File(None),
    ead_card: UploadFile = File(None),
    form_i765: UploadFile = File(None),
    form_g1145: UploadFile = File(None),
    diploma: UploadFile = File(None),
    transcripts: UploadFile = File(None),
    previous_i20s: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Handle file uploads (all optional)
        file_fields = {
            'photo_2x2': photo_2x2,
            'form_i983': form_i983,
            'passport': passport,
            'f1_visa': f1_visa,
            'i94': i94,
            'ead_card': ead_card,
            'form_i765': form_i765,
            'form_g1145': form_g1145,
            'diploma': diploma,
            'transcripts': transcripts,
            'previous_i20s': previous_i20s
        }
        
        upload_dir = "uploads/opt_stem_applications"
        form_data = {}
        
        # Save uploaded files
        for field_name, file in file_fields.items():
            if file and file.filename:
                file_path = await save_upload_file(file, upload_dir)
                form_data[field_name + '_path'] = file_path
                print(f"Saved {field_name}: {file_path}")
        
        # Convert string booleans to actual booleans
        def str_to_bool(value):
            if value is None:
                return None
            return value.lower() in ['true', 'yes', '1', 'on']
        
        # Create student name and ID
        student_name = f"{given_name} {family_name}"
        student_id = ucf_id
        
        # Prepare form data
        form_data.update({
            "ucf_id": ucf_id,
            "given_name": given_name,
            "family_name": family_name,
            "date_of_birth": date_of_birth,
            "gender": gender,
            "country_of_citizenship": country_of_citizenship,
            "academic_level": academic_level,
            "academic_program": academic_program,
            "address": address,
            "address_2": address_2,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "ucf_email_address": ucf_email_address,
            "secondary_email_address": secondary_email_address,
            "telephone_number": telephone_number,
            "job_title": job_title,
            "employer_name": employer_name,
            "employer_ein": employer_ein,
            "employment_street_address": employment_street_address,
            "employment_city": employment_city,
            "employment_state": employment_state,
            "employment_postal_code": employment_postal_code,
            "supervisor_first_name": supervisor_first_name,
            "supervisor_last_name": supervisor_last_name,
            "supervisor_email": supervisor_email,
            "supervisor_telephone": supervisor_telephone,
            "hours_per_week": hours_per_week,
            "is_paid_position": str_to_bool(is_paid_position),
            "is_staffing_firm": str_to_bool(is_staffing_firm),
            "has_e_verify": str_to_bool(has_e_verify),
            "based_on_previous_stem_degree": str_to_bool(based_on_previous_stem_degree),
            "completed_stem_workshop": str_to_bool(completed_stem_workshop),
            "provide_ead_copy": str_to_bool(provide_ead_copy),
            "understand_unemployment_limits": str_to_bool(understand_unemployment_limits),
            "notify_changes": str_to_bool(notify_changes),
            "submit_updated_i983": str_to_bool(submit_updated_i983),
            "comply_reporting_requirements": str_to_bool(comply_reporting_requirements),
            "reviewed_photo_requirements": str_to_bool(reviewed_photo_requirements),
            "reviewed_fee_payment": str_to_bool(reviewed_fee_payment)
        })
        
        # Create database record
        db_request = models.OptStemExtensionApplication(
            student_name=student_name,
            student_id=student_id,
            program="OPT STEM Extension Application",
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created OPT STEM Extension Application for {student_name} (ID: {db_request.id})")
        return db_request
        
    except Exception as e:
        db.rollback()
        print(f"Error creating OPT STEM Extension Application: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating application: {str(e)}")

@router.get("/opt-stem-applications/", response_model=List[schemas.OptStemExtensionApplication])
def get_opt_stem_applications(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.OptStemExtensionApplication).all()
        print(f"Retrieved {len(requests)} OPT STEM Extension applications")
        return requests
    except Exception as e:
        print(f"Error retrieving OPT STEM Extension applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving applications: {str(e)}")

@router.get("/opt-stem-applications/{request_id}", response_model=schemas.OptStemExtensionApplication)
def get_opt_stem_application(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OptStemExtensionApplication).filter(models.OptStemExtensionApplication.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Application not found")
        
        print(f"Retrieved OPT STEM Extension application {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving OPT STEM Extension application: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving application: {str(e)}")

@router.delete("/opt-stem-applications/{request_id}")
def delete_opt_stem_application(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OptStemExtensionApplication).filter(models.OptStemExtensionApplication.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Clean up uploaded files if they exist
        if request.form_data:
            file_fields = ['photo_2x2_path', 'form_i983_path', 'passport_path', 'f1_visa_path', 
                          'i94_path', 'ead_card_path', 'form_i765_path', 'form_g1145_path', 
                          'diploma_path', 'transcripts_path', 'previous_i20s_path']
            
            for field in file_fields:
                if request.form_data.get(field):
                    file_path = request.form_data[field]
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                            print(f"Deleted file: {file_path}")
                        except Exception as e:
                            print(f"Error deleting file {file_path}: {str(e)}")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted OPT STEM Extension application {request_id}")
        return {"message": "Application deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting OPT STEM Extension application: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting application: {str(e)}")

@router.delete("/opt-stem-applications/")
def delete_all_opt_stem_applications(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.OptStemExtensionApplication).all()
        count = len(requests)
        
        # Clean up uploaded files
        for request in requests:
            if request.form_data:
                file_fields = ['photo_2x2_path', 'form_i983_path', 'passport_path', 'f1_visa_path', 
                              'i94_path', 'ead_card_path', 'form_i765_path', 'form_g1145_path', 
                              'diploma_path', 'transcripts_path', 'previous_i20s_path']
                
                for field in file_fields:
                    if request.form_data.get(field):
                        file_path = request.form_data[field]
                        if os.path.exists(file_path):
                            try:
                                os.remove(file_path)
                                print(f"Deleted file: {file_path}")
                            except Exception as e:
                                print(f"Error deleting file {file_path}: {str(e)}")
        
        # Delete all records
        db.query(models.OptStemExtensionApplication).delete()
        db.commit()
        
        print(f"Deleted {count} OPT STEM Extension applications")
        return {"message": f"Successfully deleted {count} OPT STEM Extension applications"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting OPT STEM Extension applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting OPT STEM Extension applications: {str(e)}")

# Exit Form Routes
@router.post("/exit-forms/", response_model=schemas.ExitForm)
async def create_exit_form(
    ucf_id: str = Form(...),
    sevis_id: str = Form(None),
    visa_type: str = Form(None),
    given_name: str = Form(...),
    family_name: str = Form(...),
    us_street_address: str = Form(None),
    apartment_number: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal_code: str = Form(None),
    foreign_street_address: str = Form(None),
    foreign_city: str = Form(None),
    foreign_postal_code: str = Form(None),
    country: str = Form(None),
    ucf_email: str = Form(...),
    secondary_email: str = Form(None),
    us_telephone: str = Form(None),
    foreign_telephone: str = Form(None),
    education_level: str = Form(None),
    employed_on_campus: str = Form(None),
    departure_date: str = Form(None),
    flight_itinerary: UploadFile = File(None),
    departure_reason: str = Form(None),
    work_authorization_acknowledgment: str = Form(None),
    cpt_opt_acknowledgment: str = Form(None),
    financial_obligations_acknowledgment: str = Form(None),
    remarks: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Log all received form data for debugging
        print("Received Exit Form Data:")
        print(f"UCF ID: {ucf_id}")
        print(f"Given Name: {given_name}")
        print(f"Family Name: {family_name}")
        print(f"UCF Email: {ucf_email}")
        print(f"Sevis ID: {sevis_id}")
        print(f"Visa Type: {visa_type}")
        print(f"Street Address: {us_street_address}")
        print(f"City: {city}")
        print(f"State: {state}")
        print(f"Postal Code: {postal_code}")
        print(f"Foreign Street Address: {foreign_street_address}")
        print(f"Foreign City: {foreign_city}")
        print(f"Country: {country}")
        print(f"Secondary Email: {secondary_email}")
        print(f"US Telephone: {us_telephone}")
        print(f"Foreign Telephone: {foreign_telephone}")
        print(f"Education Level: {education_level}")
        print(f"Employed on Campus: {employed_on_campus}")
        print(f"Departure Date: {departure_date}")
        print(f"Departure Reason: {departure_reason}")
        print(f"Work Authorization Acknowledgment: {work_authorization_acknowledgment}")
        print(f"CPT OPT Acknowledgment: {cpt_opt_acknowledgment}")
        print(f"Financial Obligations Acknowledgment: {financial_obligations_acknowledgment}")
        print(f"Remarks: {remarks}")
        print(f"Flight Itinerary Filename: {flight_itinerary.filename if flight_itinerary else 'None'}")

        # Handle file upload if provided
        flight_itinerary_path = None
        if flight_itinerary and flight_itinerary.filename:
            flight_itinerary_path = await save_upload_file(flight_itinerary, "uploads/exit_forms")
        
        # Create student name and ID
        student_name = f"{given_name} {family_name}"
        student_id = ucf_id
        
        # Convert string booleans to actual booleans
        def str_to_bool(value):
            if value is None:
                return None
            return value.lower() in ['true', 'yes', '1', 'on']
        
        # Prepare form data
        form_data = {
            "ucf_id": ucf_id,
            "sevis_id": sevis_id,
            "visa_type": visa_type,
            "given_name": given_name,
            "family_name": family_name,
            "us_street_address": us_street_address,
            "apartment_number": apartment_number,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "foreign_street_address": foreign_street_address,
            "foreign_city": foreign_city,
            "foreign_postal_code": foreign_postal_code,
            "country": country,
            "ucf_email": ucf_email,
            "secondary_email": secondary_email,
            "us_telephone": us_telephone,
            "foreign_telephone": foreign_telephone,
            "education_level": education_level,
            "employed_on_campus": employed_on_campus,
            "departure_date": departure_date,
            "flight_itinerary_path": flight_itinerary_path,
            "departure_reason": departure_reason,
            "work_authorization_acknowledgment": str_to_bool(work_authorization_acknowledgment),
            "cpt_opt_acknowledgment": str_to_bool(cpt_opt_acknowledgment),
            "financial_obligations_acknowledgment": str_to_bool(financial_obligations_acknowledgment),
            "remarks": remarks
        }
        
        # Create database record
        db_request = models.ExitForm(
            student_name=student_name,
            student_id=student_id,
            program="Exit Form",
            submission_date=datetime.now(),
            status="pending",
            form_data=form_data
        )
        
        # Explicitly set required fields in form_data
        if not form_data.get('ucf_id'):
            form_data['ucf_id'] = ucf_id
        if not form_data.get('given_name'):
            form_data['given_name'] = given_name
        if not form_data.get('family_name'):
            form_data['family_name'] = family_name
        if not form_data.get('ucf_email'):
            form_data['ucf_email'] = ucf_email
        
        # Update the form_data in the database record
        db_request.form_data = form_data
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        print(f"Created Exit Form for {student_name} (ID: {db_request.id})")
        return db_request
        
    except Exception as e:
        db.rollback()
        print(f"Error creating Exit Form: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/exit-forms/", response_model=List[schemas.ExitForm])
def get_exit_forms(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.ExitForm).all()
        print(f"Retrieved {len(requests)} Exit Forms")
        return requests
    except Exception as e:
        print(f"Error retrieving Exit Forms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/exit-forms/{request_id}", response_model=schemas.ExitForm)
def get_exit_form(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.ExitForm).filter(models.ExitForm.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Exit Form not found")
        
        print(f"Retrieved Exit Form {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Exit Form: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/exit-forms/{request_id}")
def delete_exit_form(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.ExitForm).filter(models.ExitForm.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Exit Form not found")
        
        # Clean up uploaded files if they exist
        if request.form_data and request.form_data.get("flight_itinerary_path"):
            flight_itinerary_path = request.form_data["flight_itinerary_path"]
            if os.path.exists(flight_itinerary_path):
                try:
                    os.remove(flight_itinerary_path)
                    print(f"Deleted file: {flight_itinerary_path}")
                except Exception as e:
                    print(f"Error deleting file {flight_itinerary_path}: {str(e)}")
        
        db.delete(request)
        db.commit()
        
        print(f"Deleted Exit Form {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Exit Form: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting request: {str(e)}")

@router.delete("/exit-forms/")
def delete_all_exit_forms(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.ExitForm).all()
        count = len(requests)
        
        # Clean up uploaded files
        for request in requests:
            if request.form_data and request.form_data.get("flight_itinerary_path"):
                flight_itinerary_path = request.form_data["flight_itinerary_path"]
                if os.path.exists(flight_itinerary_path):
                    try:
                        os.remove(flight_itinerary_path)
                        print(f"Deleted file: {flight_itinerary_path}")
                    except Exception as e:
                        print(f"Error deleting file {flight_itinerary_path}: {str(e)}")
        
        # Delete all records
        db.query(models.ExitForm).delete()
        db.commit()
        
        print(f"Deleted {count} Exit Forms")
        return {"message": f"Successfully deleted {count} Exit Forms"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Exit Forms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Exit Forms: {str(e)}")

# Pathway Programs Intent to Progress Routes
# Helper function to convert string to boolean
def str_to_bool(value):
    if value is None:
        return None
    return value.lower() in ['true', 'yes', '1', 'on']

@router.post("/pathway-programs-intent-to-progress/", response_model=schemas.PathwayProgramsIntentToProgress)
async def create_pathway_programs_intent_to_progress(
    # Student Information
    ucf_id: str = Form(None),
    first_name: str = Form(None),
    last_name: str = Form(None),
    date_of_birth: str = Form(None),
    ethnicity: str = Form(None),

    # Permanent Address
    street_address: str = Form(None),
    state: str = Form(None),
    city: str = Form(None),
    postal_code: str = Form(None),
    country: str = Form(None),

    # UCF Global Program
    ucf_global_program: str = Form(None),

    # Emergency Contact
    emergency_contact_name: str = Form(None),
    emergency_contact_relationship: str = Form(None),
    emergency_contact_street_address: str = Form(None),
    emergency_contact_city: str = Form(None),
    emergency_contact_state: str = Form(None),
    emergency_contact_postal_code: str = Form(None),
    emergency_contact_country: str = Form(None),
    emergency_contact_phone: str = Form(None),

    # Application Information
    expected_progression_term: str = Form(None),
    academic_credits_earned: str = Form(None),
    intended_major: str = Form(None),
    has_accelerated_credits: str = Form(None),

    # Post-Secondary Information
    attended_other_institutions: str = Form(None),

    # College Entrance Exams
    sat_total_score: str = Form(None),
    sat_date_taken: str = Form(None),
    act_total_score: str = Form(None),
    act_date_taken: str = Form(None),

    # Crime/Disciplinary Questions
    disciplinary_action: str = Form(None),
    felony_conviction: str = Form(None),
    criminal_proceedings: str = Form(None),

    # Disclaimer
    certification: str = Form(None),

    db: Session = Depends(get_db)
):
    """Create a new Pathway Programs Intent to Progress request"""
    try:
        # Convert string booleans to actual booleans
        def str_to_bool(val):
            return val.lower() == 'true' if val else False

        # Prepare form data dictionary
        form_data = {
            # Student Information
            "ucf_id": ucf_id,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth,
            "ethnicity": ethnicity,

            # Permanent Address
            "street_address": street_address,
            "state": state,
            "city": city,
            "postal_code": postal_code,
            "country": country,

            # UCF Global Program
            "ucf_global_program": ucf_global_program,

            # Emergency Contact
            "emergency_contact_name": emergency_contact_name,
            "emergency_contact_relationship": emergency_contact_relationship,
            "emergency_contact_street_address": emergency_contact_street_address,
            "emergency_contact_city": emergency_contact_city,
            "emergency_contact_state": emergency_contact_state,
            "emergency_contact_postal_code": emergency_contact_postal_code,
            "emergency_contact_country": emergency_contact_country,
            "emergency_contact_phone": emergency_contact_phone,

            # Application Information
            "expected_progression_term": expected_progression_term,
            "academic_credits_earned": academic_credits_earned,
            "intended_major": intended_major,
            "has_accelerated_credits": str_to_bool(has_accelerated_credits),

            # Post-Secondary Information
            "attended_other_institutions": str_to_bool(attended_other_institutions),

            # College Entrance Exams
            "sat_total_score": sat_total_score,
            "sat_date_taken": sat_date_taken,
            "act_total_score": act_total_score,
            "act_date_taken": act_date_taken,

            # Crime/Disciplinary Questions
            "disciplinary_action": str_to_bool(disciplinary_action),
            "felony_conviction": str_to_bool(felony_conviction),
            "criminal_proceedings": str_to_bool(criminal_proceedings),

            # Disclaimer
            "certification": str_to_bool(certification)
        }

        # Create the request
        pathway_programs_request = models.PathwayProgramsIntentToProgress(
            student_name=f"{first_name} {last_name}".strip(),
            student_id=ucf_id or "Unknown",
            program="Pathway Programs Intent to Progress",
            submission_date=datetime.utcnow(),
            status="pending",
            form_data=form_data
        )

        db.add(pathway_programs_request)
        db.commit()
        db.refresh(pathway_programs_request)

        return pathway_programs_request

    except Exception as e:
        db.rollback()
        print(f"Error processing Pathway Programs Intent to Progress request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Pathway Programs Intent to Progress request: {str(e)}")

@router.get("/pathway-programs-intent-to-progress/", response_model=List[schemas.PathwayProgramsIntentToProgress])
def get_pathway_programs_intent_to_progress(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.PathwayProgramsIntentToProgress).all()
        print(f"Retrieved {len(requests)} Pathway Programs Intent to Progress requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Pathway Programs Intent to Progress requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.get("/pathway-programs-intent-to-progress/{request_id}", response_model=schemas.PathwayProgramsIntentToProgress)
def get_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.PathwayProgramsIntentToProgress).filter(models.PathwayProgramsIntentToProgress.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Pathway Programs Intent to Progress request not found")
        
        print(f"Retrieved Pathway Programs Intent to Progress request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Pathway Programs Intent to Progress request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving request: {str(e)}")

@router.delete("/pathway-programs-intent-to-progress/{request_id}", status_code=204)
def delete_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Intent to Progress request"""
    db_request = db.query(models.PathwayProgramsIntentToProgress).filter(models.PathwayProgramsIntentToProgress.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Pathway Programs Intent to Progress request not found")
    
    db.delete(db_request)
    db.commit()
    print(f"Deleted Pathway Programs Intent to Progress request ID: {request_id}")
    return {"message": "Pathway Programs Intent to Progress request deleted successfully"}

@router.delete("/pathway-programs-intent-to-progress/", status_code=204)
def delete_all_pathway_programs_intent_to_progress_requests(db: Session = Depends(get_db)):
    """Delete all Pathway Programs Intent to Progress requests from the database"""
    try:
        # Count how many records will be deleted
        count = db.query(models.PathwayProgramsIntentToProgress).count()
        
        # Delete all records
        db.query(models.PathwayProgramsIntentToProgress).delete()
        db.commit()
        
        print(f"Deleted {count} Pathway Programs Intent to Progress requests")
        return {"message": f"Successfully deleted {count} Pathway Programs Intent to Progress requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Pathway Programs Intent to Progress requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Pathway Programs Intent to Progress requests: {str(e)}")

@router.post("/pathway-programs-next-steps/", response_model=schemas.PathwayProgramsNextSteps)
async def create_pathway_programs_next_steps(
    # Personal Information
    ucf_id: str = Form(None),
    first_name: str = Form(None),
    last_name: str = Form(None),
    legal_sex: str = Form(None),
    email: str = Form(None),
    phone_number: str = Form(None),

    # Academic Information
    academic_program: str = Form(None),
    academic_track: str = Form(None),
    intended_major: str = Form(None),

    # Dietary Requirements
    dietary_requirements: str = Form(None),

    # Housing
    housing_selection: str = Form(None),

    # Acknowledgements
    program_acknowledgement: str = Form(None),
    housing_acknowledgement: str = Form(None),
    health_insurance_acknowledgement: str = Form(None),

    db: Session = Depends(get_db)
):
    """Create a new Pathway Programs Next Steps request"""
    try:
        # Convert string booleans to actual booleans
        def str_to_bool(val):
            return val.lower() == 'true' if val else False

        # Prepare form data dictionary
        form_data = {
            # Personal Information
            "ucf_id": ucf_id,
            "first_name": first_name,
            "last_name": last_name,
            "legal_sex": legal_sex,
            "email": email,
            "phone_number": phone_number,

            # Academic Information
            "academic_program": academic_program,
            "academic_track": academic_track,
            "intended_major": intended_major,

            # Dietary Requirements
            "dietary_requirements": dietary_requirements,

            # Housing
            "housing_selection": housing_selection,

            # Acknowledgements
            "program_acknowledgement": str_to_bool(program_acknowledgement),
            "housing_acknowledgement": str_to_bool(housing_acknowledgement),
            "health_insurance_acknowledgement": str_to_bool(health_insurance_acknowledgement)
        }

        # Create the request
        pathway_programs_request = models.PathwayProgramsNextSteps(
            student_name=f"{first_name} {last_name}".strip(),
            student_id=ucf_id or "Unknown",
            program="Pathway Programs Next Steps",
            submission_date=datetime.utcnow(),
            status="pending",
            form_data=form_data
        )

        db.add(pathway_programs_request)
        db.commit()
        db.refresh(pathway_programs_request)

        return pathway_programs_request

    except Exception as e:
        db.rollback()
        print(f"Error processing Pathway Programs Next Steps request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Pathway Programs Next Steps request: {str(e)}")

@router.get("/pathway-programs-next-steps/", response_model=List[schemas.PathwayProgramsNextSteps])
def get_pathway_programs_next_steps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Pathway Programs Next Steps requests"""
    try:
        requests = db.query(models.PathwayProgramsNextSteps).offset(skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving Pathway Programs Next Steps requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving Pathway Programs Next Steps requests: {str(e)}")

@router.delete("/pathway-programs-next-steps/{request_id}", status_code=204)
def delete_pathway_programs_next_steps_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Next Steps request"""
    try:
        request = db.query(models.PathwayProgramsNextSteps).filter(models.PathwayProgramsNextSteps.id == request_id).first()
        
        if not request:
            raise HTTPException(status_code=404, detail="Pathway Programs Next Steps request not found")
        
        db.delete(request)
        db.commit()
        
        return {"message": "Pathway Programs Next Steps request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Pathway Programs Next Steps request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Pathway Programs Next Steps request: {str(e)}")

@router.delete("/pathway-programs-next-steps/", status_code=204)
def delete_all_pathway_programs_next_steps_requests(db: Session = Depends(get_db)):
    """Delete all Pathway Programs Next Steps requests"""
    try:
        db.query(models.PathwayProgramsNextSteps).delete()
        db.commit()
        return {"message": "All Pathway Programs Next Steps requests deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Pathway Programs Next Steps requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Pathway Programs Next Steps requests: {str(e)}")

@router.post("/reduced-course-load/", response_model=schemas.ReducedCourseLoadRequest)
async def create_reduced_course_load_request(
    # Student Information
    ucf_id: str = Form(None),
    sevis_id: str = Form(None),
    visa_type: str = Form(None),
    given_name: str = Form(None),
    family_name: str = Form(None),
    street_address: str = Form(None),
    apartment_number: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal_code: str = Form(None),
    ucf_email_address: str = Form(None),
    secondary_email_address: str = Form(None),
    us_telephone_number: str = Form(None),

    # Academic Information
    academic_level: str = Form(None),
    academic_program_major: str = Form(None),
    rcl_term: str = Form(None),
    rcl_year: str = Form(None),
    desired_credits: str = Form(None),
    in_person_credits: str = Form(None),

    # RCL Reason
    rcl_reason: str = Form(None),

    db: Session = Depends(get_db)
):
    """Create a new Reduced Course Load Request"""
    try:
        # Prepare form data dictionary
        form_data = {
            # Student Information
            "ucf_id": ucf_id,
            "sevis_id": sevis_id,
            "visa_type": visa_type,
            "given_name": given_name,
            "family_name": family_name,
            "street_address": street_address,
            "apartment_number": apartment_number,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "ucf_email_address": ucf_email_address,
            "secondary_email_address": secondary_email_address,
            "us_telephone_number": us_telephone_number,

            # Academic Information
            "academic_level": academic_level,
            "academic_program_major": academic_program_major,
            "rcl_term": rcl_term,
            "rcl_year": rcl_year,
            "desired_credits": desired_credits,
            "in_person_credits": in_person_credits,

            # RCL Reason
            "rcl_reason": rcl_reason
        }

        # Create the request
        reduced_course_load_request = models.ReducedCourseLoadRequest(
            student_name=f"{given_name} {family_name}".strip(),
            student_id=ucf_id or "Unknown",
            program="Reduced Course Load Request",
            submission_date=datetime.utcnow(),
            status="pending",
            form_data=form_data
        )

        db.add(reduced_course_load_request)
        db.commit()
        db.refresh(reduced_course_load_request)

        return reduced_course_load_request

    except Exception as e:
        db.rollback()
        print(f"Error processing Reduced Course Load Request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Reduced Course Load Request: {str(e)}")

@router.get("/reduced-course-load/", response_model=List[schemas.ReducedCourseLoadRequest])
def get_reduced_course_load_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Reduced Course Load Requests"""
    try:
        requests = db.query(models.ReducedCourseLoadRequest).offset(skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving Reduced Course Load Requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving Reduced Course Load Requests: {str(e)}")

@router.delete("/reduced-course-load/{request_id}", status_code=204)
def delete_reduced_course_load_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Reduced Course Load Request"""
    try:
        request = db.query(models.ReducedCourseLoadRequest).filter(models.ReducedCourseLoadRequest.id == request_id).first()
        
        if not request:
            raise HTTPException(status_code=404, detail="Reduced Course Load Request not found")
        
        db.delete(request)
        db.commit()
        
        return {"message": "Reduced Course Load Request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Reduced Course Load Request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Reduced Course Load Request: {str(e)}")

@router.delete("/reduced-course-load/", status_code=204)
def delete_all_reduced_course_load_requests(db: Session = Depends(get_db)):
    """Delete all Reduced Course Load Requests"""
    try:
        db.query(models.ReducedCourseLoadRequest).delete()
        db.commit()
        return {"message": "All Reduced Course Load Requests deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Reduced Course Load Requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Reduced Course Load Requests: {str(e)}")

@router.post("/global-transfer-out/", response_model=schemas.GlobalTransferOutRequest)
async def create_global_transfer_out_request(
    # Student Information
    ucf_id: str = Form(None),
    sevis_id: str = Form(None),
    visa_type: str = Form(None),
    given_name: str = Form(None),
    family_name: str = Form(None),
    street_address: str = Form(None),
    apartment_number: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal_code: str = Form(None),
    ucf_email_address: str = Form(None),
    secondary_email_address: str = Form(None),
    us_telephone_number: str = Form(None),

    # Current Academic Information
    ucf_education_level: str = Form(None),
    campus_employment: str = Form(None),

    # New School Information
    new_school_name: str = Form(None),
    new_school_start_date: str = Form(None),
    desired_sevis_release_date: str = Form(None),
    new_school_international_advisor_name: str = Form(None),
    new_school_international_advisor_email: str = Form(None),
    new_school_international_advisor_phone: str = Form(None),

    # Additional Information Checkboxes
    understanding_sevis_release: str = Form(None),
    permission_to_communicate: str = Form(None),
    understanding_work_authorization: str = Form(None),
    understanding_financial_obligations: str = Form(None),

    db: Session = Depends(get_db)
):
    """Create a new Global Transfer Out Request"""
    try:
        # Prepare form data dictionary
        form_data = {
            # Student Information
            "ucf_id": ucf_id,
            "sevis_id": sevis_id,
            "visa_type": visa_type,
            "given_name": given_name,
            "family_name": family_name,
            "street_address": street_address,
            "apartment_number": apartment_number,
            "city": city,
            "state": state,
            "postal_code": postal_code,
            "ucf_email_address": ucf_email_address,
            "secondary_email_address": secondary_email_address,
            "us_telephone_number": us_telephone_number,

            # Current Academic Information
            "ucf_education_level": ucf_education_level,
            "campus_employment": campus_employment,

            # New School Information
            "new_school_name": new_school_name,
            "new_school_start_date": new_school_start_date,
            "desired_sevis_release_date": desired_sevis_release_date,
            "new_school_international_advisor_name": new_school_international_advisor_name,
            "new_school_international_advisor_email": new_school_international_advisor_email,
            "new_school_international_advisor_phone": new_school_international_advisor_phone,

            # Additional Information Checkboxes
            "understanding_sevis_release": understanding_sevis_release == 'true',
            "permission_to_communicate": permission_to_communicate == 'true',
            "understanding_work_authorization": understanding_work_authorization == 'true',
            "understanding_financial_obligations": understanding_financial_obligations == 'true'
        }

        # Create the request
        global_transfer_out_request = models.GlobalTransferOutRequest(
            student_name=f"{given_name} {family_name}".strip(),
            student_id=ucf_id or "Unknown",
            program="Global Transfer Out Request",
            submission_date=datetime.utcnow(),
            status="pending",
            form_data=form_data
        )

        db.add(global_transfer_out_request)
        db.commit()
        db.refresh(global_transfer_out_request)

        return global_transfer_out_request

    except Exception as e:
        db.rollback()
        print(f"Error processing Global Transfer Out Request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing Global Transfer Out Request: {str(e)}")

@router.get("/global-transfer-out/", response_model=List[schemas.GlobalTransferOutRequest])
def get_global_transfer_out_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Global Transfer Out Requests"""
    try:
        requests = db.query(models.GlobalTransferOutRequest).offset(skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving Global Transfer Out Requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving Global Transfer Out Requests: {str(e)}")

@router.delete("/global-transfer-out/{request_id}", status_code=204)
def delete_global_transfer_out_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Global Transfer Out Request"""
    try:
        request = db.query(models.GlobalTransferOutRequest).filter(models.GlobalTransferOutRequest.id == request_id).first()
        
        if not request:
            raise HTTPException(status_code=404, detail="Global Transfer Out Request not found")
        
        db.delete(request)
        db.commit()
        
        return {"message": "Global Transfer Out Request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Global Transfer Out Request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Global Transfer Out Request: {str(e)}")

@router.delete("/global-transfer-out/", status_code=204)
def delete_all_global_transfer_out_requests(db: Session = Depends(get_db)):
    """Delete all Global Transfer Out Requests"""
    try:
        db.query(models.GlobalTransferOutRequest).delete()
        db.commit()
        return {"message": "All Global Transfer Out Requests deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Global Transfer Out Requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting Global Transfer Out Requests: {str(e)}")
    
    
# TRAVEL APPROVAL PETITION ROUTES