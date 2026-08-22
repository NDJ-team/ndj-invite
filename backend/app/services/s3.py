import os
import uuid
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def ensure_bucket():
    UPLOAD_DIR.mkdir(exist_ok=True)


def generate_object_key(invitation_id: str, filename: str) -> str:
    safe_name = filename.replace(" ", "_").replace("/", "_").replace("\\", "_")
    return f"{invitation_id}/{uuid.uuid4().hex}_{safe_name}"


def upload_file(file_bytes: bytes, object_key: str, content_type: str = "image/jpeg") -> str:
    file_path = UPLOAD_DIR / object_key
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_bytes(file_bytes)
    return f"/uploads/{object_key}"


def delete_file(object_key: str):
    file_path = UPLOAD_DIR / object_key
    if file_path.exists():
        file_path.unlink()
