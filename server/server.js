const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const app = express();
const io = new Server({ cors: true });

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    emailToSocketMapping.set(emailId, socket.id);
    socketIdToEmailMapping.set(socket.id, emailId);
    socket.emit("room-joined", roomId);
    console.log(roomId, emailId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", emailId);
    socket.on("call-user", (data) => {
      const { emailId, offer } = data;
      const fromEmail = socketIdToEmailMapping.get(socket.id);
      const socKetId = emailToSocketMapping.get(emailId);
      socket.to(socKetId).emit("incoming-call", { from: fromEmail, offer });
    });
    socket.on("call-accepted", (data) => {
      const { emailId, ans } = data;
      const socketId = emailToSocketMapping.get(emailId);
      socket.to(socketId).emit("call-accepted", { ans });
    });
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

io.listen(8001, () => {
  console.log("Socket is running on port 8001");
});
