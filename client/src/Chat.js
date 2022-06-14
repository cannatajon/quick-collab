import React , {useState, useEffect} from 'react'
import './Chat.css'
import Participants from './Participants'

export default function Chat({roomID, socket}) {

    const [name, setName] = useState("")
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    const [showChat, setShowChat] = useState(false)

    
    const joinChat = () =>{
        if (name !== ""){
            socket.emit("join_room", [roomID, name])
            setShowChat(true)
        }
    }


    const sendMessage = async () => {
        if (currentMessage === "" || name === "") return

        const messageData = {
            room: roomID,
            author: name,
            message: currentMessage,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        }

         await socket.emit("send_message", messageData)
         setMessageList((list)=>[...list, messageData])
         setCurrentMessage("")
    }

    useEffect(()=>{
        socket.off("receive_message").on("receive_message", (data)=>{
            setMessageList((list) => [...list, data])
        })
    },[socket])



  return (
    <div className='chat'>

        <Participants></Participants>

        {!showChat ?(
        <div className='join-chat'>
        <div className='name-field'>
            <input type="text" placeholder='Name' onChange={e=>setName(e.target.value)} onKeyPress={(e)=>{e.key === "Enter" && joinChat()}} required/>
            <button onClick={joinChat}>Join</button>
        </div>
        </div>
        )
        :
        (
        <>
        <div className='chat-header'></div>
        <div className='chat-body'>
            {messageList.map((messageContent)=>{
                return <h1>{messageContent.message}</h1>
            })}
        </div>
        <div className='chat-footer'>
            <input type='text' placeholder='Type something' value={currentMessage} onChange={(e)=>setCurrentMessage(e.target.value)} onKeyPress={(e)=>{e.key === "Enter" && sendMessage()}}/>
            <button onClick={sendMessage}>&#8680;</button>
        </div>
        </>
        )}
    </div>
  )
}
