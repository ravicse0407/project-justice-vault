import os
import sys
from pathlib import Path

# Add project root and lambda task paths to sys.path
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
for p in [str(ROOT_DIR), str(CURRENT_DIR), "/var/task", "/var/task/api"]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.app.main import app

# Support both native ASGI (app) and AWS Lambda / Vercel Serverless (handler)
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except Exception:
    handler = app

__all__ = ["app", "handler"]
