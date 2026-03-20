from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from ..database import get_db
from ..models import Appointment, ContactRequest
from ..schemas import AppointmentCreate, AppointmentOut, ContactCreate

router = APIRouter()


def _to_naive_utc(dt: datetime) -> datetime:
    """
    Приводим datetime к naive UTC (без tzinfo),
    чтобы корректно сравнивать/хранить в SQLite и не ловить TypeError.
    """
    if dt.tzinfo is None:
        # если пришло без таймзоны — считаем, что это уже UTC
        return dt
    return dt.astimezone(timezone.utc).replace(tzinfo=None)


@router.post("/", response_model=AppointmentOut)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    # ✅ Нормализуем дату (из ISO с Z приходит aware datetime)
    appointment_dt = _to_naive_utc(data.appointment_date)
    now_utc = datetime.utcnow()

    # Проверка что дата в будущем
    if appointment_dt <= now_utc:
        raise HTTPException(status_code=400, detail="Дата записи должна быть в будущем")

    # Проверка доступности слота (не более 3 записей на один час)
    slot_start = appointment_dt.replace(minute=0, second=0, microsecond=0)
    slot_end = slot_start + timedelta(hours=1)

    existing = (
        db.query(Appointment)
        .filter(
            Appointment.appointment_date >= slot_start,
            Appointment.appointment_date < slot_end,
            Appointment.status.in_(["pending", "confirmed"]),
        )
        .count()
    )

    if existing >= 3:
        raise HTTPException(status_code=409, detail="Выбранное время уже занято. Выберите другое время.")

    appointment = Appointment(
        client_name=data.client_name,
        client_phone=data.client_phone,
        client_email=data.client_email,
        appointment_date=appointment_dt,  # ✅ сохраняем нормализованную дату
        appointment_type=data.appointment_type,
        address=data.address,
        city=data.city,
        notes=data.notes,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/available-slots")
def get_available_slots(date: str, db: Session = Depends(get_db)):
    """Получить доступные слоты на указанную дату."""
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте YYYY-MM-DD")

    now_utc = datetime.utcnow()

    slots = []
    for hour in range(9, 19):  # 9:00 - 18:00
        slot_time = target_date.replace(hour=hour, minute=0, second=0, microsecond=0)
        if slot_time < now_utc:
            continue

        booked = (
            db.query(Appointment)
            .filter(
                Appointment.appointment_date >= slot_time,
                Appointment.appointment_date < slot_time + timedelta(hours=1),
                Appointment.status.in_(["pending", "confirmed"]),
            )
            .count()
        )

        slots.append(
            {
                "time": slot_time.strftime("%H:%M"),
                "available": booked < 3,
                "booked_count": booked,
            }
        )

    return {"date": date, "slots": slots}


@router.post("/contact")
def create_contact_request(data: ContactCreate, db: Session = Depends(get_db)):
    contact = ContactRequest(
        name=data.name,
        phone=data.phone,
        email=data.email,
        message=data.message,
    )
    db.add(contact)
    db.commit()
    return {"message": "Заявка отправлена! Мы свяжемся с вами в ближайшее время."}