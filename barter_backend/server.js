const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const config = require("config");
const morgan = require("morgan");
const dotenv = require("dotenv");

// initialize app

const app = express();

// middleware

app.use(express.json());

// env variables

dotenv.config({ path: "./config.env" });

const server = http.createServer(app);
const io = socketio(server).sockets;

// dev logging
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// db config

const db = config.get("mongoURI");

// connect mongodb
mongoose
  .connect(db)
  .then(() => console.log('connected to mongoose'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send("the homepage has been hit"));
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))

const port = process.env.PORT || 5000;
server.listen(port, () => `server has started on port ${port}`);
