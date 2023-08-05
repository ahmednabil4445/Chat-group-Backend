const express = require("express")
const app = express()
require('dotenv').config({ path: './config/.env' })

const port = process.env.PORT || 4000

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})

 const server =app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = require("socket.io")(server, {
    cors: "*"
})

let users = []
let chatMsg = []
io.on("connection", (socket) => {
    socket.on("loginName", (user) => {
        users.push({ username: user, id: socket.id })
        io.emit("showUsers", users)
        socket.on("sendMessage", (msg) => {
            let currentUser = users.find((user) => user.id == socket.id)
            chatMsg.push({ user: currentUser.username, message: msg })
            io.emit("displayMsg", chatMsg)
        })
    })
    socket.on("disconnect", () => {
        users = users.filter((user) => user.id != socket.id)
        io.emit("showUsers", users)
        users.length == 0 ? chatMsg = [] : null
    });
})