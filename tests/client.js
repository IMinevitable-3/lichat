const { io } = require("socket.io-client");

// Connect to the server
const socket = io("ws     ://localhost:8080");

// Handle connection success
socket.on("connect", () => {
    console.log(`Connected to server with ID: ${socket.id}`);

    // Send a test message to the server
    socket.emit("livechat", "Hello, this is a test message from the client!");
});

// Handle the "welcome" event from the server
socket.on("welcome", (message) => {
    console.log(`Server: ${message}`);
});

// Handle "livechat" messages broadcast by the server
socket.on("livechat", (message) => {
    console.log(`Broadcast from server: ${message}`);
});

// Handle disconnection
socket.on("disconnect", () => {
    console.log("Disconnected from server.");
});

// Handle errors
socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
});
