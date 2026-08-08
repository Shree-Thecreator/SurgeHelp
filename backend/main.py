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

# Custom Local Zones (Supports both DANGER and SAFE types)
CUSTOM_MAP_ZONES = [
    {
        "id": "dz-manual-1",
        "title": "Severe Flood Alert (Kolkata)",
        "type": "DANGER",
        "severity": "CRITICAL",
        "coordinates": {"lat": 22.5726, "lng": 88.3639},
        "radius_meters": 4000
    },
    {
        "id": "sz-manual-1",
        "title": "High-Ground Safe Assembly Hub",
        "type": "SAFE",
        "coordinates": {"lat": 22.5850, "lng": 88.3750},
        "radius_meters": 2000
    }
]

# Relief, Food, and Medical Help Centers
RESOURCE_CENTERS = [
    {
        "id": "rc-1",
        "name": "Salt Lake Stadium Shelter",
        "category": "RELIEF_CENTER",
        "contact": "+91 9000000000",
        "coordinates": {"lat": 22.5700, "lng": 88.4020},
        "details": "Capacity: 1200 people. Clean drinking water & medical beds."
    },
    {
        "id": "fc-1",
        "name": "Central Emergency Ration Kitchen",
        "category": "FOOD_CENTER",
        "contact": "+91 9000000000",
        "coordinates": {"lat": 22.5650, "lng": 88.3550},
        "details": "Prepared meal packets and dry rations served 24/7."
    },
    {
        "id": "hc-1",
        "name": "Kolkata Rapid Response Medical Post",
        "category": "HELP_CENTER",
        "contact": "+91 9000000000",
        "coordinates": {"lat": 22.5780, "lng": 88.3680},
        "details": "Trauma care, basic first aid, and ambulance station."
    }
]

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

class NewMapZone(BaseModel):
    title: str
    type: str  # DANGER or SAFE
    severity: Optional[str] = "MEDIUM"  # CRITICAL, HIGH, MEDIUM, LOW
    latitude: float
    longitude: float
    radius_meters: int

class NewResourceCenter(BaseModel):
    name: str
    category: str  # RELIEF_CENTER, FOOD_CENTER, HELP_CENTER
    contact: str
    latitude: float
    longitude: float
    details: Optional[str] = ""

# --- ENDPOINTS ---

@app.get("/api/map-zones")
@app.get("/api/danger-zones")
async def get_map_zones():
    """
    Fetches real-time multi-disaster alerts from GDACS and combines them 
    with local danger & safe zones.
    """
    all_zones = list(CUSTOM_MAP_ZONES)

    try:
        gdacs_url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;TC;EQ;WF;VO"
        
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(gdacs_url)
            if resp.status_code == 200:
                data = resp.json()
                features = data.get("features", [])
                
                for feature in features[:25]:
                    props = feature.get("properties", {})
                    geometry = feature.get("geometry", {})
                    coords = geometry.get("coordinates", [0, 0])  # [lng, lat]
                    
                    event_type = props.get("eventtype", "DISASTER")
                    event_name = props.get("eventname", "Hazard Alert")
                    alert_level = str(props.get("alertlevel", "Green")).upper()
                    
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
                        "type": "DANGER",
                        "severity": severity,
                        "coordinates": {"lat": coords[1], "lng": coords[0]},
                        "radius_meters": radius
                    })
    except Exception as e:
        print("Warning: Failed to fetch live multi-disaster data from GDACS:", e)

    return {"status": "success", "data": all_zones}

@app.post("/api/map-zones")
async def create_map_zone(zone: NewMapZone):
    new_zone = {
        "id": f"zone-manual-{len(CUSTOM_MAP_ZONES) + 1}",
        "title": zone.title,
        "type": zone.type.upper(),
        "severity": zone.severity.upper() if zone.severity else "MEDIUM",
        "coordinates": {"lat": zone.latitude, "lng": zone.longitude},
        "radius_meters": zone.radius_meters
    }
    CUSTOM_MAP_ZONES.append(new_zone)

    await manager.broadcast({
        "type": "NEW_MAP_ZONE",
        "zone": new_zone
    })

    return {"status": "success", "data": new_zone}

@app.get("/api/resource-centers")
async def get_resource_centers():
    return {"status": "success", "data": RESOURCE_CENTERS}

@app.post("/api/resource-centers")
async def create_resource_center(center: NewResourceCenter):
    new_center = {
        "id": f"rc-manual-{len(RESOURCE_CENTERS) + 1}",
        "name": center.name,
        "category": center.category.upper(),
        "contact": center.contact,
        "coordinates": {"lat": center.latitude, "lng": center.longitude},
        "details": center.details
    }
    RESOURCE_CENTERS.append(new_center)

    await manager.broadcast({
        "type": "NEW_RESOURCE_CENTER",
        "center": new_center
    })

    return {"status": "success", "data": new_center}

@app.post("/api/emergency-sos")
async def trigger_sos(alert: EmergencyAlert):
    ai_assessment = analyze_emergency_with_ai(alert.message)

    sos_payload = {
        "type": "SOS_ALERT",
        "user_id": alert.user_id,
        "location": {"lat": alert.latitude, "lng": alert.longitude},
        "message": alert.message,
        "ai_assessment": ai_assessment
    }
    
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