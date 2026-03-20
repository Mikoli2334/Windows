from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import WindowType
from ..schemas import WindowTypeOut, PriceCalculation, PriceResult
from ..services import calculate_price

router = APIRouter()


@router.get("/types", response_model=List[WindowTypeOut])
def get_window_types(db: Session = Depends(get_db)):
    types = db.query(WindowType).all()
    if not types:
        # Seed default data
        defaults = [
            WindowType(
                name="Одностворчатое",
                slug="single",
                description="Классическое одностворчатое окно. Идеально для небольших проёмов.",
                base_price=45.0,
                image_url="/images/single.svg",
                features={"sections": 1, "max_width": 900, "max_height": 1500}
            ),
            WindowType(
                name="Двухстворчатое",
                slug="double",
                description="Двухстворчатое окно — самый популярный вариант для жилых помещений.",
                base_price=50.0,
                image_url="/images/double.svg",
                features={"sections": 2, "max_width": 1500, "max_height": 1600}
            ),
            WindowType(
                name="Трёхстворчатое",
                slug="triple",
                description="Трёхстворчатое окно для широких проёмов и панорамного вида.",
                base_price=55.0,
                image_url="/images/triple.svg",
                features={"sections": 3, "max_width": 2400, "max_height": 1600}
            ),
            WindowType(
                name="Балконный блок",
                slug="balcony",
                description="Балконная дверь с окном — комплексное решение для выхода на балкон.",
                base_price=65.0,
                image_url="/images/balcony.svg",
                features={"sections": 2, "max_width": 2100, "max_height": 2200, "has_door": True}
            ),
            WindowType(
                name="Панорамное",
                slug="panoramic",
                description="Панорамное остекление от пола до потолка для максимального света.",
                base_price=80.0,
                image_url="/images/panoramic.svg",
                features={"sections": 4, "max_width": 3000, "max_height": 2500}
            ),
            WindowType(
                name="Арочное",
                slug="arched",
                description="Арочное окно для эксклюзивного дизайна фасада.",
                base_price=90.0,
                image_url="/images/arched.svg",
                features={"sections": 1, "max_width": 1200, "max_height": 1800, "arched": True}
            ),
        ]
        for wt in defaults:
            db.add(wt)
        db.commit()
        types = db.query(WindowType).all()
    return types


@router.post("/calculate-price", response_model=PriceResult)
def calc_price(data: PriceCalculation, db: Session = Depends(get_db)):
    wt = db.query(WindowType).filter(WindowType.id == data.window_type_id).first()
    if not wt:
        raise HTTPException(status_code=404, detail="Тип окна не найден")

    result = calculate_price(
        base_price=wt.base_price,
        width=data.width,
        height=data.height,
        sections=data.sections,
        opening_type=data.opening_type,
        glass_type=data.glass_type,
        profile_type=data.profile_type,
        has_mosquito_net=data.has_mosquito_net,
        has_windowsill=data.has_windowsill,
        windowsill_depth=data.windowsill_depth,
        has_slopes=data.has_slopes,
        quantity=data.quantity,
    )
    return result
