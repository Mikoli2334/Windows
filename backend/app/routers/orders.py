from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Order, WindowConfiguration, WindowType
from ..schemas import OrderCreate, OrderOut
from ..services import calculate_price

router = APIRouter()


@router.post("/", response_model=OrderOut)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order = Order(
        client_name=order_data.client_name,
        client_phone=order_data.client_phone,
        client_email=order_data.client_email,
        client_address=order_data.client_address,
        city=order_data.city,
        notes=order_data.notes,
        status="new",
    )
    db.add(order)
    db.flush()

    total = 0.0
    for cfg in order_data.configurations:
        wt = db.query(WindowType).filter(WindowType.id == cfg.window_type_id).first()
        if not wt:
            raise HTTPException(status_code=400, detail=f"Тип окна {cfg.window_type_id} не найден")

        price_data = calculate_price(
            base_price=wt.base_price,
            width=cfg.width,
            height=cfg.height,
            sections=cfg.sections,
            opening_type=cfg.opening_type,
            glass_type=cfg.glass_type,
            profile_type=cfg.profile_type,
            color=cfg.color,
            has_mosquito_net=cfg.has_mosquito_net,
            has_windowsill=cfg.has_windowsill,
            windowsill_depth=cfg.windowsill_depth,
            has_slopes=cfg.has_slopes,
            quantity=cfg.quantity,
        )

        config = WindowConfiguration(
            order_id=order.id,
            window_type_id=cfg.window_type_id,
            width=cfg.width,
            height=cfg.height,
            sections=cfg.sections,
            opening_type=cfg.opening_type,
            glass_type=cfg.glass_type,
            profile_type=cfg.profile_type,
            color=cfg.color,
            has_mosquito_net=cfg.has_mosquito_net,
            has_windowsill=cfg.has_windowsill,
            windowsill_depth=cfg.windowsill_depth,
            has_slopes=cfg.has_slopes,
            quantity=cfg.quantity,
            calculated_price=price_data["total_price"],
        )
        db.add(config)
        total += price_data["total_price"]

    order.total_price = round(total, 2)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order
