import React , {useState, useEffect} from 'react'
import './Chat.css'

export default function Chat({roomID, socket}) {

    const [name, setName] = useState("")
    const [currentMessage, setCurrentMessage] = useState("")
    const [showChat, setShowChat] = useState(false)

    
    const joinChat = () =>{
        if (name !== ""){
            socket.emit("join_room", [roomID, name])
            setShowChat(true)
        }
    }


    const sendMessage = async () =>{
        if (currentMessage === "" || name === "") return

        const messageData = {
            room: roomID,
            author: name,
            message: currentMessage,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        };

         await socket.emit("send_message", messageData)
    }

    useEffect(()=>{
        socket.on("receive_message", (data)=>{
            console.log(data)
        })
    }, [])



  return (
    <div className='chat'>

        {!showChat ?(
        <div className='join-chat'>
        <div className='name-field'>
            <input type="text" placeholder='Name' onChange={e=>setName(e.target.value)} required/>
            <button onClick={joinChat}>Join</button>
        </div>
        </div>
        )
        :
        (
        <>
        <div className='chat-header'></div>
        <div className='chat-body'></div>
        <div className='chat-footer'>
            <input type='text' placeholder='Type something' onChange={(e)=>setCurrentMessage(e.target.value)}/>
            <button onClick={sendMessage}>&#8680;</button>
        </div>
        </>
        )}
    </div>
  )
}
