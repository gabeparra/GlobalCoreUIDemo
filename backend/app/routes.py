from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import os
import uuid
from pathlib import Path
from app.route_helpers import create_db_record, commit_to_db, UPLOAD_PATHS, save_upload_file, create_form_data_dict, convert_multiple_bools, save_multiple_files
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
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program", "other_reason"})

        # Create and commit DB record
        db_request = create_db_record(
            models.I20Request,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program,
            form_data,
            other_reason=request.other_reason  # Extra field specific to I-20
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=400, detail=f"Error processing request: {str(e)}")


@router.get("/i20-requests/", response_model=List[schemas.I20Request])
def get_i20_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.I20Request).offset(skip).limit(limit).all()
    print(
        f"Returning {len(requests)} requests with data: {requests[0].form_data if requests else 'No requests'}")
    return requests


@router.get("/i20-requests/{request_id}", response_model=schemas.I20Request)
def get_i20_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.I20Request).filter(
        models.I20Request.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="I-20 request not found")
    print(f"Returning single request with data: {db_request.form_data}")
    return db_request


@router.delete("/i20-requests/{request_id}", status_code=204)
def delete_i20_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific I-20 request"""
    db_request = db.query(models.I20Request).filter(
        models.I20Request.id == request_id).first()
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
        raise HTTPException(
            status_code=500, detail=f"Error deleting I-20 requests: {str(e)}")


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
        # Save files with student ID
        file_paths = await save_multiple_files(
            files_dict={
                'offer_letter': offer_letter,
                'training_authorization': training_authorization
            },
            destination_dir=UPLOAD_PATHS["academic_training"],
            ucf_id=student_id
        )

        # Convert all booleans at once
        bool_fields = convert_multiple_bools({
            "has_us_address": has_us_address,
            "enrolled_full_time": enrolled_full_time,
            "employed_on_campus": employed_on_campus,
            "previously_authorized": previously_authorized,
            "understand_pre_completion": understand_pre_completion,
            "understand_post_completion": understand_post_completion,
            "understand_medical_insurance": understand_medical_insurance,
            "understand_employer_specific": understand_employer_specific,
            "understand_consult_advisor": understand_consult_advisor,
            "certify_information": certify_information
        })

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=student_id,
            given_name=given_name,
            family_name=family_name,
            sevis_id=sevis_id,
            legal_sex=legal_sex,
            date_of_birth=date_of_birth,
            city_of_birth=city_of_birth,
            country_of_birth=country_of_birth,
            country_of_citizenship=country_of_citizenship,
            country_of_legal_residence=country_of_legal_residence,
            street_address=street_address,
            city=city,
            state=state,
            country=country,
            us_telephone=us_telephone,
            non_us_telephone=non_us_telephone,
            academic_training_start_date=academic_training_start_date,
            academic_training_end_date=academic_training_end_date,
            completion_type=completion_type,
            **file_paths,
            **bool_fields
        )

        db_request = create_db_record(
            models.AcademicTrainingRequest,
            student_id, given_name, family_name,
            program,
            form_data,
            completion_type=completion_type,
            comments=comments
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/academic-training/", response_model=List[schemas.AcademicTrainingRequest])
def get_academic_training_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.AcademicTrainingRequest).offset(
        skip).limit(limit).all()
    print(f"Returning {len(requests)} Academic Training requests")
    return requests


@router.get("/academic-training/{request_id}", response_model=schemas.AcademicTrainingRequest)
def get_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.AcademicTrainingRequest).filter(
        models.AcademicTrainingRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Academic Training request not found")
    print(f"Returning Academic Training request with ID: {request_id}")
    return db_request


@router.delete("/academic-training/{request_id}", status_code=204)
def delete_academic_training_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Academic Training request"""
    db_request = db.query(models.AcademicTrainingRequest).filter(
        models.AcademicTrainingRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Academic Training request not found")

    # Delete associated files if they exist
    if db_request.form_data:
        offer_letter_path = db_request.form_data.get('offer_letter_path')
        training_auth_path = db_request.form_data.get(
            'training_authorization_path')

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
                training_auth_path = request.form_data.get(
                    'training_authorization_path')

                if offer_letter_path and os.path.exists(offer_letter_path):
                    try:
                        os.remove(offer_letter_path)
                    except Exception as e:
                        print(
                            f"Error deleting file {offer_letter_path}: {str(e)}")

                if training_auth_path and os.path.exists(training_auth_path):
                    try:
                        os.remove(training_auth_path)
                    except Exception as e:
                        print(
                            f"Error deleting file {training_auth_path}: {str(e)}")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Academic Training requests: {str(e)}")

# Administrative Record Change Routes


@router.post("/administrative-record/", response_model=schemas.AdministrativeRecordRequest)
def create_administrative_record_request(request: schemas.AdministrativeRecordRequestCreate, db: Session = Depends(get_db)):
    try:
        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create and commit DB record
        db_request = create_db_record(
            models.AdministrativeRecordRequest,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program,
            form_data
        )

        return commit_to_db(db, db_request)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/administrative-record/", response_model=List[schemas.AdministrativeRecordRequest])
def get_administrative_record_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.AdministrativeRecordRequest).offset(
        skip).limit(limit).all()
    print(f"Returning {len(requests)} Administrative Record requests")
    return requests


