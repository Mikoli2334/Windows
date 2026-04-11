from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import Review
from ..schemas import ReviewCreate, ReviewOut

router = APIRouter()


@router.get("", response_model=list[ReviewOut])
@router.get("/", response_model=list[ReviewOut], include_in_schema=False)
def get_reviews(
    limit: int | None = Query(default=None, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Review)
        .filter(Review.is_approved == True)
        .order_by(desc(Review.created_at))
    )

    if limit:
        query = query.limit(limit)

    return query.all()


@router.post("", response_model=ReviewOut)
@router.post("/", response_model=ReviewOut, include_in_schema=False)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    review = Review(
        name=data.name,
        city=data.city,
        rating=data.rating,
        text=data.text,
        is_approved=True,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review