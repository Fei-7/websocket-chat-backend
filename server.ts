import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import auth from "./routes/auth";
import privateChat from "./routes/privateChat";
import groupChat from "./routes/groupChat";
import { setup as setupSocket } from "./socket.io/socket";
// Load .env file
dotenv.config();

// Create an Express application
const app = express();

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(express.json());
app.use(cookieParser());

// Define a route handler for the root path
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Setup api routing
app.use("/api/auth", auth);
app.use("/api/privateChat", privateChat);
app.use("/api/groupChat", groupChat);
// Create http server from express app
const server = http.createServer(app);

// Setup socket.io with the http server
setupSocket(server);

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
