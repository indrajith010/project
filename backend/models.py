from pydantic import BaseModel, Field
from typing import Optional

class Customer(BaseModel):
    id: Optional[str] = Field(default=None, description="Firestore document ID")
    name: str
    email: str
    phone: Optional[str] = None
    notes: Optional[str] = None
