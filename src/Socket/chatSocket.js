
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
  