@router.get("/administrative-record/{request_id}", response_model=schemas.AdministrativeRecordRequest)
def get_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.AdministrativeRecordRequest).filter(
        models.AdministrativeRecordRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Administrative Record request not found")
    print(f"Returning Administrative Record request with ID: {request_id}")
    return db_request


@router.delete("/administrative-record/{request_id}", status_code=204)
def delete_administrative_record_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Administrative Record request"""
    db_request = db.query(models.AdministrativeRecordRequest).filter(
        models.AdministrativeRecordRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Administrative Record request not found")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Administrative Record requests: {str(e)}")

# Conversation Partner Routes


@router.post("/conversation-partner/", response_model=schemas.ConversationPartnerRequest)
def create_conversation_partner_request(request: schemas.ConversationPartnerRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received Conversation Partner request: {request}")

        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create and commit DB record
        db_request = create_db_record(
            models.ConversationPartnerRequest,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program or "Conversation Partner",
            form_data
        )

        return commit_to_db(db, db_request, f"Conversation Partner request created with ID: {db_request.id}")

    except Exception as e:
        db.rollback()
        print(f"Error processing Conversation Partner request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=400, detail=f"Error processing Conversation Partner request: {str(e)}")


@router.get("/conversation-partner/", response_model=List[schemas.ConversationPartnerRequest])
def get_conversation_partner_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.ConversationPartnerRequest).offset(
        skip).limit(limit).all()
    print(f"Returning {len(requests)} Conversation Partner requests")
    return requests


@router.get("/conversation-partner/{request_id}", response_model=schemas.ConversationPartnerRequest)
def get_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.ConversationPartnerRequest).filter(
        models.ConversationPartnerRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Conversation Partner request not found")
    print(f"Returning Conversation Partner request with ID: {request_id}")
    return db_request


@router.delete("/conversation-partner/{request_id}", status_code=204)
def delete_conversation_partner_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Conversation Partner request"""
    db_request = db.query(models.ConversationPartnerRequest).filter(
        models.ConversationPartnerRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Conversation Partner request not found")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Conversation Partner requests: {str(e)}")

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
        # Save all files with student ID
        file_paths = await save_multiple_files(
            files_dict={
                "photo2x2": photo2x2,
                "passport_biographical": passport_biographical,
                "f1_visa_or_uscis_notice": f1_visa_or_uscis_notice,
                "i94": i94,
                "form_i765": form_i765,
                "form_g1145": form_g1145,
                "previous_i20s": previous_i20s,
                "previous_ead": previous_ead
            },
            destination_dir=UPLOAD_PATHS["opt_requests"],
            ucf_id=ucf_id
        )

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id,
            given_name=given_name,
            family_name=family_name,
            email=ucf_email_address,
            date_of_birth=date_of_birth,
            legal_sex=legal_sex,
            country_of_citizenship=country_of_citizenship,
            academic_level=academic_level,
            academic_program=academic_program,
            address=address,
            address2=address2,
            city=city,
            state=state,
            postal_code=postal_code,
            secondary_email_address=secondary_email_address,
            telephone_number=telephone_number,
            information_correct=information_correct,
            full_time_student=full_time_student,
            intent_to_graduate=intent_to_graduate,
            semester_of_graduation=semester_of_graduation,
            desired_opt_start_date=desired_opt_start_date,
            desired_opt_end_date=desired_opt_end_date,
            currently_employed_on_campus=currently_employed_on_campus,
            previous_opt_authorization=previous_opt_authorization,
            opt_workshop_completed=opt_workshop_completed,
            opt_request_timeline=opt_request_timeline,
            ead_card_copy=ead_card_copy,
            report_changes=report_changes,
            unemployment_limit=unemployment_limit,
            employment_start_date=employment_start_date,
            **file_paths
        )

        # Create and commit DB record
        db_request = create_db_record(
            models.OPTRequest,
            ucf_id, given_name, family_name,
            "OPT Request",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/opt-requests/", response_model=List[schemas.OPTRequest])
def get_opt_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.OPTRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} OPT requests")
    return requests


@router.get("/opt-requests/{request_id}", response_model=schemas.OPTRequest)
def get_opt_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.OPTRequest).filter(
        models.OPTRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="OPT request not found")
    print(f"Returning OPT request with ID: {request_id}")
    return db_request


@router.delete("/opt-requests/{request_id}", status_code=204)
def delete_opt_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT request"""
    db_request = db.query(models.OPTRequest).filter(
        models.OPTRequest.id == request_id).first()
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
        raise HTTPException(
            status_code=500, detail=f"Error deleting OPT requests: {str(e)}")

# Document Request endpoints


@router.post("/document-requests/", response_model=schemas.DocumentRequest)
def create_document_request(request: schemas.DocumentRequestCreate, db: Session = Depends(get_db)):
    """Create a new Document Request"""
    try:
        print(f"Received Document Request: {request}")

        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create the database record
        db_request = create_db_record(
            models.DocumentRequest,
            request.student_id,
            request.given_name,  # needs schema update first
            request.family_name,
            request.program or "Document Request",
            form_data
        )

        return commit_to_db(db, db_request)
    except Exception as e:
        db.rollback()
        print(f"Error processing Document Request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=400, detail=f"Error processing Document Request: {str(e)}")


@router.get("/document-requests/", response_model=List[schemas.DocumentRequest])
def get_document_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.DocumentRequest).offset(skip).limit(limit).all()
    print(f"Returning {len(requests)} Document requests")
    return requests


@router.get("/document-requests/{request_id}", response_model=schemas.DocumentRequest)
def get_document_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.DocumentRequest).filter(
        models.DocumentRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Document request not found")
    print(f"Returning Document request with ID: {request_id}")
    return db_request


@router.delete("/document-requests/{request_id}", status_code=204)
def delete_document_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Document request"""
    db_request = db.query(models.DocumentRequest).filter(
        models.DocumentRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Document request not found")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Document requests: {str(e)}")

# English Language Volunteer Request endpoints


