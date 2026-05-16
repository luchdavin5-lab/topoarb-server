const express = require(“express”);
const cors = require(“cors”);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get(”/”, (req, res) => {
res.json({ status: “ok”, service: “TopoArb” });
});

app.post(”/broker/exness/order”, async (req, res) => {
try {
const { apiKey, accountId, server, symbol, side, volume, sl, tp } = req.body;
const r = await fetch(“https://api.exness.com/trading/v1/orders”, {
method: “POST”,
headers: {
“Authorization”: “Bearer “ + apiKey,
“Content-Type”: “application/json”,
“X-Account-ID”: accountId
},
body: JSON.stringify({ symbol, side, volume, order_type: “market”, server, stop_loss: sl, take_profit: tp })
});
const data = await r.text();
res.status(r.status).send(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post(”/broker/investzo/order”, async (req, res) => {
try {
const { apiKey, accountId, symbol, side, lots, sl, tp } = req.body;
const r = await fetch(“https://api.investzo.com/v1/trade”, {
method: “POST”,
headers: {
“X-API-KEY”: apiKey,
“Content-Type”: “application/json”
},
body: JSON.stringify({ account: accountId, instrument: symbol, action: side, lots, type: “market”, stop_loss: sl, take_profit: tp })
});
const data = await r.text();
res.status(r.status).send(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post(”/broker/hfm/order”, async (req, res) => {
try {
const { apiKey, accountId, server, symbol, side, volume, sl, tp } = req.body;
const r = await fetch(“https://api.hfm.com/v2/orders”, {
method: “POST”,
headers: {
“Authorization”: “Token “ + apiKey,
“Content-Type”: “application/json”                              
},
body: JSON.stringify({ account_id: accountId, server, symbol, type: “MARKET”, side: side.toUpperCase(), volume, stop_loss: sl, take_profit: tp })
});
const data = await r.text();
res.status(r.status).send(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.listen(PORT, () => console.log(“TopoArb running on port “ + PORT));
