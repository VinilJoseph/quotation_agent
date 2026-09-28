import os
import operator
from typing import TypedDict, Annotated, Literal
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from tools import fetch_client_details, fetch_product_specs

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

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

# 1. Update State to include routing decisions
class QuoteState(TypedDict):
    user_request: str
    client_name: str
    product_query: str
    sql_context: str
    rag_context: str
    final_quotation: str
    route: str # Tracks the decision made by the classifier
    logs: Annotated[list[str], operator.add]

# 2. The Classifier Node
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
    
    # Send tool usage log
    log_msg = f"🧭 Classifier Node: Analyzed request and routed to -> [{decision.upper()}]"
    return {"route": decision, "logs": [log_msg]}

# 3. The Analyzer Node (Only used for full quotes)
def analyzer_node(state: QuoteState):
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

# 4. Tool Nodes
def sql_node(state: QuoteState):
    # If skipping the analyzer (sql_only route), use the raw request as the search query
    search_term = state.get("client_name") if state.get("client_name") else state["user_request"]
    client_data = fetch_client_details(search_term)
    
    log_msg = f"💾 SQL Tool: Queried ERP database."
    return {"sql_context": client_data, "logs": [log_msg]}

def rag_node(state: QuoteState):
    # If skipping the analyzer (rag_only route), use the raw request as the search query
    search_term = state.get("product_query") if state.get("product_query") else state["user_request"]
    pricing_data = fetch_product_specs(search_term)
    
    log_msg = f"📚 RAG Tool: Searched KB for pricing info."
    return {"rag_context": pricing_data, "logs": [log_msg]}

# 5. Generator Nodes (Handling the different routes)
def general_chat_node(state: QuoteState):
    """Handles simple greetings without using tools."""
    prompt = f"Respond politely as a Pax ERP AI Assistant to this message: '{state['user_request']}'"
    response = llm.invoke(prompt).content
    log_msg = f"💬 Chat Agent: Handled general greeting."
    return {"final_quotation": response, "logs": [log_msg]}

def info_responder_node(state: QuoteState):
    """Handles requests that just asked for info (SQL only or RAG only)."""
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
    """Writes the full quotation."""
    prompt = f"""
    Write a professional commercial quotation.
    Client Details: {state['sql_context']}
    Product Pricing: {state['rag_context']}
    Format nicely in Markdown.
    """
    quote = llm.invoke(prompt).content
    log_msg = f"✍️ Quote Agent: Drafted final markdown quotation."
    return {"final_quotation": quote, "logs": [log_msg]}

# 6. The Router Function (Defines where to go based on the classifier's decision)
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

# 7. Build the Graph
workflow = StateGraph(QuoteState)

# Add all nodes
workflow.add_node("classifier", classifier_node)
workflow.add_node("analyzer", analyzer_node)
workflow.add_node("sql_fetcher", sql_node)
workflow.add_node("rag_fetcher", rag_node)
workflow.add_node("chat_responder", general_chat_node)
workflow.add_node("info_responder", info_responder_node)
workflow.add_node("quote_generator", quote_generator_node)

# Add Edges
workflow.add_edge(START, "classifier")

# Conditional Routing from the Classifier
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

# Flow for 'generate_quote'
workflow.add_edge("analyzer", "sql_fetcher")
workflow.add_edge("sql_fetcher", "rag_fetcher")
workflow.add_edge("rag_fetcher", "quote_generator")

# Flow for 'sql_only' and 'rag_only'
workflow.add_edge("sql_fetcher", "info_responder")  # Note: in a full quote, this edge gets overridden by the deterministic path, but for a simple MVP graph we ensure info_responder catches single queries.

# To handle the graph complexity safely in LangGraph, we define explicit routing from the fetchers based on the original route.
def post_fetch_router(state: QuoteState) -> str:
    if state["route"] == "generate_quote":
        # If generating a quote, SQL goes to RAG, RAG goes to Quote Generator
        if state.get("sql_context") and not state.get("rag_context"):
             return "rag_fetcher"
        return "quote_generator"
    else:
        # If just answering a question, go to the info responder
        return "info_responder"

# We must remove the static edges for fetchers and use the post_fetch_router
# Remove these from above:
# workflow.add_edge("analyzer", "sql_fetcher") 
# workflow.add_edge("sql_fetcher", "rag_fetcher")
# workflow.add_edge("rag_fetcher", "quote_generator")

workflow.add_edge("analyzer", "sql_fetcher")

# After SQL, where do we go?
workflow.add_conditional_edges("sql_fetcher", post_fetch_router, {"rag_fetcher": "rag_fetcher", "info_responder": "info_responder"})

# After RAG, where do we go?
workflow.add_conditional_edges("rag_fetcher", post_fetch_router, {"quote_generator": "quote_generator", "info_responder": "info_responder"})

# End points
workflow.add_edge("chat_responder", END)
workflow.add_edge("info_responder", END)
workflow.add_edge("quote_generator", END)

quote_agent = workflow.compile()