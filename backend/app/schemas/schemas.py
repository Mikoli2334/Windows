from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
import re


# ─────────────────────────────────────────────────────────────
# Phone helpers (Belarus)
# Accepts: +375291234567, 375291234567, 80291234567,
#          +375 (29) 123-45-67, etc.
# Normalizes to: +375291234567
# Operators: 25, 29, 33, 44
# ─────────────────────────────────────────────────────────────
BY_PHONE_RE = re.compile(r"^\+375(25|29|33|44)\d{7}$")

def normalize_by_phone(raw: str) -> str:
    if raw is None:
        return raw

    s = raw.strip()

    # remove spaces, brackets, dashes, etc. keep digits and +
    s = re.sub(r"[^\d+]", "", s)

    # 80XXXXXXXXX -> +375XXXXXXXXX
    if s.startswith("80"):
        s = "+375" + s[2:]

    # 375XXXXXXXXX -> +375XXXXXXXXX
    elif s.startswith("375"):
        s = "+" + s

    # If user typed without + but already 375...
    # (covered above), otherwise leave as is.

    return s

def validate_by_phone(v: str) -> str:
    v2 = normalize_by_phone(v)
    if not BY_PHONE_RE.match(v2):
        raise ValueError("Введите корректный белорусский номер телефона (пример: +375291234567)")
    return v2


class WindowTypeOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    base_price: float
    image_url: Optional[str] = None
    features: Optional[dict] = None

    class Config:
        from_attributes = True


class WindowConfigCreate(BaseModel):
    window_type_id: int
    width: int
    height: int
    sections: int = 1
    opening_type: str = "поворотно-откидное"
    glass_type: str = "двухкамерный"
    profile_type: str = "стандарт"
    color: str = "white"
    has_mosquito_net: bool = False
    has_windowsill: bool = False
    windowsill_depth: int = 0
    has_slopes: bool = False
    quantity: int = 1

    @field_validator("width")
    @classmethod
    def validate_width(cls, v):
        if v < 300 or v > 3000:
            raise ValueError("Ширина должна быть от 300 до 3000 мм")
        return v

    @field_validator("height")
    @classmethod
    def validate_height(cls, v):
        if v < 300 or v > 2500:
            raise ValueError("Высота должна быть от 300 до 2500 мм")
        return v


class WindowConfigOut(WindowConfigCreate):
    id: int
    calculated_price: Optional[float] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    client_address: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None
    configurations: List[WindowConfigCreate]

    @field_validator("client_phone")
    @classmethod
    def validate_phone(cls, v):
        return validate_by_phone(v)


class OrderOut(BaseModel):
    id: int
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    total_price: Optional[float] = None
    status: str
    created_at: datetime
    configurations: List[WindowConfigOut] = []

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    appointment_date: datetime
    appointment_type: str = "measuring"
    address: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("client_phone")
    @classmethod
    def validate_phone(cls, v):
        return validate_by_phone(v)


class AppointmentOut(BaseModel):
    id: int
    client_name: str
    client_phone: str
    appointment_date: datetime
    appointment_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        # чтобы контакты тоже были нормализованы
        return validate_by_phone(v)


class PriceCalculation(BaseModel):
    window_type_id: int
    width: int
    height: int
    sections: int = 1
    opening_type: str = "поворотно-откидное"
    glass_type: str = "двухкамерный"
    profile_type: str = "стандарт"
    has_mosquito_net: bool = False
    has_windowsill: bool = False
    windowsill_depth: int = 0
    has_slopes: bool = False
    quantity: int = 1


class PriceResult(BaseModel):
    base_price: float
    area_price: float
    options_price: float
    total_per_unit: float
    quantity: int
    total_price: float
    breakdown: dict

class ReviewCreate(BaseModel):
    name: str
    city: Optional[str] = None
    rating: int = 5
    text: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Введите имя")
        return v.strip()

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError("Отзыв должен содержать минимум 10 символов")
        return v.strip()

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Оценка должна быть от 1 до 5")
        return v


class ReviewOut(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    rating: int
    text: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True