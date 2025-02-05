const dashboard = document.getElementById("dashboard");

// Icon mapping for waste detection statuses
const wasteIcons = {
  1: `/img/metal.svg`,
  3: `/img/dry.png`,
  2: `/img/wet.png`,
  0: `/img/noobjectimage.webp`,
  "-1": `/img/cross.png`,
};

// Text mapping for waste detection statuses
const wasteTypes = {
  1: "Metal WASTE Detected",
  3: "DRY WASTE Detected",
  2: "WET WASTE Detected",
  0: "NO WASTE DETECTED",
  "-1": "DETECTION ERROR",
};

// Function to render the dashboard based on the status
const renderDashboard = (status) => {
  const errorClass =
    status === -1
      ? "color: oklch(0.637 0.237 25.331)"
      : "color: oklch(0.373 0.034 259.733)";
  const statusText =
    status === -1
      ? "Error in Waste Detection"
      : status === 0
      ? "Wating for waste detection"
      : "";

  dashboard.innerHTML = `
        <div style="text-align: centre">
            <div style="margin-bottom: 1rem">
     <img style="margin-inline: auto; height: 370px;" src="${wasteIcons[status]}"
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 600;text-align: center; margin-top: 10px; ${errorClass}">${wasteTypes[status]}</h2>
            <p style="color:  oklch(0.551 0.027 264.364); margin-top: 0.5rem; text-align: center">${statusText}</p>
        </div>
    `;
};

// Initialize with the status injected from the server
renderDashboard(initialStatus);

// Connect to WebSocket for real-time updates
const socket = new WebSocket("ws://localhost:8081");

// Handle incoming messages
socket.onmessage = (event) => {
  const status = Number.parseInt(event.data, 10);
  renderDashboard(status);
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.warn("WebSocket connection closed");
};
