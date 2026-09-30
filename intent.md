# Project Intent: Pax ERP AI Quotation Agent

## Purpose
Build an AI-powered quotation assistant that automates the creation of commercial quotations for ERP products/services, demonstrating a multi-step agent workflow with LangGraph.

## Core Workflow
1. **Classify** user intent from natural language request
2. **Route** to appropriate workflow (quotation vs. general query)
3. **Query** client details from SQLite ERP database (mock UAE enterprises)
4. **Retrieve** product/pricing info via BM25 knowledge base
5. **Generate** polished quotation using LLM (OpenRouter)
6. **Display** execution trace (agent logs) in frontend for transparency

## Key Features
- FastAPI backend with /generate endpoint
- React + Vite frontend with agent trace visualization
- LangGraph orchestration for multi-step agent flows
- SQLite database with seeded UAE client data (ADNOC, Emirates Steel, etc.)
- BM25 retriever for product/pricing knowledge base
- LLM-based quotation generation via OpenRouter/ChatOpenAI

## Tech Stack
- **Backend**: Python, FastAPI, LangGraph, LangChain, OpenRouter, SQLite, BM25
- **Frontend**: React, Vite, Tailwind CSS, React Markdown

## Scope
MVP/Prototype with mock business data - not production-ready. Demonstrates agentic RAG pattern for quotation generation.