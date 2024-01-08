const { Server } = require("socket.io");
const express = require("express");

const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use('/',(req,res)=>console.log(req));
const server = app.listen(5000, () => console.log("successfull"));
// console.log(server)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log(id);

  socket.on("connect", () => {
    console.log("user connected");
  });

  socket.on("send-message", ({ recipients, text }) => {
    console.log(recipients, text);
    recipients.forEach((recipient) => {
      const newRecipient = recipients.filter((r) => r !== recipient);
      newRecipient.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipient,
        sender: id,
        text,
      });
    });
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// app.listen(5000,()=>console.log('successfull'))
