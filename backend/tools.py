import sqlite3
from database import rag_retriever, DB_PATH

def fetch_client_details(client_name: str) -> str:
    """Fetch structured client details from SQL."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name, discount_tier, contact, default_template FROM clients WHERE name LIKE ?", (f"%{client_name}%",))
    result = c.fetchone()
    conn.close()
    
    if result:
        tmpl = result[3] if len(result) > 3 and result[3] else "executive"
        return f"Client Name: {result[0]} | Discount Tier: {result[1]} | Primary Contact: {result[2]} | Default Template: {tmpl}"
    return "Client not found in SQL database. Proceed without client discounts."

def fetch_product_specs(query: str) -> str:
    """Fetch product pricing and terms from the BM25 knowledge base."""
    # The retriever is already configured to return top 2 results
    docs = rag_retriever.invoke(query)
    return "\n".join([doc.page_content for doc in docs])