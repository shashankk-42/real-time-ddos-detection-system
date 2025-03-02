const fs = require("fs");
const WebSocket = require("ws");

const LOG_FILE = "traffic.log";
const WSS_PORT = 5002;
const RPS_THRESHOLD = 5;

const wss = new WebSocket.Server({ port: WSS_PORT });
console.log(`✅ WebSocket Server running on ws://localhost:${WSS_PORT}`);

let requestTimes = [];

// ✅ Watch traffic.log for updates
fs.watch(LOG_FILE, (event, filename) => {
    if (event !== "change") return;

    fs.readFile(LOG_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Error reading log file:", err);
            return;
        }

        const lines = data.trim().split("\n");
        if (lines.length === 0) return;

        const lastLine = lines[lines.length - 1]; // Get the latest log entry
        const parts = lastLine.split(" ");
        if (parts.length < 2) return;

        const timestamp = new Date(parts[1]).getTime();
        const currentTime = Date.now();

        // ✅ Add new request timestamp & remove old ones (>1 sec)
        requestTimes.push(timestamp);
        requestTimes = requestTimes.filter(time => currentTime - time <= 1000);

        const rps = requestTimes.length;
        console.log(`📊 RPS: ${rps} at ${new Date().toISOString()}`);

        // ✅ Send RPS data to clients
        const payload = { rps, timestamp: new Date().toISOString() };
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload));
            }
        });
    });
});
