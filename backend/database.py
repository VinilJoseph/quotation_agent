import os
import sqlite3
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document

DB_PATH = os.path.join(os.path.dirname(__file__), 'pax_erp.db')

def init_sql_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS clients 
                 (id INTEGER PRIMARY KEY, name TEXT, discount_tier TEXT, contact TEXT, tenant_info TEXT, default_template TEXT)''')
    
    try:
        c.execute("ALTER TABLE clients ADD COLUMN tenant_info TEXT")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE clients ADD COLUMN default_template TEXT DEFAULT 'executive'")
    except sqlite3.OperationalError:
        pass

    # Insert mock UAE enterprise data if empty
    c.execute("INSERT OR IGNORE INTO clients (id, name, discount_tier, contact, default_template) VALUES (1, 'ADNOC', 'Gold - 20% Discount', 'Tariq Al Jaber', 'executive')")
    c.execute("INSERT OR IGNORE INTO clients (id, name, discount_tier, contact, default_template) VALUES (2, 'Emirates Steel', 'Silver - 10% Discount', 'Sara Ahmed', 'technical')")
    conn.commit()
    conn.close()

def init_rag_db():
    texts = [
        "Product: Enterprise ERP License - Base price $10,000/yr. Standard support included.",
        "Product: HR Module Add-on - Base price $5,000/yr. Requires Enterprise License.",
        "Terms: Gold tier clients receive 24/7 dedicated support. Standard payment terms are Net 30.",
        "Implementation fee is a flat $2,000 for all new software modules."
    ]
    
    # Wrap text in LangChain Document objects
    docs = [Document(page_content=t) for t in texts]
    
    # Initialize the pure-Python BM25 retriever (No PyTorch required)
    retriever = BM25Retriever.from_documents(docs)
    retriever.k = 2  # Return the top 2 most relevant results
    
    return retriever

# Initialize immediately when imported
init_sql_db()
rag_retriever = init_rag_db()