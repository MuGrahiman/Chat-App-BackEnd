import { Server }  from "socket.io"
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {createUser} from './Controller/userAth.js'
import mongoose from 'server/Model/userModel';
const app = express();
dotenv.config()
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const server = app.listen(process.env.PORT || 5000, () => console.log("successfull"));
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
app.post("/sign-up", createUser);
app.post("/sign-in");
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

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected successfully"))
  .catch((err) => console.log(err));
