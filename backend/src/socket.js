let io;
const users = new Map(); // userId -> socketId

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      users.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (const [key, value] of users.entries()) {
        if (value === socket.id) {
          users.delete(key);
          break;
        }
      }
    });
  });
}

function notifyUser(userId, payload) {
  const socketId = users.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("hired", payload);
  }
}

module.exports = { initSocket, notifyUser };
