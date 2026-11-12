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

### 2026-11-12 - Polished Quotation Templates, Company Defaults & Print Preview Engine
- **Multiple Polished Quotation Templates**:
  - Implemented 4 commercial quotation templates matching UAE enterprise design standards:
    1. `Pax Executive` (`ExecutiveTemplate.jsx`): Modern minimalist corporate slate with executive summary & Level-3 authorization stamp.
    2. `Gulf Prestige` (`GulfPrestigeTemplate.jsx`): Sovereign UAE emerald & gold styling with bilingual Arabic/English header, bilateral official seal & TDRA cloud compliance.
    3. `Technical Blueprint` (`TechnicalBlueprintTemplate.jsx`): High-density engineering spec with monospace SKU codes, infrastructure SLA matrix & DevOps verification checksum.
    4. `Classic Commercial` (`ClassicCommercialTemplate.jsx`): Traditional formal letterhead on registered ADGM entity stationery with milestone schedule & corporate seal.
- **Company Default Templates**:
  - Assigned default templates for each UAE enterprise client in SQLite (`pax_erp.db`) and frontend state.
  - Added company default template selector in the ERP Client Directory tab, allowing live configuration and backend synchronization (`PATCH /clients/{id}`).
  - New quotes automatically detect the client entity and auto-select that company's default template.
- **Per-Quote Template Override & Persistence**:
  - Added Quotation Template Override bar in the main view for 1-click template switching.
  - Each quote in `quotationList` saves `templateId` permanently, preserving the original look of existing and historic quotations.
  - Provided clear visual indication of default vs. override state with a 1-click "Revert to Company Default" button.
- **Print Preview Modal & Clean Print Engine**:
  - Built `PrintPreviewModal.jsx` with scaled A4 paper sheet rendering, in-modal template switcher, and print triggers.
  - Implemented `@media print` CSS rules in `index.css` to hide all UI chrome, toolbars, and background styling, producing crisp printouts on real paper or PDF.
- **Backend & Database Synchronization**:
  - Added `default_template` column migration to SQLite `clients` table in `database.py` and `populate_db.py`.
  - Added `GET /clients` and `PATCH /clients/{id}` endpoints in `main.py`.
  - Verified successful production build with Vite (`npm run build`).

### 2026-11-12 - UI Overhaul to Match file4.html & Onboarding Reference
- Upgraded the React frontend styling to match the dark theme and aesthetic from `file4.html`.
- Implemented the interactive feature/onboarding carousel matching the uploaded reference image, complete with isometric 3D vector illustration, dot indicator pill stepper, and Skip/Next controls.
- Implemented digital wallet ticket pass layout for commercial proposals with gradient header, metadata grid, barcode styling, and copy/print actions.
- Added live agent execution trace visualization with node-specific badge chips (Classifier, Analyzer, SQL, RAG, Synthesis).
- Integrated quick suggestions chips for UAE enterprise clients (ADNOC, Emirates Steel, DEWA).
- Added client directory tab and product catalog viewer connected to SQLite and BM25 data structures.
- Added graceful client-side fallback simulation to ensure interactive preview and testing even when the backend is offline.
- Verified successful production build with Vite (`npm run build`).

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
- [x] Support multiple quotation templates (Pax Executive, Gulf Prestige, Technical Blueprint, Classic Commercial)
- [x] Add PDF export / Print preview for quotations
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