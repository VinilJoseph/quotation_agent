# Pax ERP AI Quotation Agent

A small AI-powered quotation assistant built with FastAPI, React, and LangGraph. The app classifies a user request, fetches client data from SQLite, retrieves relevant product information from a lightweight BM25 knowledge base, and generates a polished commercial quotation using an LLM.

## Overview

This project demonstrates an agent workflow for a business quotation use case:

- Understand the user's intent
- Route the request to the appropriate workflow
- Query client details from a mock ERP database
- Search product pricing and policy information from a local retrieval layer
- Generate a final quotation or direct answer
- Show the execution trace of each agent step in the UI

## Features

- FastAPI backend with `/generate`, `/clients`, and `PATCH /clients/{id}` endpoints
- React + Vite frontend with Tailwind CSS and responsive ticket-pass UI
- **Multiple Commercial Quotation Templates**:
  - **Pax Executive**: Modern minimalist corporate slate with executive summary and Level-3 authorization stamp
  - **Gulf Prestige**: Sovereign UAE emerald and gold theme with bilingual headers and official circular seal
  - **Technical Blueprint**: High-density engineering specification with monospace SKUs and SLA recovery matrix
  - **Classic Commercial**: Formal ADGM tender letterhead with milestone payment schedule and corporate seal
- **Company Default Templates**: Pre-assigned default templates per enterprise client in SQLite with live directory configuration
- **Per-Quote Template Overrides & Persistence**: Switch templates per quote and save state permanently across quote selection
- **Print Preview Modal & Clean Print Engine**: Scaled A4 preview before printing with dedicated `@media print` rules
- LangGraph orchestration for multi-step agent flows
- SQLite client database with sample UAE enterprise data (`pax_erp.db`)
- BM25-based retrieval for product and pricing information
- LLM-based quotation generation via OpenRouter
- Debug-friendly agent logs shown in the frontend

## Tech Stack

### Backend
- Python
- FastAPI
- LangGraph
- LangChain
- OpenRouter / `ChatOpenAI`
- SQLite
- BM25 retriever

### Frontend
- React
- Vite
- Tailwind CSS
- React Markdown

## Project Structure

```text
quotation_agent/
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── orchestrator.py
│   ├── populate_db.py
│   ├── requirements.txt
│   ├── tools.py
│   └── pax_erp.db
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── templates/
│           ├── ClassicCommercialTemplate.jsx
│           ├── ExecutiveTemplate.jsx
│           ├── GulfPrestigeTemplate.jsx
│           ├── PrintPreviewModal.jsx
│           ├── TechnicalBlueprintTemplate.jsx
│           ├── TemplateRenderer.jsx
│           └── templateRegistry.js
├── QUOTATION_TEMPLATES.md
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Python 3.10+
- Node.js 18+
- npm
- An OpenRouter API key

## Environment Setup

Create a `.env` file inside the `backend` folder:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

This is required because the backend uses `ChatOpenAI` with the OpenRouter base URL in `backend/orchestrator.py`.

## Installation

### 1) Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend

From the `backend` directory:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- http://localhost:8000
- POST `/generate`

### Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

Then open the local Vite URL in the browser, typically:

- http://localhost:5173

## Example API Request

```json
{
  "user_request": "Generate a quotation for ADNOC for the Enterprise ERP License and HR Module"
}
```

Example response:

```json
{
  "quotation": "# Quotation ...",
  "logs": ["🧭 Classifier Node: ...", "💾 SQL Tool: ..."]
}
```

## Notes

- The SQLite database is seeded with mock client data such as ADNOC and Emirates Steel.
- The RAG layer is powered by a BM25 retriever initialized in `backend/database.py`.
- The frontend displays the agent execution trace so you can inspect the decision flow and tool usage.
- This project is intended as an MVP/prototype and uses mock business data.

## License

No explicit license has been added to this project yet.



=============================================================
                   ERP - AI QUOTATION MVP
=============================================================

[ 1. PRESENTATION LAYER ] 
+-----------------------------------------------------------+
| React.js Frontend (Vite + Tailwind)                       |
|   - Input: Natural language request                       |
|   - UI: Real-time Agent Execution Trace (Logs)            |
|   - Output: Rendered Markdown Quotation                   |
+-----------------------------------------------------------+
                             |
                             | HTTP POST (/generate)
                             v
[ 2. API & APPLICATION LAYER ]
+-----------------------------------------------------------+
| FastAPI Backend                                           |
|   - Initializes TypedDict QuoteState                      |
|   - Injects request into LangGraph pipeline               |
+-----------------------------------------------------------+
                             |
                             v
[ 3. LANGGRAPH ORCHESTRATOR (Agentic Workflow) ]
                           (START)
                              |
                     +--------v--------+
                     | Classifier Node | ---> [Handles Greetings/Chat]
                     +--------+--------+
                              |
                     (If 'generate_quote')
                              v
                     +--------v--------+
                     |  Analyzer Node  | ---> (Extracts Client & Product)
                     +--------+--------+
                              |
                              v
                     +--------v--------+       +-------------------+
                     | SQL Fetcher Node| <---> | SQLite Database   |
                     +--------+--------+       | (Client Discounts)|
                              |                +-------------------+
                              v
                     +--------v--------+       +-------------------+
                     | RAG Fetcher Node| <---> | BM25 Retriever    |
                     +--------+--------+       | (Product Pricing) |
                              |                +-------------------+
                              v
                     +--------v--------+       +-------------------+
                     | Quote Generator | <---> | OpenRouter LLM    |
                     +--------+--------+       | (w/ Fallback Logic|
                              |                +-------------------+
                            (END)