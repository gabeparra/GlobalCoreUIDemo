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