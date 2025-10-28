
from typing import Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime
from fastapi import UploadFile
import os
import uuid
from pathlib import Path
from sqlalchemy.orm import Session
from fastapi import HTTPException


# ============================================================================
# STRING/TYPE CONVERSION UTILITIES
# ============================================================================

def str_to_bool(value: Optional[str]) -> Optional[bool]:
    """Convert string representation to boolean. Used for form field conversions."""
    if value is None:
        return None
    return value.lower() in ['true', 'yes', '1', 'on']


def create_student_name(given_name: Optional[str], family_name: Optional[str]) -> str:
    """
    Create full student name from given_name and family_name.
    
    Args:
        given_name: Student's given/first name
        family_name: Student's family/last name
    
    Returns:
        Full name as "Given Family", or "Unknown" if both are None
    """
    if given_name and family_name:
        return f"{given_name} {family_name}".strip()
    return (given_name or family_name or "Unknown").strip()


# ============================================================================
# FILE HANDLING UTILITIES
# ============================================================================

async def save_upload_file(
    upload_file: UploadFile, 
    destination_dir: str,
    ucf_id: str  # REQUIRED - no Optional
) -> Optional[str]:
    """
    Save an uploaded file to student-specific subfolder and return its path.
    
    File Organization: uploads/form_name/ucf_id/filename.ext
    
    Args:
        upload_file: FastAPI UploadFile object
        destination_dir: Base directory path (e.g., "uploads/exit_forms")
        ucf_id: Student's UCF ID (REQUIRED - creates subfolder)
    
    Returns:
        Full path to saved file, or None if no file provided
        
    Example:
        path = await save_upload_file(file, "uploads/exit_forms", ucf_id="1234567")
        # Result: "uploads/exit_forms/1234567/a1b2c3d4-uuid.pdf"
    """
    if not upload_file or not upload_file.filename:
        return None
    
    # Always create student-specific subfolder with UCF ID
    full_destination = os.path.join(destination_dir, str(ucf_id))
    
    # Create directory structure including UCF ID subfolder
    Path(full_destination).mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(full_destination, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
    
    print(f"Saved file for student {ucf_id}: {file_path} (original: {upload_file.filename})")
    return file_path


def delete_file_if_exists(file_path: Optional[str]) -> bool:
    """
    Delete a file if it exists.
    
    Args:
        file_path: Path to file to delete
    
    Returns:
        True if file was deleted, False otherwise
    """
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
            return True
        except Exception as e:
            print(f"Error deleting file {file_path}: {str(e)}")
            return False
    return False


def delete_student_folder(destination_dir: str, ucf_id: str) -> bool:
    """
    Delete entire student folder and all files within it.
    Use this when deleting a student's form submission.
    
    Args:
        destination_dir: Base directory (e.g., "uploads/exit_forms")
        ucf_id: Student's UCF ID
    
    Returns:
        True if folder was deleted, False otherwise
        
    Example:
        # Deletes uploads/exit_forms/1234567/ and all files inside
        delete_student_folder("uploads/exit_forms", "1234567")
    """
    student_folder = os.path.join(destination_dir, str(ucf_id))
    
    if os.path.exists(student_folder):
        try:
            import shutil
            shutil.rmtree(student_folder)
            print(f"Deleted student folder: {student_folder}")
            return True
        except Exception as e:
            print(f"Error deleting folder {student_folder}: {str(e)}")
            return False
    return False


def delete_multiple_files(form_data: Dict[str, Any], file_field_names: list[str]) -> None:
    """
    Delete multiple individual files from form data.
    Note: Consider using delete_student_folder() instead for cleaner bulk deletion.
    
    Args:
        form_data: Dictionary containing form data with file paths
        file_field_names: List of field names that contain file paths
    """
    for field in file_field_names:
        file_path = form_data.get(field)
        if file_path:
            delete_file_if_exists(file_path)


# ============================================================================
# CONFIGURATION - Upload Directories
# ============================================================================

# Centralized file upload paths - makes it easy to change storage location
UPLOAD_PATHS = {
    "academic_training": "uploads/academic_training",
    "opt_requests": "uploads/opt_requests",
    "florida_statute": "uploads/florida_statute_101035",
    "leave_requests": "uploads/leave_requests",
    "opt_stem_applications": "uploads/opt_stem_applications",
    "exit_forms": "uploads/exit_forms",
    "virtual_checkin": "uploads/virtual_checkin",
}


# ============================================================================
# MULTIPLE FILE HANDLING
# ============================================================================

async def save_multiple_files(
    files_dict: Dict[str, UploadFile],
    destination_dir: str,
    ucf_id: str,  # REQUIRED - no Optional
    add_path_suffix: bool = True
) -> Dict[str, Optional[str]]:
    """
    Save multiple uploaded files to student-specific subfolder.
    
    File Organization: uploads/form_name/ucf_id/filename.ext
    All files for a student go in the same folder.
    
    Args:
        files_dict: Dictionary mapping field names to UploadFile objects
                   e.g., {"photo2x2": photo_file, "passport": passport_file}
        destination_dir: Base directory (e.g., "uploads/opt_requests")
        ucf_id: Student's UCF ID (REQUIRED - creates subfolder)
        add_path_suffix: If True, adds "_path" to field names in result
                        (default True for consistency with form_data)
    
    Returns:
        Dictionary mapping field names to saved file paths (or None if not uploaded)
        
    Example:
        file_paths = await save_multiple_files(
            files_dict={
                "photo2x2": photo2x2,
                "passport": passport,
                "i94": i94
            },
            destination_dir=UPLOAD_PATHS["opt_requests"],
            ucf_id="1234567"
        )
        # Result: {
        #   "photo2x2_path": "uploads/opt_requests/1234567/uuid-123.jpg",
        #   "passport_path": "uploads/opt_requests/1234567/uuid-456.pdf",
        #   "i94_path": None  # if not uploaded
        # }
        
    Usage in route:
        file_paths = await save_multiple_files(
            files_dict={"photo": photo, "passport": passport},
            destination_dir=UPLOAD_PATHS["opt_requests"],
            ucf_id=ucf_id
        )
        form_data.update(file_paths)  # Add all file paths to form_data
    """
    file_paths = {}
    
    for field_name, upload_file in files_dict.items():
        # Save file - ucf_id is always required
        file_path = await save_upload_file(upload_file, destination_dir, ucf_id=ucf_id)
        
        # Determine the key name for the result
        result_key = f"{field_name}_path" if add_path_suffix else field_name
        file_paths[result_key] = file_path
        
        if file_path:
            print(f"Saved {field_name} for student {ucf_id}: {file_path}")
    
    return file_paths


# ============================================================================
# BULK BOOLEAN CONVERSION
# ============================================================================

def convert_multiple_bools(fields_dict: Dict[str, Optional[str]]) -> Dict[str, Optional[bool]]:
    """
    Convert multiple string fields to booleans at once.
    Useful for forms with many checkbox/boolean fields.
    
    Args:
        fields_dict: Dictionary of field names and string values
                    e.g., {"enrolled": "true", "employed": "false"}
    
    Returns:
        Dictionary with same keys but boolean values
        
    Example:
        bool_values = convert_multiple_bools({
            "enrolled_full_time": enrolled_full_time,
            "employed_on_campus": employed_on_campus,
            "previously_authorized": previously_authorized,
        })
        # Result: {"enrolled_full_time": True, "employed_on_campus": False, ...}
        
        # Then use in form_data:
        form_data.update(bool_values)
    """
    return {key: str_to_bool(value) for key, value in fields_dict.items()}


# ============================================================================
# DATABASE OPERATIONS
# ============================================================================

def commit_to_db(db: Session, record, success_message: Optional[str] = None):
    """
    Add, commit, and refresh a database record with error handling.
    
    Args:
        db: Database session
        record: SQLAlchemy model instance to commit
        success_message: Optional message to print on success
    
    Returns:
        The refreshed record
        
    Raises:
        HTTPException: If database operation fails
        
    Example:
        db_request = models.ExitForm(...)
        return commit_to_db(
            db, 
            db_request, 
            f"Created Exit Form for {student_name} (ID: {db_request.id})"
        )
    """
    try:
        db.add(record)
        db.commit()
        db.refresh(record)
        
        if success_message:
            print(success_message)
        else:
            print(f"Successfully committed record ID: {record.id}")
            
        return record
    except Exception as e:
        db.rollback()
        print(f"Database commit error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

# ============================================================================
# COMMON FORM FIELDS DATA CLASS
# ============================================================================

@dataclass
class CommonFormFields:
    """
    Data class to hold the common fields present in all UCF Global forms.
    
    STANDARD FIELDS (present in nearly all forms):
    - ucf_id: Student's UCF ID (required, critical for production)
    - given_name: Student's given/first name
    - family_name: Student's family/last name
    - email: Primary email address (can be ucf_email, student_email, etc.)
    """
    ucf_id: str  # Required - critical field
    given_name: str  # Required in most forms
    family_name: str  # Required in most forms
    email: Optional[str] = None  # Primary email
    
    @property
    def student_name(self) -> str:
        """Generate full student name from given_name and family_name."""
        return create_student_name(self.given_name, self.family_name)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert to dictionary for JSON storage.
        
        Returns:
            Dictionary with all non-None fields
        """
        return {
            'ucf_id': self.ucf_id,
            'given_name': self.given_name,
            'family_name': self.family_name,
            'email': self.email
        }


# ============================================================================
# FORM DATA BUILDERS
# ============================================================================

def create_form_data_dict(
    ucf_id: str,
    given_name: str,
    family_name: str,
    email: Optional[str] = None,
    **additional_fields
) -> Dict[str, Any]:
    """
    Create a form_data dictionary with common fields and additional form-specific fields.
    
    Args:
        ucf_id: Student's UCF ID
        given_name: Student's given name
        family_name: Student's family name
        email: Primary email address
        **additional_fields: Any additional form-specific fields
    
    Returns:
        Complete form_data dictionary
    
    Example:
        form_data = create_form_data_dict(
            ucf_id="1234567",
            given_name="John",
            family_name="Smith",
            email="john.smith@ucf.edu",
            sevis_id="N0012345678",
            visa_type="F-1"
        )
    """
    form_data = {
        'ucf_id': ucf_id,
        'given_name': given_name,
        'family_name': family_name,
    }
    
    if email:
        form_data['email'] = email
    
    # Add all additional fields
    form_data.update(additional_fields)
    
    return form_data


def create_db_record(
    model_class,
    ucf_id: str,
    given_name: str,
    family_name: str,
    program: str,
    form_data: Dict[str, Any],
    **extra_fields
):
    """
    Create a database record instance with standard fields.
    
    Args:
        model_class: The SQLAlchemy model class (e.g., models.ExitForm)
        ucf_id: Student's UCF ID
        given_name: Student's given name
        family_name: Student's family name
        program: Program name string (e.g., "Exit Form")
        form_data: Dictionary containing all form data
        **extra_fields: Additional model-specific fields (e.g., comments="...", remarks="...")
    
    Returns:
        Database model instance ready to be added and committed
    
    Example:
        db_record = create_db_record(
            model_class=models.ExitForm,
            ucf_id="1234567",
            given_name="John",
            family_name="Smith",
            program="Exit Form",
            form_data=form_data,
            remarks="Some remarks here"
        )
    """
    student_name = create_student_name(given_name, family_name)
    
    record_data = {
        'student_name': student_name,
        'student_id': ucf_id,
        'program': program,
        'submission_date': datetime.now(),
        'status': 'pending',
        'form_data': form_data,
        **extra_fields
    }
    
    return model_class(**record_data)

