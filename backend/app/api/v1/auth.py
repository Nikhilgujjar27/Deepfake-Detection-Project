import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token, require_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post('/register', response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    email_clean = user_in.email.strip().lower()
    username_clean = user_in.username.strip()

    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 6 characters long."
        )

    if db.query(User).filter(User.email == email_clean).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )
        
    if db.query(User).filter(User.username == username_clean).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken. Please choose another."
        )
        
    try:
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=email_clean,
            username=username_clean,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        access_token = create_access_token(data={"sub": db_user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        db.rollback()
        logger.error(f"Registration database error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create account at this time. Please try again later."
        )

@router.post('/login', response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    email_clean = user_in.email.strip().lower()
    db_user = db.query(User).filter(User.email == email_clean).first()
    
    if not db_user or not verify_password(user_in.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )
        
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get('/me', response_model=UserResponse)
def get_me(current_user: User = Depends(require_current_user)):
    return current_user
