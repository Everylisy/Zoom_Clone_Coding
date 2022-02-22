import http from "http";
import WebSocket from "ws";
import express from "express";
import { parse } from "path";

const app = express();

app.set('view engine', 'pug');
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
server.listen(3000, handleListen);



const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["Nickname"] = "Annonymous";
    console.log("Connected to Browser ✔");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));

    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type) {
            case "New_msg":
                sockets.forEach((aSocket) => aSocket.send(`${socket.Nickname} : ${message.payload}`));
            case "Nickname":
                socket["Nickname"] = message.payload;
        }
    });
});