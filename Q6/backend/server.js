// server.js - Express backend proxy to exchangerate.host
// Run: npm install && node server.js
import express from "express";
// import fetch from "node-fetch";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (req, res) => {
  res.json({status: "ok", time: new Date()});
});

// Get latest rates for a base currency
// Example: GET /api/latest?base=USD
app.get("/api/latest", async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const resp = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rates", details: String(err) });
  }
});

// Convert amount from one currency to another
// Example: GET /api/convert?from=USD&to=INR&amount=10
app.get("/api/convert", async (req, res) => {
  try {
    const from = req.query.from || "USD";
    const to = req.query.to || "EUR";
    const amount = req.query.amount || "1";
    const resp = await fetch(`https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to convert", details: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log("Server running on port", PORT));
