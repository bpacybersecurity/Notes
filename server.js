const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const PASSWORD = "A+N_1024";
const ROOM_NAME = "Notes";

let messages = []; // store chat history

io.on("connection", socket => {
    // send existing messages to new users
    messages.forEach(msg => socket.emit("chatMessage", msg));

    socket.on("chatMessage", msg => {
        messages.push(msg); // save message
        io.emit("chatMessage", msg);
    });
});

http.listen(3000, () => console.log("Server running on port 3000"));
