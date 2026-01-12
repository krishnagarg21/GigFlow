const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket");


const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// DB Connection
connectDB();

// Test route
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const gigRoutes = require("./routes/gigRoutes");
app.use("/api/gigs", gigRoutes);

const bidRoutes = require("./routes/bidRoutes");
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("GigFlow API is running");
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// initialize socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
