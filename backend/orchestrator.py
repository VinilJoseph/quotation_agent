import os
import operator
from typing import TypedDict, Annotated, Literal
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from tools import fetch_client_details, fetch_product_specs

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Initialize LLM
llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
    model="openai/gpt-4o-mini",
    temperature=0,
    default_headers={
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Pax-ERP-Interview-MVP",
    }
)

# 1. State Definition
class QuoteState(TypedDict):
    user_request: str
    client_name: str
    product_query: str
    sql_context: str
    rag_context: str
    final_quotation: str
    route: str # Tracks the decision made by the classifier
    logs: Annotated[list[str], operator.add]

# 2. Nodes
def classifier_node(state: QuoteState):
    """Determines the user intent and routes the graph accordingly."""
    prompt = f"""
    Analyze the following user request and categorize it into one of these four categories:
    1. 'greeting': If it's just a hello or general chat (e.g., "Hi", "Who are you?").
    2. 'sql_only': If it ONLY asks for client details (e.g., "What is ADNOC's discount?").
    3. 'rag_only': If it ONLY asks for product info/pricing (e.g., "How much is the HR module?").
    4. 'generate_quote': If it asks to create a quote involving both a client AND a product.
    
    Request: '{state['user_request']}'
    
    Return ONLY the category name. Do not explain.
    """
    decision = llm.invoke(prompt).content.strip().lower()
    
    log_msg = f"🧭 Classifier Node: Analyzed request and routed to -> [{decision.upper()}]"
    return {"route": decision, "logs": [log_msg]}

def analyzer_node(state: QuoteState):
    """Extracts entity details for a full quotation request."""
    prompt = f"""
    Extract the client name and the product requested from this text: '{state['user_request']}'.
    Format exactly as: Client: [name] | Product: [product]
    """
    response = llm.invoke(prompt).content
    parts = response.split("|")
    client_name = parts[0].replace("Client:", "").strip() if len(parts) > 0 else "Unknown"
    product = parts[1].replace("Product:", "").strip() if len(parts) > 1 else "Unknown"
    
    log_msg = f"🧠 Analyzer Agent: Extracted Client -> '{client_name}', Product -> '{product}'"
    return {"client_name": client_name, "product_query": product, "logs": [log_msg]}

def sql_node(state: QuoteState):
    """Fetches structured data from the ERP database."""
    search_term = state.get("client_name") if state.get("client_name") else state["user_request"]
    client_data = fetch_client_details(search_term)
    
    log_msg = f"💾 SQL Tool: Queried ERP database."
    return {"sql_context": client_data, "logs": [log_msg]}

def rag_node(state: QuoteState):
    """Fetches unstructured data from the Vector/BM25 Knowledge Base."""
    search_term = state.get("product_query") if state.get("product_query") else state["user_request"]
    pricing_data = fetch_product_specs(search_term)
    
    log_msg = f"📚 RAG Tool: Searched KB for pricing info."
    return {"rag_context": pricing_data, "logs": [log_msg]}

def general_chat_node(state: QuoteState):
    """Handles simple greetings without using tools."""
    prompt = f"Respond politely as a Pax ERP AI Assistant to this message: '{state['user_request']}'"
    response = llm.invoke(prompt).content
    log_msg = f"💬 Chat Agent: Handled general greeting."
    return {"final_quotation": response, "logs": [log_msg]}

def info_responder_node(state: QuoteState):
    """Handles single-tool informational requests (SQL only or RAG only)."""
    prompt = f"""
    Answer the user's request: '{state['user_request']}'
    Using ONLY this data: 
    SQL Data: {state.get('sql_context', 'None')}
    RAG Data: {state.get('rag_context', 'None')}
    """
    response = llm.invoke(prompt).content
    log_msg = f"📝 Responder Agent: Formatted requested information."
    return {"final_quotation": response, "logs": [log_msg]}

def quote_generator_node(state: QuoteState):
    """Generates the final comprehensive quotation."""
    prompt = f"""
    Write a professional commercial quotation.
    
    Client Details: {state.get('sql_context', 'No client data provided.')}
    Product Pricing: {state.get('rag_context', 'No product data provided.')}
    
    Format nicely in Markdown.
    """
    quote = llm.invoke(prompt).content
    log_msg = f"✍️ Quote Agent: Drafted final markdown quotation."
    return {"final_quotation": quote, "logs": [log_msg]}

# 3. Routing Functions
def route_request(state: QuoteState) -> Literal["general_chat", "sql_only", "rag_only", "generate_quote"]:
    route = state["route"]
    if "greeting" in route:
        return "general_chat"
    elif "sql" in route:
        return "sql_only"
    elif "rag" in route:
        return "rag_only"
    else:
        return "generate_quote"

def post_fetch_router(state: QuoteState) -> str:
    # 1. If the user ONLY asked for RAG or SQL, force it to the info responder
    if state.get("route") != "generate_quote":
        return "info_responder"
        
    # 2. If generating a full quote, ensure both SQL and RAG run sequentially
    if state.get("sql_context") and not state.get("rag_context"):
         return "rag_fetcher"
         
    # 3. Once both are complete, go to the generator
    return "quote_generator"


# --- BUILD GRAPH ---
workflow = StateGraph(QuoteState)

# 1. Add Nodes
workflow.add_node("classifier", classifier_node)
workflow.add_node("analyzer", analyzer_node)
workflow.add_node("sql_fetcher", sql_node)
workflow.add_node("rag_fetcher", rag_node)
workflow.add_node("chat_responder", general_chat_node)
workflow.add_node("info_responder", info_responder_node)
workflow.add_node("quote_generator", quote_generator_node)

# 2. Initial Entry
workflow.add_edge(START, "classifier")

# 3. Branch 1: From the Classifier
workflow.add_conditional_edges(
    "classifier",
    route_request,
    {
        "general_chat": "chat_responder",
        "sql_only": "sql_fetcher",
        "rag_only": "rag_fetcher",
        "generate_quote": "analyzer"
    }
)

# 4. Branch 2: The Quote Pipeline
workflow.add_edge("analyzer", "sql_fetcher")

# 5. Branch 3: Post-Fetch Routing (CRITICAL: Do not use normal add_edge here)
workflow.add_conditional_edges(
    "sql_fetcher", 
    post_fetch_router, 
    {"rag_fetcher": "rag_fetcher", "info_responder": "info_responder"}
)

workflow.add_conditional_edges(
    "rag_fetcher", 
    post_fetch_router, 
    {"quote_generator": "quote_generator", "info_responder": "info_responder"}
)

# 6. End States
workflow.add_edge("chat_responder", END)
workflow.add_edge("info_responder", END)
workflow.add_edge("quote_generator", END)

quote_agent = workflow.compile()