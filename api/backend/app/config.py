import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(str(BASE_DIR / ".env"))

class Settings:
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    APP_MODE: str = os.getenv("APP_MODE", "demo")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "justice_vault_hackathon_jwt_secret_2026_super_secure_key")
    STORAGE_ENCRYPTION_KEY: str = os.getenv("STORAGE_ENCRYPTION_KEY", "justice_vault_aes256_mock_key_32_bytes_lenovo")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./justice_vault.db")
    DATA_DIR: str = os.getenv("DATA_DIR", str(BASE_DIR / "backend" / "knowledge"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/tmp/uploads" if os.getenv("VERCEL") else str(BASE_DIR / "backend" / "uploads"))

settings = Settings()

try:
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
except OSError:
    pass
