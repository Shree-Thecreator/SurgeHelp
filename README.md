# SurgeHelp

A disaster relief application boilerplate with a Next.js frontend and Python FastAPI backend.

## Structure

- `frontend/` — Next.js app with map-based danger zone detection and a text chat panel for nearby help.
- `backend/` — FastAPI server exposing emergency, nearby-person, and chat endpoints.

## Frontend setup

1. Open `frontend/`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Backend setup

1. Open `backend/`.
2. Create a Python virtual environment.
3. Run `pip install -r requirements.txt`.
4. Run `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.

## Notes

- The frontend calls the backend at `http://localhost:8000`.
- Danger zone detection and user matching are mocked for a starter implementation.
- Add third-party map or geolocation APIs once you have API keys.
