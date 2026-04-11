from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class WindowType(Base):
    __tablename__ = "window_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    image_url = Column(String(500))
    features = Column(JSON)  # {"soundproof": true, "energy_saving": true, ...}
    created_at = Column(DateTime, default=datetime.utcnow)


class WindowConfiguration(Base):
    __tablename__ = "window_configurations"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    window_type_id = Column(Integer, ForeignKey("window_types.id"), nullable=False)
    width = Column(Integer, nullable=False)  # mm
    height = Column(Integer, nullable=False)  # mm
    sections = Column(Integer, default=1)  # количество секций
    opening_type = Column(String(50))  # глухое, поворотное, откидное, поворотно-откидное
    glass_type = Column(String(50))  # однокамерный, двухкамерный, энергосберегающий
    profile_type = Column(String(50))  # эконом, стандарт, премиум
    color = Column(String(50), default="white")
    has_mosquito_net = Column(Boolean, default=False)
    has_windowsill = Column(Boolean, default=False)
    windowsill_depth = Column(Integer, default=0)  # mm
    has_slopes = Column(Boolean, default=False)
    quantity = Column(Integer, default=1)
    calculated_price = Column(Float)

    window_type = relationship("WindowType")
    order = relationship("Order", back_populates="configurations")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(200), nullable=False)
    client_phone = Column(String(20), nullable=False)
    client_email = Column(String(200))
    client_address = Column(Text)
    city = Column(String(100))
    total_price = Column(Float)
    status = Column(String(50), default="new")  # new, confirmed, measuring, production, installing, done
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    configurations = relationship("WindowConfiguration", back_populates="order")
    appointment = relationship("Appointment", back_populates="order", uselist=False)


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    client_name = Column(String(200), nullable=False)
    client_phone = Column(String(20), nullable=False)
    client_email = Column(String(200))
    appointment_date = Column(DateTime, nullable=False)
    appointment_type = Column(String(50))  # measuring, consultation, installation
    address = Column(Text)
    city = Column(String(100))
    notes = Column(Text)
    status = Column(String(50), default="pending")  # pending, confirmed, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="appointment")


class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(200))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    city = Column(String(100), nullable=True)
    rating = Column(Integer, nullable=False, default=5)
    text = Column(Text, nullable=False)
    is_approved = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)