@router.post("/english-language-volunteer/", response_model=schemas.EnglishLanguageVolunteerRequest)
def create_english_language_volunteer_request(request: schemas.EnglishLanguageVolunteerRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received English Language Volunteer request: {request}")

        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create and commit DB record
        db_request = create_db_record(
            models.EnglishLanguageVolunteerRequest,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program,
            form_data
        )

        return commit_to_db(db, db_request, f"Created English Language Volunteer request with ID: {db_request.id}")

    except Exception as e:
        db.rollback()
        print(f"Error creating English Language Volunteer request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating request: {str(e)}")


@router.get("/english-language-volunteer/", response_model=List[schemas.EnglishLanguageVolunteerRequest])
def get_english_language_volunteer_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.EnglishLanguageVolunteerRequest).all()
        print(f"Retrieved {len(requests)} English Language Volunteer requests")
        return requests
    except Exception as e:
        print(
            f"Error retrieving English Language Volunteer requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/english-language-volunteer/{request_id}", response_model=schemas.EnglishLanguageVolunteerRequest)
def get_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.EnglishLanguageVolunteerRequest).filter(
            models.EnglishLanguageVolunteerRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving English Language Volunteer request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/english-language-volunteer/{request_id}")
def delete_english_language_volunteer_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.EnglishLanguageVolunteerRequest).filter(
            models.EnglishLanguageVolunteerRequest.id == request_id).first()
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
        raise HTTPException(
            status_code=500, detail=f"Error deleting request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting English Language Volunteer requests: {str(e)}")

# Off Campus Housing Request endpoints


@router.post("/off-campus-housing/", response_model=schemas.OffCampusHousingRequest)
def create_off_campus_housing_request(request: schemas.OffCampusHousingRequestCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received Off Campus Housing request: {request}")

        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create and commit DB record
        db_request = create_db_record(
            models.OffCampusHousingRequest,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program,
            form_data
        )

        return commit_to_db(db, db_request, f"Created Off Campus Housing request with ID: {db_request.id}")

    except Exception as e:
        db.rollback()
        print(f"Error creating Off Campus Housing request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating request: {str(e)}")


@router.get("/off-campus-housing/", response_model=List[schemas.OffCampusHousingRequest])
def get_off_campus_housing_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.OffCampusHousingRequest).all()
        print(f"Retrieved {len(requests)} Off Campus Housing requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Off Campus Housing requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/off-campus-housing/{request_id}", response_model=schemas.OffCampusHousingRequest)
def get_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OffCampusHousingRequest).filter(
            models.OffCampusHousingRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Off Campus Housing request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/off-campus-housing/{request_id}")
def delete_off_campus_housing_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OffCampusHousingRequest).filter(
            models.OffCampusHousingRequest.id == request_id).first()
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
        raise HTTPException(
            status_code=500, detail=f"Error deleting request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Off Campus Housing requests: {str(e)}")

# Florida Statute 1010.35 Routes


@router.post("/florida-statute-101035/", response_model=schemas.FloridaStatute101035Request)
async def create_florida_statute_101035_request(
    ucf_id: str = Form(...),
    given_name: str = Form(...),
    family_name: str = Form(...),
    date_of_birth: str = Form(...),
    telephone_number: str = Form(...),
    email: str = Form(...),
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
        # Save file with UCF ID subfolder
        passport_path = await save_upload_file(
            passport_document,
            UPLOAD_PATHS["florida_statute"],
            ucf_id
        )

        # Prepare form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id,
            given_name=given_name,
            family_name=family_name,
            date_of_birth=date_of_birth,
            telephone_number=telephone_number,
            email=email,
            sevis_number=sevis_number,
            college=college,
            department=department,
            position=position,
            has_passport=has_passport,
            has_ds160=has_ds160,
            passport_document_path=passport_path
        )

        # Create and commit DB record
        db_request = create_db_record(
            models.FloridaStatute101035Request,
            ucf_id, given_name, family_name,
            "Florida Statute 1010.35",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        print(f"Error creating Florida Statute 1010.35 request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating request: {str(e)}")


@router.get("/florida-statute-101035/", response_model=List[schemas.FloridaStatute101035Request])
def get_florida_statute_101035_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.FloridaStatute101035Request).all()
        print(f"Retrieved {len(requests)} Florida Statute 1010.35 requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Florida Statute 1010.35 requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/florida-statute-101035/{request_id}", response_model=schemas.FloridaStatute101035Request)
def get_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.FloridaStatute101035Request).filter(
            models.FloridaStatute101035Request.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")

        print(f"Retrieved Florida Statute 1010.35 request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Florida Statute 1010.35 request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/florida-statute-101035/{request_id}")
def delete_florida_statute_101035_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.FloridaStatute101035Request).filter(
            models.FloridaStatute101035Request.id == request_id).first()
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
        raise HTTPException(
            status_code=500, detail=f"Error deleting request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Florida Statute 1010.35 requests: {str(e)}")

# Leave Request Routes


@router.post("/leave-requests/", response_model=schemas.LeaveRequest)
async def create_leave_request(
    employee_id: str = Form(...),
    given_name: str = Form(...),
    family_name: str = Form(...),
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
        # Save file with UCF ID (using employee_id)
        documentation_path = await save_upload_file(
            documentation,
            UPLOAD_PATHS["leave_requests"],
            employee_id  # Add this param
        )

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=employee_id,
            given_name=given_name,
            family_name=family_name,
            leave_type=leave_type,
            from_date=from_date,
            from_time=from_time,
            to_date=to_date,
            to_time=to_time,
            hours_requested=hours_requested,
            reason=reason,
            course_name=course_name,
            documentation_path=documentation_path
        )

        # Create and commit
        db_request = create_db_record(
            models.LeaveRequest,
            employee_id, given_name, family_name,
            "Leave Request",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leave-requests/", response_model=List[schemas.LeaveRequest])
def get_leave_requests(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.LeaveRequest).all()
        print(f"Retrieved {len(requests)} Leave requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Leave requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/leave-requests/{request_id}", response_model=schemas.LeaveRequest)
def get_leave_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.LeaveRequest).filter(
            models.LeaveRequest.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Request not found")

        print(f"Retrieved Leave request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Leave request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/leave-requests/{request_id}")
def delete_leave_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.LeaveRequest).filter(
            models.LeaveRequest.id == request_id).first()
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
                    print(
                        f"Error deleting file {documentation_path}: {str(e)}")

        db.delete(request)
        db.commit()

        print(f"Deleted Leave request {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Leave request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting request: {str(e)}")


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
                        print(
                            f"Error deleting file {documentation_path}: {str(e)}")

        # Delete all records
        db.query(models.LeaveRequest).delete()
        db.commit()

        print(f"Deleted {count} Leave requests")
        return {"message": f"Successfully deleted {count} Leave requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Leave requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Leave requests: {str(e)}")

