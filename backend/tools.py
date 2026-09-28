import sqlite3
from database import rag_retriever

def fetch_client_details(client_name: str) -> str:
    """Fetch structured client details from SQL."""
    conn = sqlite3.connect('pax_erp.db')
    c = conn.cursor()
    c.execute("SELECT * FROM clients WHERE name LIKE ?", (f"%{client_name}%",))
    result = c.fetchone()
    conn.close()
    
    if result:
        return f"Client Name: {result[1]} | Discount Tier: {result[2]} | Primary Contact: {result[3]}"
    return "Client not found in SQL database. Proceed without client discounts."

def fetch_product_specs(query: str) -> str:
    """Fetch product pricing and terms from the BM25 knowledge base."""
    # The retriever is already configured to return top 2 results
    docs = rag_retriever.invoke(query)
    return "\n".join([doc.page_content for doc in docs])