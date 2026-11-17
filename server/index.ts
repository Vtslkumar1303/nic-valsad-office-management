import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.API_PORT || 4000);

app.use(cors({ origin: process.env.WEB_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "nic-valsad-office-api", database: "not_connected" });
});

app.get("/api", (_req, res) => {
  res.json({ name: "NIC Valsad Office Management API", version: "0.1.0" });
});

app.listen(port, () => {
  console.log(`NIC Valsad API listening on port ${port}`);
});
