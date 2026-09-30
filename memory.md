# Project Memory: Pax ERP AI Quotation Agent

## Current State (2026-09-29)

### What's Been Done
- Project scaffolded with FastAPI backend + React frontend
- SQLite database (pax_erp.db) seeded with mock UAE client data (ADNOC, Emirates Steel)
- BM25 retriever implemented for product/pricing knowledge base
- LangGraph orchestrator set up for multi-step agent workflow
- FastAPI /generate endpoint accepting user requests
- React + Vite frontend with agent trace visualization
- README.md created with setup/run instructions
- intent.md created documenting project purpose and scope

### Active Components
- Backend: backend/main.py, backend/orchestrator.py, backend/database.py, backend/tools.py
- Frontend: frontend/src/App.jsx, frontend/src/main.jsx
- Database: backend/pax_erp.db (SQLite)
- Config: .env needed in backend for OPENROUTER_API_KEY

### Not Yet Implemented / TODO
- [ ] Add .env with OpenRouter API key
- [ ] Install dependencies (pip install -r backend/requirements.txt && npm install in frontend)
- [ ] Run and test the full pipeline
- [ ] Add error handling / validation
- [ ] Add tests
- [ ] Consider authentication/authorization for production

---

## History Log

### 2026-09-29 - Session Start
- Explored project structure and README
- Created intent.md documenting project purpose
- Created this memory.md for ongoing context tracking

---

## Context Preservation Strategy

### Files to Update on Each Session
1. memory.md - This file: append session summary, decisions, blockers
2. intent.md - Update if scope/purpose changes
3. README.md - Update if setup/usage changes

### Recommended Practices
- Start each session by reading memory.md and intent.md
- End each session by appending to memory.md with:
  - What was accomplished
  - Key decisions made
  - Blockers/open questions
  - Next steps
- Commit frequently with descriptive messages
- Use git log to trace history: git log --oneline -20

---

## What Else You Can Do

### Immediate (Quick Wins)
- [ ] Add .env.example template in backend/
- [ ] Create a CHANGELOG.md for versioned changes
- [ ] Add .gitignore entries for .env, __pycache__, node_modules, .venv
- [ ] Set up pre-commit hooks (black, ruff, eslint)

### Short-term (Project Health)
- [ ] Add unit tests for orchestrator nodes and tools
- [ ] Add integration test for /generate endpoint
- [ ] Document API schema (OpenAPI/Swagger already available at /docs)
- [ ] Add request/response Pydantic models documentation
- [ ] Create a DEVELOPMENT.md with local dev workflow

### Medium-term (Scalability)
- [ ] Migrate from SQLite to PostgreSQL for production
- [ ] Add Redis caching for BM25 retriever
- [ ] Implement proper logging (structlog) and monitoring
- [ ] Add authentication (JWT/OAuth) for API
- [ ] Containerize with Docker/Docker Compose
- [ ] Set up CI/CD (GitHub Actions)

### Long-term (Product)
- [ ] Add conversation memory/history per client
- [ ] Support multiple quotation templates
- [ ] Add PDF export for quotations
- [ ] Implement approval workflow
- [ ] Add product catalog management UI
- [ ] Multi-tenant support

---

## Key Files Reference

| File | Purpose |
|------|---------|
| backend/main.py | FastAPI app, /generate endpoint |
| backend/orchestrator.py | LangGraph workflow definition |
| backend/database.py | SQLite + BM25 retriever init |
| backend/tools.py | Agent tools (SQL, RAG, LLM) |
| backend/requirements.txt | Python dependencies |
| frontend/src/App.jsx | Main React component |
| frontend/package.json | Node dependencies |
| backend/pax_erp.db | SQLite database (gitignored?) |

---

## Commands Reference

`ash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add OPENROUTER_API_KEY
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev

# API Docs
# http://localhost:8000/docs
`