# OPT STEM Extension Reporting Routes


@router.post("/opt-stem-reports/", response_model=schemas.OptStemExtensionReport)
def create_opt_stem_report(request: schemas.OptStemExtensionReportCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received OPT STEM Extension Report: {request}")

        # Convert the request model to a dict for JSON storage
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

        # Create and commit DB record
        db_request = create_db_record(
            models.OptStemExtensionReport,
            request.student_id,
            request.given_name,
            request.family_name,
            request.program,
            form_data
        )

        return commit_to_db(db, db_request, f"Created OPT STEM Extension Report with ID: {db_request.id}")

    except Exception as e:
        print(f"Error processing OPT STEM Extension Report: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=400, detail=f"Error processing report: {str(e)}")


@router.get("/opt-stem-reports/", response_model=List[schemas.OptStemExtensionReport])
def get_opt_stem_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = db.query(models.OptStemExtensionReport).offset(
        skip).limit(limit).all()
    print(f"Returning {len(requests)} OPT STEM Extension reports")
    return requests


@router.get("/opt-stem-reports/{request_id}", response_model=schemas.OptStemExtensionReport)
def get_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.OptStemExtensionReport).filter(
        models.OptStemExtensionReport.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="OPT STEM Extension report not found")
    print(f"Returning OPT STEM Extension report with ID: {request_id}")
    return db_request


@router.delete("/opt-stem-reports/{request_id}", status_code=204)
def delete_opt_stem_report(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific OPT STEM Extension report"""
    db_request = db.query(models.OptStemExtensionReport).filter(
        models.OptStemExtensionReport.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="OPT STEM Extension report not found")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting OPT STEM Extension reports: {str(e)}")

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
    supervisor_given_name: str = Form(None),
    supervisor_family_name: str = Form(None),
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
        # Save all files
        file_paths = await save_multiple_files(
            files_dict={
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
            },
            destination_dir=UPLOAD_PATHS["opt_stem_applications"],
            ucf_id=ucf_id
        )

        # Convert booleans
        bool_fields = convert_multiple_bools({
            "is_paid_position": is_paid_position,
            "is_staffing_firm": is_staffing_firm,
            "has_e_verify": has_e_verify,
            "based_on_previous_stem_degree": based_on_previous_stem_degree,
            "completed_stem_workshop": completed_stem_workshop,
            "provide_ead_copy": provide_ead_copy,
            "understand_unemployment_limits": understand_unemployment_limits,
            "notify_changes": notify_changes,
            "submit_updated_i983": submit_updated_i983,
            "comply_reporting_requirements": comply_reporting_requirements,
            "reviewed_photo_requirements": reviewed_photo_requirements,
            "reviewed_fee_payment": reviewed_fee_payment
        })

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id,
            given_name=given_name,
            family_name=family_name,
            email=ucf_email_address,
            date_of_birth=date_of_birth,
            gender=gender,
            country_of_citizenship=country_of_citizenship,
            academic_level=academic_level,
            academic_program=academic_program,
            address=address,
            address_2=address_2,
            city=city,
            state=state,
            postal_code=postal_code,
            secondary_email_address=secondary_email_address,
            telephone_number=telephone_number,
            job_title=job_title,
            employer_name=employer_name,
            employer_ein=employer_ein,
            employment_street_address=employment_street_address,
            employment_city=employment_city,
            employment_state=employment_state,
            employment_postal_code=employment_postal_code,
            supervisor_given_name=supervisor_given_name,
            supervisor_family_name=supervisor_family_name,
            supervisor_email=supervisor_email,
            supervisor_telephone=supervisor_telephone,
            hours_per_week=hours_per_week,
            **file_paths,
            **bool_fields
        )

        db_request = create_db_record(
            models.OptStemExtensionApplication,
            ucf_id, given_name, family_name,
            "OPT STEM Extension Application",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/opt-stem-applications/", response_model=List[schemas.OptStemExtensionApplication])
def get_opt_stem_applications(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.OptStemExtensionApplication).all()
        print(f"Retrieved {len(requests)} OPT STEM Extension applications")
        return requests
    except Exception as e:
        print(f"Error retrieving OPT STEM Extension applications: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving applications: {str(e)}")


@router.get("/opt-stem-applications/{request_id}", response_model=schemas.OptStemExtensionApplication)
def get_opt_stem_application(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OptStemExtensionApplication).filter(
            models.OptStemExtensionApplication.id == request_id).first()
        if request is None:
            raise HTTPException(
                status_code=404, detail="Application not found")

        print(f"Retrieved OPT STEM Extension application {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving OPT STEM Extension application: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving application: {str(e)}")


@router.delete("/opt-stem-applications/{request_id}")
def delete_opt_stem_application(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.OptStemExtensionApplication).filter(
            models.OptStemExtensionApplication.id == request_id).first()
        if request is None:
            raise HTTPException(
                status_code=404, detail="Application not found")

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
        raise HTTPException(
            status_code=500, detail=f"Error deleting application: {str(e)}")


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
                                print(
                                    f"Error deleting file {file_path}: {str(e)}")

        # Delete all records
        db.query(models.OptStemExtensionApplication).delete()
        db.commit()

        print(f"Deleted {count} OPT STEM Extension applications")
        return {"message": f"Successfully deleted {count} OPT STEM Extension applications"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting OPT STEM Extension applications: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting OPT STEM Extension applications: {str(e)}")

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
        # Save file
        flight_itinerary_path = await save_upload_file(
            flight_itinerary,
            UPLOAD_PATHS["exit_forms"],
            ucf_id
        )

        # Convert booleans
        bool_fields = convert_multiple_bools({
            "work_authorization_acknowledgment": work_authorization_acknowledgment,
            "cpt_opt_acknowledgment": cpt_opt_acknowledgment,
            "financial_obligations_acknowledgment": financial_obligations_acknowledgment
        })

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id,
            given_name=given_name,
            family_name=family_name,
            email=ucf_email,
            sevis_id=sevis_id,
            visa_type=visa_type,
            us_street_address=us_street_address,
            apartment_number=apartment_number,
            city=city,
            state=state,
            postal_code=postal_code,
            foreign_street_address=foreign_street_address,
            foreign_city=foreign_city,
            foreign_postal_code=foreign_postal_code,
            country=country,
            secondary_email=secondary_email,
            us_telephone=us_telephone,
            foreign_telephone=foreign_telephone,
            education_level=education_level,
            employed_on_campus=employed_on_campus,
            departure_date=departure_date,
            flight_itinerary_path=flight_itinerary_path,
            departure_reason=departure_reason,
            remarks=remarks,
            **bool_fields
        )

        db_request = create_db_record(
            models.ExitForm,
            ucf_id, given_name, family_name,
            "Exit Form",
            form_data
        )

        return commit_to_db(db, db_request, f"Created Exit Form for {given_name} {family_name}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exit-forms/", response_model=List[schemas.ExitForm])
def get_exit_forms(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.ExitForm).all()
        print(f"Retrieved {len(requests)} Exit Forms")
        return requests
    except Exception as e:
        print(f"Error retrieving Exit Forms: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/exit-forms/{request_id}", response_model=schemas.ExitForm)
def get_exit_form(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.ExitForm).filter(
            models.ExitForm.id == request_id).first()
        if request is None:
            raise HTTPException(status_code=404, detail="Exit Form not found")

        print(f"Retrieved Exit Form {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Exit Form: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/exit-forms/{request_id}")
def delete_exit_form(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.ExitForm).filter(
            models.ExitForm.id == request_id).first()
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
                    print(
                        f"Error deleting file {flight_itinerary_path}: {str(e)}")

        db.delete(request)
        db.commit()

        print(f"Deleted Exit Form {request_id}")
        return {"message": "Request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Exit Form: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting request: {str(e)}")


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
                        print(
                            f"Error deleting file {flight_itinerary_path}: {str(e)}")

        # Delete all records
        db.query(models.ExitForm).delete()
        db.commit()

        print(f"Deleted {count} Exit Forms")
        return {"message": f"Successfully deleted {count} Exit Forms"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Exit Forms: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Exit Forms: {str(e)}")


@router.post("/pathway-programs-intent-to-progress/", response_model=schemas.PathwayProgramsIntentToProgress)
async def create_pathway_programs_intent_to_progress(
    # All Form parameters stay the same (lines 1753-1803)
    ucf_id: str = Form(None),
    given_name: str = Form(None),
    family_name: str = Form(None),
    date_of_birth: str = Form(None),
    ethnicity: str = Form(None),
    street_address: str = Form(None),
    city: str = Form(None),
    state: str = Form(None),
    postal_code: str = Form(None),
    country: str = Form(None),
    ucf_global_program: str = Form(None),
    emergency_contact_name: str = Form(None),
    certification: str = Form(None),
    has_accelerated_credits: str = Form(None),
    attended_other_institutions: str = Form(None),
    disciplinary_action: str = Form(None),
    felony_conviction: str = Form(None),
    criminal_proceedings: str = Form(None),
    expected_progression_term: str = Form(None),
    academic_credits_earned: str = Form(None),
    intended_major: str = Form(None),
    sat_total_score: str = Form(None),
    sat_date_taken: str = Form(None),
    act_total_score: str = Form(None),
    act_date_taken: str = Form(None),
    emergency_contact_relationship: str = Form(None),
    emergency_contact_street_address: str = Form(None),
    emergency_contact_city: str = Form(None),
    emergency_contact_state: str = Form(None),
    emergency_contact_postal_code: str = Form(None),
    emergency_contact_country: str = Form(None),
    emergency_contact_phone: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Convert booleans
        bool_fields = convert_multiple_bools({
            "has_accelerated_credits": has_accelerated_credits,
            "attended_other_institutions": attended_other_institutions,
            "disciplinary_action": disciplinary_action,
            "felony_conviction": felony_conviction,
            "criminal_proceedings": criminal_proceedings,
            "certification": certification
        })

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id or "Unknown",
            given_name=given_name,
            family_name=family_name,
            date_of_birth=date_of_birth,
            ethnicity=ethnicity,
            street_address=street_address,
            state=state,
            city=city,
            postal_code=postal_code,
            country=country,
            ucf_global_program=ucf_global_program,
            emergency_contact_name=emergency_contact_name,
            emergency_contact_relationship=emergency_contact_relationship,
            emergency_contact_street_address=emergency_contact_street_address,
            emergency_contact_city=emergency_contact_city,
            emergency_contact_state=emergency_contact_state,
            emergency_contact_postal_code=emergency_contact_postal_code,
            emergency_contact_country=emergency_contact_country,
            emergency_contact_phone=emergency_contact_phone,
            expected_progression_term=expected_progression_term,
            academic_credits_earned=academic_credits_earned,
            intended_major=intended_major,
            sat_total_score=sat_total_score,
            sat_date_taken=sat_date_taken,
            act_total_score=act_total_score,
            act_date_taken=act_date_taken,
            **bool_fields
        )

        db_request = create_db_record(
            models.PathwayProgramsIntentToProgress,
            ucf_id or "Unknown",
            given_name,
            family_name,
            "Pathway Programs Intent to Progress",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/pathway-programs-intent-to-progress/", response_model=List[schemas.PathwayProgramsIntentToProgress])
def get_pathway_programs_intent_to_progress(db: Session = Depends(get_db)):
    try:
        requests = db.query(models.PathwayProgramsIntentToProgress).all()
        print(
            f"Retrieved {len(requests)} Pathway Programs Intent to Progress requests")
        return requests
    except Exception as e:
        print(
            f"Error retrieving Pathway Programs Intent to Progress requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving requests: {str(e)}")


@router.get("/pathway-programs-intent-to-progress/{request_id}", response_model=schemas.PathwayProgramsIntentToProgress)
def get_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    try:
        request = db.query(models.PathwayProgramsIntentToProgress).filter(
            models.PathwayProgramsIntentToProgress.id == request_id).first()
        if request is None:
            raise HTTPException(
                status_code=404, detail="Pathway Programs Intent to Progress request not found")

        print(
            f"Retrieved Pathway Programs Intent to Progress request {request_id}")
        return request
    except HTTPException:
        raise
    except Exception as e:
        print(
            f"Error retrieving Pathway Programs Intent to Progress request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving request: {str(e)}")


@router.delete("/pathway-programs-intent-to-progress/{request_id}", status_code=204)
def delete_pathway_programs_intent_to_progress_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Intent to Progress request"""
    db_request = db.query(models.PathwayProgramsIntentToProgress).filter(
        models.PathwayProgramsIntentToProgress.id == request_id).first()
    if db_request is None:
        raise HTTPException(
            status_code=404, detail="Pathway Programs Intent to Progress request not found")

    db.delete(db_request)
    db.commit()
    print(
        f"Deleted Pathway Programs Intent to Progress request ID: {request_id}")
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
        print(
            f"Error deleting Pathway Programs Intent to Progress requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Pathway Programs Intent to Progress requests: {str(e)}")


@router.post("/pathway-programs-next-steps/", response_model=schemas.PathwayProgramsNextSteps)
async def create_pathway_programs_next_steps(
    # Personal Information
    ucf_id: str = Form(None),
    given_name: str = Form(None),
    family_name: str = Form(None),
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

    try:
        # Convert booleans
        bool_fields = convert_multiple_bools({
            "program_acknowledgement": program_acknowledgement,
            "housing_acknowledgement": housing_acknowledgement,
            "health_insurance_acknowledgement": health_insurance_acknowledgement
        })

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id or "Unknown",
            given_name=given_name,
            family_name=family_name,
            email=email,
            legal_sex=legal_sex,
            phone_number=phone_number,
            academic_program=academic_program,
            academic_track=academic_track,
            intended_major=intended_major,
            dietary_requirements=dietary_requirements,
            housing_selection=housing_selection,
            **bool_fields
        )

        db_request = create_db_record(
            models.PathwayProgramsNextSteps,
            ucf_id or "Unknown",
            given_name,
            family_name,
            "Pathway Programs Next Steps",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/pathway-programs-next-steps/", response_model=List[schemas.PathwayProgramsNextSteps])
def get_pathway_programs_next_steps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Pathway Programs Next Steps requests"""
    try:
        requests = db.query(models.PathwayProgramsNextSteps).offset(
            skip).limit(limit).all()
        return requests
    except Exception as e:
        print(
            f"Error retrieving Pathway Programs Next Steps requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving Pathway Programs Next Steps requests: {str(e)}")


@router.delete("/pathway-programs-next-steps/{request_id}", status_code=204)
def delete_pathway_programs_next_steps_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Pathway Programs Next Steps request"""
    try:
        request = db.query(models.PathwayProgramsNextSteps).filter(
            models.PathwayProgramsNextSteps.id == request_id).first()

        if not request:
            raise HTTPException(
                status_code=404, detail="Pathway Programs Next Steps request not found")

        db.delete(request)
        db.commit()

        return {"message": "Pathway Programs Next Steps request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Pathway Programs Next Steps request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Pathway Programs Next Steps request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Pathway Programs Next Steps requests: {str(e)}")


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
        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id or "Unknown",
            given_name=given_name,
            family_name=family_name,
            email=ucf_email_address,
            sevis_id=sevis_id,
            visa_type=visa_type,
            street_address=street_address,
            apartment_number=apartment_number,
            city=city,
            state=state,
            postal_code=postal_code,
            secondary_email_address=secondary_email_address,
            us_telephone_number=us_telephone_number,
            academic_level=academic_level,
            academic_program_major=academic_program_major,
            rcl_term=rcl_term,
            rcl_year=rcl_year,
            desired_credits=desired_credits,
            in_person_credits=in_person_credits,
            rcl_reason=rcl_reason
        )

        # Create and commit DB record
        db_request = create_db_record(
            models.ReducedCourseLoadRequest,
            ucf_id or "Unknown",
            given_name,
            family_name,
            "Reduced Course Load Request",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reduced-course-load/", response_model=List[schemas.ReducedCourseLoadRequest])
def get_reduced_course_load_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Reduced Course Load Requests"""
    try:
        requests = db.query(models.ReducedCourseLoadRequest).offset(
            skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving Reduced Course Load Requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving Reduced Course Load Requests: {str(e)}")


@router.delete("/reduced-course-load/{request_id}", status_code=204)
def delete_reduced_course_load_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Reduced Course Load Request"""
    try:
        request = db.query(models.ReducedCourseLoadRequest).filter(
            models.ReducedCourseLoadRequest.id == request_id).first()

        if not request:
            raise HTTPException(
                status_code=404, detail="Reduced Course Load Request not found")

        db.delete(request)
        db.commit()

        return {"message": "Reduced Course Load Request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Reduced Course Load Request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Reduced Course Load Request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Reduced Course Load Requests: {str(e)}")


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

    # File uploads
    admission_letter: UploadFile = File(None),

    db: Session = Depends(get_db)
):
    """Create a new Global Transfer Out Request"""
    try:
        # Convert booleans
        bool_fields = convert_multiple_bools({
            "understanding_sevis_release": understanding_sevis_release,
            "permission_to_communicate": permission_to_communicate,
            "understanding_work_authorization": understanding_work_authorization,
            "understanding_financial_obligations": understanding_financial_obligations
        })
        # Save admission letter if provided
        admission_letter_path = await save_upload_file(
            admission_letter,
            UPLOAD_PATHS.get("global_transfer_out",
                             "uploads/global_transfer_out"),
            ucf_id or "Unknown"
        )

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id or "Unknown",
            given_name=given_name,
            family_name=family_name,
            admission_letter_path=admission_letter_path,
            email=ucf_email_address,
            sevis_id=sevis_id,
            visa_type=visa_type,
            street_address=street_address,
            apartment_number=apartment_number,
            city=city,
            state=state,
            postal_code=postal_code,
            secondary_email_address=secondary_email_address,
            us_telephone_number=us_telephone_number,
            ucf_education_level=ucf_education_level,
            campus_employment=campus_employment,
            new_school_name=new_school_name,
            new_school_start_date=new_school_start_date,
            desired_sevis_release_date=desired_sevis_release_date,
            new_school_international_advisor_name=new_school_international_advisor_name,
            new_school_international_advisor_email=new_school_international_advisor_email,
            new_school_international_advisor_phone=new_school_international_advisor_phone,
            **bool_fields
        )

        # Create and commit DB record
        db_request = create_db_record(
            models.GlobalTransferOutRequest,
            ucf_id or "Unknown",
            given_name,
            family_name,
            "Global Transfer Out Request",
            form_data
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/global-transfer-out/", response_model=List[schemas.GlobalTransferOutRequest])
def get_global_transfer_out_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Global Transfer Out Requests"""
    try:
        requests = db.query(models.GlobalTransferOutRequest).offset(
            skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving Global Transfer Out Requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving Global Transfer Out Requests: {str(e)}")


@router.delete("/global-transfer-out/{request_id}", status_code=204)
def delete_global_transfer_out_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Global Transfer Out Request"""
    try:
        request = db.query(models.GlobalTransferOutRequest).filter(
            models.GlobalTransferOutRequest.id == request_id).first()

        if not request:
            raise HTTPException(
                status_code=404, detail="Global Transfer Out Request not found")

        db.delete(request)
        db.commit()

        return {"message": "Global Transfer Out Request deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Global Transfer Out Request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Global Transfer Out Request: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail=f"Error deleting Global Transfer Out Requests: {str(e)}")


@router.post("/ucf-global-records-release/", response_model=schemas.UCFGlobalRecordsReleaseForm)
async def create_ucf_global_records_release_form(
    request: schemas.UCFGlobalRecordsReleaseFormCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new UCF Global Records Release Form submission.

    This endpoint handles the submission of the UCF Global Records Release Authorization Form.
    It validates the incoming request, creates a new database record, and returns the created form.

    Args:
        request (UCFGlobalRecordsReleaseFormCreate): The form submission data
        db (Session): Database session dependency

    Returns:
        UCFGlobalRecordsReleaseForm: The created form record with assigned ID and submission details
    """
    # Prepare the form data for storage - extract only the nested form_data if it exists
    # If the request has a nested form_data field, use that; otherwise use the entire request
    if hasattr(request, 'form_data') and request.form_data:
        form_data = request.form_data if isinstance(
            request.form_data, dict) else request.form_data.__dict__
    else:
        # Fallback: exclude the basic fields and store the rest as form_data
        form_data = request.model_dump(
            exclude={"student_name", "student_id", "program"})

    # Determine student identifiers with fallbacks
    student_id = request.student_id or request.ucf_id
    given_name = request.given_name or ""
    family_name = request.family_name or ""
    program = request.program or "UCF Global Records Release"

    # Create and commit DB record
    db_request = create_db_record(
        models.UCFGlobalRecordsReleaseForm,
        student_id,
        given_name,
        family_name,
        program,
        form_data
    )

    return commit_to_db(
        db,
        db_request,
        f"Created UCF Global Records Release Form with ID: {db_request.id}"
    )


@router.get("/ucf-global-records-release/", response_model=List[schemas.UCFGlobalRecordsReleaseForm])
def get_ucf_global_records_release_forms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve UCF Global Records Release Forms"""
    try:
        requests = db.query(models.UCFGlobalRecordsReleaseForm).offset(
            skip).limit(limit).all()
        return requests
    except Exception as e:
        print(f"Error retrieving UCF Global Records Release Forms: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving UCF Global Records Release Forms: {str(e)}")


@router.delete("/ucf-global-records-release/{request_id}", status_code=204)
def delete_ucf_global_records_release_form(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific UCF Global Records Release Form"""
    try:
        request = db.query(models.UCFGlobalRecordsReleaseForm).filter(
            models.UCFGlobalRecordsReleaseForm.id == request_id).first()

        if not request:
            raise HTTPException(
                status_code=404, detail="UCF Global Records Release Form not found")

        db.delete(request)
        db.commit()

        return {"message": "UCF Global Records Release Form deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting UCF Global Records Release Form: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting UCF Global Records Release Form: {str(e)}")


@router.delete("/ucf-global-records-release/", status_code=204)
def delete_all_ucf_global_records_release_forms(db: Session = Depends(get_db)):
    """Delete all UCF Global Records Release Forms"""
    try:
        db.query(models.UCFGlobalRecordsReleaseForm).delete()
        db.commit()
        return {"message": "All UCF Global Records Release Forms deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting UCF Global Records Release Forms: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting UCF Global Records Release Forms: {str(e)}")

# Virtual Check In Routes


@router.post("/virtual-checkin/", response_model=schemas.VirtualCheckInRequest)
async def create_virtual_checkin_request(
    # Personal Information
    ucf_id: str = Form(...),
    sevis_id: str = Form(None),
    given_name: str = Form(...),
    family_name: str = Form(...),
    visa_type: str = Form(...),  # F-1 or J-1

    # U.S. Address (THIS IS REQUIRED)
    street_address: str = Form(...),
    apartment_number: str = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    postal_code: str = Form(...),
    us_telephone: str = Form(None),
    has_us_telephone: bool = Form(True),
    ucf_email: str = Form(...),
    secondary_email: str = Form(None),

    # Emergency Contact
    emergency_given_name: str = Form(None),
    emergency_family_name: str = Form(None),
    emergency_relationship: str = Form(None),
    emergency_street_address: str = Form(None),
    emergency_city: str = Form(None),
    emergency_state_province: str = Form(None),
    emergency_country: str = Form(None),
    emergency_postal_code: str = Form(None),
    emergency_us_telephone: str = Form(None),
    emergency_non_us_telephone: str = Form(None),
    emergency_has_us_telephone: bool = Form(True),
    emergency_has_non_us_telephone: bool = Form(True),
    emergency_email: str = Form(None),

    # Required Documents
    visa_notice_of_action: UploadFile = File(None),
    form_i94: UploadFile = File(None),
    passport: UploadFile = File(None),
    other_documents: UploadFile = File(None),

    # Dependent(s) Information - placeholder for future expansion
    has_dependents: bool = Form(False),

    # Submission
    authorization_checked: bool = Form(...),

    # Remarks
    remarks: str = Form(None),

    db: Session = Depends(get_db)
):
    """Create a new Virtual Check In Request with file uploads"""
    try:
        # Save all files with student ID
        file_paths = await save_multiple_files(
            files_dict={
                "visa_notice_of_action": visa_notice_of_action,
                "form_i94": form_i94,
                "passport": passport,
                "other_documents": other_documents
            },
            destination_dir=UPLOAD_PATHS["virtual_checkin"],
            ucf_id=ucf_id
        )

        # Create form data
        form_data = create_form_data_dict(
            ucf_id=ucf_id,
            given_name=given_name,
            family_name=family_name,
            email=ucf_email,
            sevis_id=sevis_id,
            visa_type=visa_type,
            street_address=street_address,
            apartment_number=apartment_number,
            city=city,
            state=state,
            postal_code=postal_code,
            us_telephone=us_telephone,
            has_us_telephone=has_us_telephone,
            secondary_email=secondary_email,
            emergency_given_name=emergency_given_name,
            emergency_family_name=emergency_family_name,
            emergency_relationship=emergency_relationship,
            emergency_street_address=emergency_street_address,
            emergency_city=emergency_city,
            emergency_state_province=emergency_state_province,
            emergency_country=emergency_country,
            emergency_postal_code=emergency_postal_code,
            emergency_us_telephone=emergency_us_telephone,
            emergency_non_us_telephone=emergency_non_us_telephone,
            emergency_has_us_telephone=emergency_has_us_telephone,
            emergency_has_non_us_telephone=emergency_has_non_us_telephone,
            emergency_email=emergency_email,
            has_dependents=has_dependents,
            authorization_checked=authorization_checked,
            **file_paths
        )

        # Create and commit DB record
        db_request = create_db_record(
            models.VirtualCheckInRequest,
            ucf_id, given_name, family_name,
            "Virtual Check In",
            form_data,
            remarks=remarks
        )

        return commit_to_db(db, db_request)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/virtual-checkin/", response_model=List[schemas.VirtualCheckInRequest])
def get_virtual_checkin_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve Virtual Check In Requests"""
    try:
        requests = db.query(models.VirtualCheckInRequest).offset(
            skip).limit(limit).all()
        print(f"Returning {len(requests)} Virtual Check In requests")
        return requests
    except Exception as e:
        print(f"Error retrieving Virtual Check In requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving Virtual Check In requests: {str(e)}")


@router.get("/virtual-checkin/{request_id}", response_model=schemas.VirtualCheckInRequest)
def get_virtual_checkin_request(request_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific Virtual Check In Request"""
    try:
        db_request = db.query(models.VirtualCheckInRequest).filter(
            models.VirtualCheckInRequest.id == request_id).first()
        if db_request is None:
            raise HTTPException(
                status_code=404, detail="Virtual Check In request not found")
        print(f"Returning Virtual Check In request with ID: {request_id}")
        return db_request
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving Virtual Check In request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving Virtual Check In request: {str(e)}")


@router.delete("/virtual-checkin/{request_id}", status_code=204)
def delete_virtual_checkin_request(request_id: int, db: Session = Depends(get_db)):
    """Delete a specific Virtual Check In Request"""
    try:
        db_request = db.query(models.VirtualCheckInRequest).filter(
            models.VirtualCheckInRequest.id == request_id).first()
        if db_request is None:
            raise HTTPException(
                status_code=404, detail="Virtual Check In request not found")

        db.delete(db_request)
        db.commit()
        print(f"Deleted Virtual Check In request ID: {request_id}")
        return {"message": "Virtual Check In request deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting Virtual Check In request: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Virtual Check In request: {str(e)}")


@router.delete("/virtual-checkin/", status_code=204)
def delete_all_virtual_checkin_requests(db: Session = Depends(get_db)):
    """Delete all Virtual Check In Requests"""
    try:
        count = db.query(models.VirtualCheckInRequest).count()
        db.query(models.VirtualCheckInRequest).delete()
        db.commit()
        print(f"Deleted {count} Virtual Check In requests")
        return {"message": f"Successfully deleted {count} Virtual Check In requests"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting Virtual Check In requests: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error deleting Virtual Check In requests: {str(e)}")
