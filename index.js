const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const { errorGlobal } = require('./middleware/errorhandler');
const connectDB = require('./db/db');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
require('dotenv').config()
require('./utils/scheduler')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})
connectDB();

// Track connected users
const users = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)
    const userId = socket.handshake.query.userId
    if (userId !== undefined) users[`${userId}`] = socket.id

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUser', Object.keys(users))


    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete users[`${userId}`];
        io.emit("getOnlineUsers", Object.keys(users));
    })
});

const getSokectId = (recevierId) => {
    return users[`${recevierId}`]
}

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser())


app.use("/api/v1/", routes)
// global error handler
app.use(errorGlobal);

const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

//Unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutt down server for ${err.message}`);
    console.log(`Shutt down server due to Unhandled promise rejection`);
    //  serve close
    server.close(() => {
        process.exit(1);
    });
});

module.exports = { io, users, getSokectId }