from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import httpx

router = APIRouter()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")


async def send_telegram(text: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        # В проде лучше логировать, но не падать
        raise HTTPException(status_code=500, detail="Telegram settings are not configured")

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json=payload)
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Telegram send failed: {r.text}")


# ───── Schemas ─────
class ConstructorLead(BaseModel):
    name: str
    phone: str
    window_type: str
    width: int
    height: int
    quantity: int
    profile_type: Optional[str] = None
    glass_type: Optional[str] = None
    opening_type: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None


class ContactLead(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    message: Optional[str] = None


class AppointmentLead(BaseModel):
    name: str
    phone: str
    appointment_type: str
    appointment_date: str  # ISO
    city: str
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    notes: Optional[str] = None


# ───── Routes ─────
@router.post("/constructor")
async def lead_constructor(data: ConstructorLead):
    text = (
        "🪟 <b>Заявка из конструктора</b>\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📞 <b>Телефон:</b> {data.phone}\n"
        f"🧩 <b>Тип:</b> {data.window_type}\n"
        f"📐 <b>Размер:</b> {data.width}×{data.height} мм\n"
        f"🔢 <b>Кол-во:</b> {data.quantity}\n"
        + (f"🪟 <b>Профиль:</b> {data.profile_type}\n" if data.profile_type else "")
        + (f"🧊 <b>Стеклопакет:</b> {data.glass_type}\n" if data.glass_type else "")
        + (f"🔧 <b>Открывание:</b> {data.opening_type}\n" if data.opening_type else "")
        + (f"🎨 <b>Цвет:</b> {data.color}\n" if data.color else "")
        + (f"📝 <b>Комментарий:</b> {data.notes}\n" if data.notes else "")
    )
    await send_telegram(text)
    return {"ok": True}


@router.post("/contact")
async def lead_contact(data: ContactLead):
    text = (
        "💬 <b>Обратная связь</b>\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📞 <b>Телефон:</b> {data.phone}\n"
        + (f"✉️ <b>Email:</b> {data.email}\n" if data.email else "")
        + (f"📝 <b>Сообщение:</b>\n{data.message}\n" if data.message else "")
    )
    await send_telegram(text)
    return {"ok": True}


@router.post("/appointment")
async def lead_appointment(data: AppointmentLead):
    text = (
        "📅 <b>Запись на замер</b>\n"
        f"👤 <b>Имя:</b> {data.name}\n"
        f"📞 <b>Телефон:</b> {data.phone}\n"
        f"📌 <b>Тип:</b> {data.appointment_type}\n"
        f"🕒 <b>Дата/время:</b> {data.appointment_date}\n"
        f"🏙 <b>Город:</b> {data.city}\n"
        + (f"📍 <b>Адрес:</b> {data.address}\n" if data.address else "")
        + (f"✉️ <b>Email:</b> {data.email}\n" if data.email else "")
        + (f"📝 <b>Комментарий:</b>\n{data.notes}\n" if data.notes else "")
    )
    await send_telegram(text)
    return {"ok": True}