import os
import sys
import traceback
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent

# Inject paths into sys.path
candidate_paths = [
    str(CURRENT_DIR),
    str(CURRENT_DIR / "backend"),
    str(ROOT_DIR),
    "/var/task",
    "/var/task/api",
    "/var/task/api/backend"
]
for p in candidate_paths:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    try:
        from backend.app.main import app
    except ImportError:
        from app.main import app
except Exception as err:
    import json
    err_msg = str(err)
    err_trace = traceback.format_exc()

    try:
        from fastapi import FastAPI
        from fastapi.responses import JSONResponse
        app = FastAPI(title="Justice Vault Startup Error Handler")

        @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
        async def catch_all_error(path: str):
            return JSONResponse(
                status_code=500,
                content={
                    "status": "startup_failed",
                    "error": err_msg,
                    "traceback": err_trace.splitlines(),
                    "sys_path": sys.path
                }
            )
    except Exception:
        def app(scope, receive, send):
            async def handler():
                await send({
                    'type': 'http.response.start',
                    'status': 500,
                    'headers': [(b'content-type', b'application/json')],
                })
                payload = json.dumps({
                    "status": "startup_failed",
                    "error": err_msg,
                    "traceback": err_trace.splitlines()
                }).encode('utf-8')
                await send({
                    'type': 'http.response.body',
                    'body': payload,
                })
            return handler()

__all__ = ["app"]
