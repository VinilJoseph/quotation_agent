"""
Script to populate the SQLite database with more UAE enterprise companies and tenant details.
Run with: python backend/populate_db.py
"""
import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "pax_erp.db")

def populate_clients():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Extended UAE enterprise clients with tenant details and default templates
    # Format: (id, name, discount_tier, contact, tenant_info, default_template)
    clients = [
        (1, "ADNOC", "Gold - 20% Discount", "Tariq Al Jaber", "Primary tenant: ADNOC Group HQ, Abu Dhabi. Subsidiaries: ADNOC Refining, ADNOC Gas, ADNOC Distribution. 50,000+ employees.", "executive"),
        (2, "Emirates Steel", "Silver - 10% Discount", "Sara Ahmed", "Primary tenant: Emirates Steel Industries, Abu Dhabi. Subsidiaries: Emirates Steel Welding, Emirates Steel Trading. 3,500+ employees.", "technical"),
        (3, "Etisalat", "Gold - 20% Discount", "Khalid Al Mansoori", "Primary tenant: Etisalat Group HQ, Abu Dhabi. Subsidiaries: Etisalat Misr, Etisalat Afghanistan, Mobily (KSA). 10,000+ employees.", "technical"),
        (4, "Dubai Electricity & Water Authority (DEWA)", "Platinum - 25% Discount", "Fatima Al Mazrouei", "Primary tenant: DEWA HQ, Dubai. Subsidiaries: DEWA Digital, Emirates Central Cooling Systems (Empower). 12,000+ employees.", "prestige"),
        (5, "Emirates Airlines", "Gold - 20% Discount", "Ahmed Al Redha", "Primary tenant: Emirates Group HQ, Dubai. Subsidiaries: Emirates SkyCargo, Emirates Engineering, dnata. 100,000+ employees.", "executive"),
        (6, "Mubadala Investment Company", "Platinum - 25% Discount", "Layla Al Hashimi", "Primary tenant: Mubadala HQ, Abu Dhabi. Portfolio: Aerospace, Healthcare, Energy, Technology. 50+ portfolio companies.", "prestige"),
        (7, "Dubai Holding", "Gold - 20% Discount", "Omar Al Falasi", "Primary tenant: Dubai Holding HQ, Dubai. Subsidiaries: Jumeirah Group, TECOM Group, Dubai Properties. 20,000+ employees.", "executive"),
        (8, "Abu Dhabi National Oil Company (ADNOC) Offshore", "Gold - 20% Discount", "Hassan Al Zaabi", "Tenant of ADNOC Group. Primary operations: Offshore oil & gas production. Locations: Das Island, Zirku Island, Umm Al Dalkh.", "technical"),
        (9, "Aldar Properties", "Silver - 10% Discount", "Noura Al Dhaheri", "Primary tenant: Aldar HQ, Abu Dhabi. Subsidiaries: Aldar Development, Aldar Investment, Aldar Education. 4,000+ employees.", "classic"),
        (10, "DP World", "Platinum - 25% Discount", "Sultan Bin Sulayem", "Primary tenant: DP World HQ, Dubai. Global ports operator: 80+ terminals, 40+ countries. 50,000+ employees.", "classic"),
        (11, "Emirates Global Aluminium (EGA)", "Silver - 10% Discount", "Abdulnasser Bin Kalban", "Primary tenant: EGA HQ, Abu Dhabi. Smelters: Al Taweelah (Abu Dhabi), Jebel Ali (Dubai). 7,000+ employees.", "technical"),
        (12, "First Abu Dhabi Bank (FAB)", "Gold - 20% Discount", "Hana Al Rostamani", "Primary tenant: FAB HQ, Abu Dhabi. Subsidiaries: FAB Securities, FAB Properties, FAB Islamic Finance. 5,000+ employees.", "prestige"),
        (13, "Dubai Airports", "Gold - 20% Discount", "Paul Griffiths", "Primary tenant: Dubai Airports HQ, Dubai. Operates: DXB, DWC. Subsidiaries: Dubai Duty Free, Dubai Aviation Engineering. 90,000+ employees.", "executive"),
        (14, "Abu Dhabi Ports", "Silver - 10% Discount", "Captain Mohamed Al Shamisi", "Primary tenant: AD Ports HQ, Abu Dhabi. Subsidiaries: AD Ports Logistics, AD Ports Economic Zones, Safeen Group. 3,000+ employees.", "classic"),
        (15, "Majid Al Futtaim", "Silver - 10% Discount", "Alain Bejjani", "Primary tenant: MAF Holding, Dubai. Subsidiaries: MAF Retail (Carrefour), MAF Properties (Malls), MAF Ventures. 45,000+ employees.", "classic"),
    ]
    
    # Create table with tenant_info and default_template column if not exists
    c.execute("""CREATE TABLE IF NOT EXISTS clients 
                 (id INTEGER PRIMARY KEY, name TEXT, discount_tier TEXT, contact TEXT, tenant_info TEXT, default_template TEXT)""")
    
    # Add tenant_info column if missing (migration)
    try:
        c.execute("ALTER TABLE clients ADD COLUMN tenant_info TEXT")
    except sqlite3.OperationalError:
        pass  # Column already exists

    # Add default_template column if missing (migration)
    try:
        c.execute("ALTER TABLE clients ADD COLUMN default_template TEXT DEFAULT 'executive'")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    for client in clients:
        c.execute("""INSERT OR REPLACE INTO clients (id, name, discount_tier, contact, tenant_info, default_template) 
                     VALUES (?, ?, ?, ?, ?, ?)""", client)
    
    conn.commit()
    conn.close()
    print(f"Populated {len(clients)} clients with tenant details and default templates.")

if __name__ == "__main__":
    populate_clients()
