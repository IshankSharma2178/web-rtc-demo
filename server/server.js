const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const app = express();
const io = new Server({ cors: true });

app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    emailToSocketMapping.set(emailId, socket.id);
    socket.emit("room-joined", roomId);
    console.log(roomId, emailId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", emailId);
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

io.listen(8001, () => {
  console.log("Socket is running on port 8001");
});
