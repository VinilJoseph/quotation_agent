from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from orchestrator import quote_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestPayload(BaseModel):
    user_request: str

@app.post("/generate")
async def generate(payload: RequestPayload):
    # Initialize state with an empty logs array
    initial_state = {"user_request": payload.user_request, "logs": []}
    
    final_state = quote_agent.invoke(initial_state)
    
    # Return both the generated quote AND the tool execution trace
    return {
        "quotation": final_state["final_quotation"],
        "logs": final_state["logs"]
    }