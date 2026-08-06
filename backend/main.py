import os
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv
from google import genai


load_dotenv()

app = FastAPI(title="Disaster Relief API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_key = os.getenv("GOOGLE_API_KEY")
gemini_client = genai.Client(api_key=api_key) if api_key else None


CUSTOM_DANGER_ZONES = [
    {
        "id": "dz-manual-1",
        "title": "Severe Flood Alert (Kolkata)",
        "severity": "HIGH",
        "coordinates": {"lat": 22.5726, "lng": 88.3639},
        "radius_meters": 4000
    }
]

r
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections.values()):
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()


def analyze_emergency_with_ai(user_message: str) -> str:
    if not gemini_client:
        return "AI analysis unavailable (GOOGLE_API_KEY missing)."
    
    try:
        prompt = (
            f"You are a disaster emergency response assistant. Analyze the following user text: "
            f"'{user_message}'. Provide a 1-sentence assessment stating the threat priority level "
            f"(CRITICAL, HIGH, MEDIUM, LOW) and the recommended immediate action."
        )
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"AI Analysis Error: {str(e)}"



class EmergencyAlert(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    message: str

class AIAnalysisRequest(BaseModel):
    message: str

class NewDangerZone(BaseModel):
    title: str
    severity: str  
    latitude: float
    longitude: float
    radius_meters: int



@app.get("/api/danger-zones")
async def get_danger_zones():
    """
    Fetches real-time multi-disaster alerts (Floods, Cyclones, Wildfires, Earthquakes, Volcanoes)
    from GDACS (Global Disaster Alert & Coordination System) and combines with local admin zones.
    """
    all_zones = list(CUSTOM_DANGER_ZONES)

    try:
        
        gdacs_url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;TC;EQ;WF;VO"
        
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(gdacs_url)
            if resp.status_code == 200:
                data = resp.json()
                features = data.get("features", [])
                
                for feature in features[:25]:  # Top 25 global events
                    props = feature.get("properties", {})
                    geometry = feature.get("geometry", {})
                    coords = geometry.get("coordinates", [0, 0]) # [lng, lat]
                    
                    event_type = props.get("eventtype", "DISASTER") # FL, TC, EQ, WF, VO
                    event_name = props.get("eventname", "Hazard Alert")
                    alert_level = str(props.get("alertlevel", "Green")).upper() # RED, ORANGE, GREEN
                    
                    
                    severity = "CRITICAL" if alert_level == "RED" else "HIGH" if alert_level == "ORANGE" else "MEDIUM"
                    
                    
                    radius_map = {
                      "FL": 60000,   
                      "TC": 100000,  
                       "WF": 15000,   
                       "EQ": 20000,   
                       "VO": 25000,   
                    }
                    radius = radius_map.get(event_type, 6000)

                    all_zones.append({
                        "id": f"gdacs-{props.get('eventid', feature.get('id'))}",
                        "title": f"[{event_type}] {event_name} ({props.get('country', 'Global')})",
                        "severity": severity,
                        "coordinates": {"lat": coords[1], "lng": coords[0]},
                        "radius_meters": radius
                    })
    except Exception as e:
        print("Warning: Failed to fetch live multi-disaster data from GDACS:", e)

    return {"status": "success", "data": all_zones}


@app.post("/api/danger-zones")
async def create_danger_zone(zone: NewDangerZone):
    """
    Endpoint for rescue teams/admins to add new danger zones manually.
    Instantly broadcasts the new danger zone to all connected user maps via WebSocket.
    """
    new_zone = {
        "id": f"dz-manual-{len(CUSTOM_DANGER_ZONES) + 1}",
        "title": zone.title,
        "severity": zone.severity.upper(),
        "coordinates": {"lat": zone.latitude, "lng": zone.longitude},
        "radius_meters": zone.radius_meters
    }
    CUSTOM_DANGER_ZONES.append(new_zone)

    # Real-time WebSocket notification push
    await manager.broadcast({
        "type": "NEW_DANGER_ZONE",
        "zone": new_zone
    })

    return {"status": "success", "data": new_zone}


@app.post("/api/emergency-sos")
async def trigger_sos(alert: EmergencyAlert):
    # Analyze emergency via Gemini AI on backend
    ai_assessment = analyze_emergency_with_ai(alert.message)

    sos_payload = {
        "type": "SOS_ALERT",
        "user_id": alert.user_id,
        "location": {"lat": alert.latitude, "lng": alert.longitude},
        "message": alert.message,
        "ai_assessment": ai_assessment
    }
    
    # Broadcast alert + AI assessment to all connected clients
    await manager.broadcast(sos_payload)
    return {"status": "sos_sent", "payload": sos_payload}


@app.post("/api/analyze")
async def analyze_text(req: AIAnalysisRequest):
    analysis = analyze_emergency_with_ai(req.message)
    return {"status": "success", "analysis": analysis}

# --- WEBSOCKET FOR REAL-TIME CHAT & PUSH ALERTS ---

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            
            broadcast_payload = {
                "type": data.get("type", "CHAT"),
                "sender_id": client_id,
                "text": data.get("text", ""),
                "location": data.get("location", None)
            }
            await manager.broadcast(broadcast_payload)
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast({
            "type": "SYSTEM",
            "text": f"User {client_id} disconnected."
        })