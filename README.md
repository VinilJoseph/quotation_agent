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

- FastAPI backend with a `/generate` endpoint
- React + Vite frontend
- LangGraph orchestration for multi-step agent flows
- SQLite client database with sample UAE enterprise data
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
│       └── main.jsx
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
