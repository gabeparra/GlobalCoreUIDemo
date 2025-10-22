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
def create_opt_request(
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
                file_path = save_upload_file(file, upload_dir)
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