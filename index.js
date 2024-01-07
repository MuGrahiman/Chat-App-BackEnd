const io = require("socket.io")(5000);

io.on("connection", (socket) => {
  socket.join(id);
  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipient = recipients.filter((r) => r !== recipient);
      newRecipient.push(id);
      socket.broadcast
        .to(recipient)
        .emit("receive-message", {
          recipients: newRecipient,
          sender: id,
          text,
        });
    });
  });
});
