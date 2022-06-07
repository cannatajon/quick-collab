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


io.on('connection', socket =>{
    console.log("connected to client", socket.id)

    socket.on("get-room", async roomID =>{

        const document = await findOrCreateDocument(roomID)
        socket.join(roomID)
        socket.emit("load-room", document.data)

        socket.on("send-changes", delta =>{
            socket.broadcast.to(roomID).emit("receive-changes", delta)
        })
        
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(roomID, {data})
        })

        socket.on("join_room", (data) =>{
            socket.join(data);
            console.log('user', socket.id, "joined room", data)
        })

        socket.on("send_message", (data)=>{
            console.log(data.message)
            socket.to(data.room).emit("receive_message", data)
        })

        socket.on("disconnect", ()=>{
            console.log("user", socket.id, "disconnected")
        })

    })
})

async function findOrCreateDocument(id) {
    if (id==null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue})
}