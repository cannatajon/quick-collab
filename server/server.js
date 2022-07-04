const mongoose = require('mongoose')
const Document = require('./Document')

mongoose.connect('mongodb://127.0.0.1:27017/quickCollab', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
    }
})

const defaultValue = ""

let users = []


io.on('connection', socket =>{
    console.log("connected to client", socket.id)

    socket.on("get-room", async roomID =>{

        const document = await findOrCreateDocument(roomID)
        socket.join(roomID)
        socket.emit("load-room", document.data)

        socket.broadcast.in(roomID).emit("load-chat", users)

        socket.on("send-changes", delta =>{
            socket.broadcast.to(roomID).emit("receive-changes", delta)
        })
        
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(roomID, {data})
        })

        socket.on("join_room", (data) =>{
            socket.join(data);
            console.log('user', socket.id, "joined room", data.room)
            users.push(data)
            socket.in(data.room).emit("add_user", users)
            console.log(users)
        })

        socket.on("send_message", (data)=>{
            socket.to(data.room).emit("receive_message", data)
        })

        socket.on("user_list", (data)=>{
            console.log(data)
        })

        socket.on("disconnect", ()=>{
            users = users.filter(user=>user.userID != socket.id)
            console.log("user", socket.id, "disconnected")
            socket.emit("add_user", users)
        })
        

    })
})

async function findOrCreateDocument(id) {
    if (id==null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue})
}