import subprocess
import sys
import time
import os

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

print("==========================================================================")
print("Starting HBI-TGA Architecture (Trustworthy Generative AI Platform)...")
print("==========================================================================")

base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
frontend_dir = os.path.join(base_dir, "frontend")

# Start FastAPI Backend
print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000...")
backend_process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd=backend_dir
)

time.sleep(2)

# Start Vite React Frontend
print("\n[2/2] Starting React Vite Frontend on http://localhost:5173...")
frontend_process = subprocess.Popen(
    "npm run dev",
    shell=True,
    cwd=frontend_dir
)

print("\n==========================================================================")
print("HBI-TGA Platform is up and running!")
print("   - Web UI:       http://localhost:5173")
print("   - API Docs:     http://127.0.0.1:8000/docs")
print("   - Health Check: http://127.0.0.1:8000/api/health")
print("==========================================================================")

try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("\nStopping HBI-TGA servers...")
    backend_process.terminate()
    frontend_process.terminate()
