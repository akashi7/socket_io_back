const { db } = require('./config/database');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const { verify } = require('jsonwebtoken');


const app = require('./index');

const server = http.createServer(app);

const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log("API starting at PORT " + PORT);
});


const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

io.use(function (socket, next) {
  let { token } = socket.handshake.query;
  verify(token, 'Akashikabuto7', (err, decoded) => {
    if (err) console.log(err);
    else {
      socket.userId = decoded.id;
      next();
    }

  });
});



io.on('connection', (socket) => {
  console.log("Connected: " + socket.userId);
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });
  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      db.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
          connection.query("SELECT * FROM users WHERE id=?", [socket.userId], (err, result) => {
            if (err) console.log(err);
            else {
              const { username } = result[0];
              io.to(chatroomId).emit("newMessage", {
                id: uuidv4(),
                message,
                username,
                user: (socket.userId.toString()),
                chat_room: chatroomId
              });
              connection.query("INSERT INTO messages SET?", {
                chat_room: chatroomId,
                user: socket.userId,
                message,
                username
              }, (err, results) => {
                if (err) console.log(err);
                else {
                  console.log("Message sent");
                }
                connection.release();
              });
            }
          });
        }
      });
    }
  });


});