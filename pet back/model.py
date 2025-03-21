from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import List, Optional


class Location(BaseModel):
    lat: str
    lng: str

class Pet(BaseModel):
    userId: str
    name: str
    age: int
    type: str
    description: str
    sex: str
    photo_url: Optional[List[str]] = None
    vaccination: Optional[str] = None
    isDeleted: bool = False
    address:str
    

class User(BaseModel):
    name: str
    phone: int
    email: str
    password: str
    isAdmin: bool = False  # admin
    isDeleted: bool = False


class UserLogings(BaseModel):
    userId: str
    token: str
    loginTime: datetime


class ContactUsRequest(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str
