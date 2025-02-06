// Import required modules

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const WebSocket = require("ws");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const wss = new WebSocket.Server({ port: 8081 });

const broadcastData = async () => {
  const data = JSON.stringify(status);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      await client.send(data);
    }
  }
};

let status = 0;

// Default waste type

// Serve the frontend
app.get("/", (req, res) => {
  res.render("dashboard", { status });
});

// Receive data from sensors
app.get("/sensor-data", (req, res) => {
  const { type } = req.query;
  console.log(`Updated ${type}`);

  if (type === undefined) {
    status = -1; // Error state
    broadcastData();
    return res.status(400).send({ error: "Missing type in query parameters" });
  }

  const parsedValue = Number.parseInt(type, 10);

  if ([-1, 0, 1, 2, 3].includes(parsedValue)) {
    status = parsedValue;
    broadcastData();
    res.send(`Sensor data updated to status: ${parsedValue}`);
  } else {
    status = -1; // Error state for invalid values
    broadcastData();
    res.status(400).send({ error: "Invalid status value" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
