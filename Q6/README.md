Currency Converter Example (Backend + Frontend)
==============================================

What this project does
- Backend: Node.js + Express proxy that calls the free exchangerate.host API (no API key required).
  Endpoints:
    GET /api/health
    GET /api/latest?base=USD
    GET /api/convert?from=USD&to=INR&amount=10

- Frontend: Simple static HTML page (frontend/index.html) that calls the backend.

How to run locally
1) Backend:
   cd backend
   npm install
   node server.js
   The server will run on http://localhost:4000

2) Frontend:
   Open frontend/index.html in your browser (for CORS simplicity open via a static server or just open file://).
   For best result, run a simple static server from the project root:
     npx http-server frontend -p 5500
   Then open http://localhost:5500

Notes
- exchangerate.host is a free, open API for foreign exchange rates (no API key).
- This project shows how to call a free API from backend (server) and use it from frontend.

Files included:
- backend/server.js
- backend/package.json
- frontend/index.html
- README.md

