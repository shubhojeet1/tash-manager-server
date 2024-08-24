const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:3000", "https://task-manager-client-orcin.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

connectDB();

app.use(cors({
  origin: ["http://localhost:3000", "https://task-manager-client-orcin.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root route 
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Manager</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f4f4f4;
        }
        .container {
          text-align: center;
          background-color: #ffffff;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
     
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Task Manager Server</h1>
        <p>This is the backend service for managing tasks and users.</p>
       
      </div>
    </body>
    </html>
  `);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
