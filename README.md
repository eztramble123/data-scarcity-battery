# BlockBattery

BlockBattery is split into two working areas:

- `frontend/` — Next.js dashboard for the Athens contributor network, map-first UI, and downstream modeling layer
- `backend/` — FastAPI platform API, optimization/model stubs, ingestion code, tests, and the Sepolia Hardhat scaffold

## Run

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
uv run uvicorn api.main:app --reload --port 8765
```

Tests:

```bash
cd backend
uv run pytest
```

## Environment files

- `frontend/.env.example`
- `backend/.env.example`

## Notes

- `STATUS.md` is the handoff file. Read it before making changes.
- The current product is the BlockBattery data-collection layer first, with the modeling layer shown downstream.
