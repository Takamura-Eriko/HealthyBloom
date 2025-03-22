from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=list[schemas.RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return crud.get_recipes(db)
