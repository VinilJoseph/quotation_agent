import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from orchestrator import quote_agent
from database import DB_PATH

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestPayload(BaseModel):
    user_request: str

class ClientTemplateUpdate(BaseModel):
    default_template: str

@app.get("/clients")
async def get_clients():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, name, discount_tier, contact, tenant_info, default_template FROM clients")
    rows = c.fetchall()
    conn.close()
    clients = []
    for r in rows:
        clients.append({
            "id": r[0],
            "name": r[1],
            "discount_tier": r[2],
            "contact": r[3],
            "tenant_info": r[4],
            "default_template": r[5] or "executive"
        })
    return {"clients": clients}

@app.patch("/clients/{client_id}")
async def update_client_template(client_id: int, payload: ClientTemplateUpdate):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE clients SET default_template = ? WHERE id = ?", (payload.default_template, client_id))
    if c.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Client not found")
    conn.commit()
    conn.close()
    return {"status": "ok", "client_id": client_id, "default_template": payload.default_template}

@app.post("/generate")
async def generate(payload: RequestPayload):
    # Initialize state with an empty logs array
    initial_state = {"user_request": payload.user_request, "logs": []}
    
    final_state = quote_agent.invoke(initial_state)
    
    client_name = final_state.get("client_name", "")
    default_template = "executive"
    if client_name:
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT default_template FROM clients WHERE name LIKE ?", (f"%{client_name}%",))
            res = c.fetchone()
            conn.close()
            if res and res[0]:
                default_template = res[0]
        except Exception:
            pass

    # Return quotation, execution trace logs, and client default template
    return {
        "quotation": final_state["final_quotation"],
        "logs": final_state["logs"],
        "client_name": client_name,
        "default_template": default_template
    }