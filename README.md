Real-Time DDoS Attack Detection System

Real-Time-DDoS-Detection/
│── 📄 index.html            # Target website to generate traffic logs
│── 📄 showcase-index.html   # Real-time monitoring UI
│── 📄 server.js             # Secure Node.js backend (logs traffic, detects attacks)
│── 📄 showcase-server.js    # WebSocket server for live RPS updates
│── 📄 ddos.ps1              # PowerShell script for simulated DDoS testing
│── 📄 traffic.log           # Log file for storing request entries
│── 📄 ddos_alert.txt        # File storing DDoS alerts

Tech Stack-
Backend: Node.js (Express.js, WebSockets, HTTPS)
Frontend: HTML, JavaScript, Chart.js (for live graphs)
Security: HTTPS & WebSockets for secure communication
Cloud Storage: Google Cloud Storage (for hosting logs & website)

How It Works
Traffic Logging: The index.html website logs visitor IPs and timestamps via an API (server.js).
DDoS Detection: server.js monitors requests per second (RPS) and flags traffic exceeding 5 RPS as a potential DDoS attack.
Real-time Alerts: showcase-server.js updates the monitoring UI (showcase-index.html) with WebSocket messages.
Visualization: Chart.js dynamically displays live request rate graphs in showcase-index.html.

Setup & Installation

Clone the Repository
git clone https://github.com/your-repo/Real-Time-DDoS-Detection.git
cd Real-Time-DDoS-Detection

Install Dependencies
npm install express ws cors fs https chart.js

Run the Secure HTTPS Server
node server.js

Start the WebSocket Server
node showcase-server.js

Open the Monitoring UI
Open showcase-index.html in a browser to view real-time logs.

Simulate a DDoS Attack (For Testing)
powershell -ExecutionPolicy Bypass -File ddos.ps1

📊 Example Output
✅ Secure Server running on https://localhost:5000
✅ WebSocket Server running on ws://localhost:5002
📊 RPS: 2 at 2025-02-28T12:00:00Z
📊 RPS: 6 at 2025-02-28T12:00:01Z
🚨 DDoS Attack Detected! 🚨
