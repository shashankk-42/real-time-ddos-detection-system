const https = require("https");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
const PORT = 5000;
const WSS_PORT = 5001;

// Load SSL Certificates
const httpsOptions = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

app.use(cors());
app.use(express.json());

// ✅ Secure WebSocket Server
const wssServer = https.createServer(httpsOptions);
const wss = new WebSocket.Server({ server: wssServer });

wss.on("connection", (ws) => {
    console.log("Client connected to Secure WebSocket");
});

// ✅ Homepage Route
app.get("/", (req, res) => {
    res.send("✅ Secure Node.js Server is Running on Localhost!");
});

// ✅ DDoS Detection Variables
const RPS_THRESHOLD = 5;
let requestTimes = [];

// ✅ Logging API (POST /log)
app.post("/log", (req, res) => {
    const { ip, timestamp } = req.body;
    const logEntry = `${ip} ${timestamp}\n`;

    fs.appendFile("traffic.log", logEntry, (err) => {
        if (err) {
            console.error("Error writing to log:", err);
            return res.status(500).send("Log failed");
        }

        console.log("Logged:", logEntry.trim());

        // ✅ Store request timestamp for DDoS detection
        requestTimes.push(Date.now());
        checkDDoS();

        // ✅ Broadcast new log to WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(logEntry);
            }
        });

        res.send("Logged");
    });
});

// ✅ DDoS Detection Logic
function checkDDoS() {
    const currentTime = Date.now();

    // Keep only requests from the last 1 second
    requestTimes = requestTimes.filter(time => currentTime - time <= 1000);

    console.log(`🔹 Requests in last 1 sec: ${requestTimes.length}`);

    if (requestTimes.length > RPS_THRESHOLD) {
        console.log("\n🚨 DDoS Attack Detected! 🚨\n");
        fs.writeFileSync("ddos_alert.txt", `DDoS Detected at ${new Date().toISOString()}\n`);
    }
}

// ✅ Start Secure HTTPS Server
https.createServer(httpsOptions, app).listen(PORT, "localhost", () => {
    console.log(`🔒 Secure Server running on https://localhost:${PORT}`);
});

// ✅ Start Secure WebSocket Server
wssServer.listen(WSS_PORT, "localhost", () => {
    console.log(`🔒 Secure WebSocket running on wss://localhost:${WSS_PORT}`);
});
