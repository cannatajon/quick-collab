import {useEffect, useState, useCallback} from 'react'
import Header from './Header/Header'
import Footer from './Footer'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'

import Chat from './Chat'

const TOOLBAR_OPTIONS =[
    [{header: [1,2,3,4,5,6, false]}],
    [{font: []}],
    [{list: "ordered"}, {list: "bullet"}],
    ["bold", "italic", "underline"],
    [{color: []}, {background: []}],
    [{script: "sub"}, {script: "super"}],
    [{align: []}],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

const save_interval = 2000

export default function Editor(params) {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const {id: roomID} = useParams()
    const [users, setUsers] = useState([])


    useEffect(()=>{
        const s = io("http://localhost:3001")
        setSocket(s)

        return () =>{
            s.disconnect()
        }
    }, [])

    useEffect(()=>{
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) =>{
            if (source !== 'user') return
            socket.emit('send-changes', delta)
        }
        
        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler )
        }
    }, [socket, quill])

    useEffect(()=>{
        if (socket == null || quill == null) return

        const handler = (delta) =>{
            quill.updateContents(delta)
        }
        
        socket.on('receive-changes', handler)

        return () => {
            socket.off('receive-changes', handler )
        }
    }, [socket, quill])

    useEffect(()=>{
        if (socket == null || quill == null) return

        socket.once("load-room", document =>{
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-room', roomID)
        
    }, [socket, quill, roomID])

    useEffect(()=>{
        if (socket == null || quill == null) return

        const interval = setInterval(()=> {
            socket.emit('save-document', quill.getContents())
        }, save_interval )

        return()=>{
            clearInterval(interval)
        }
    }, [socket, quill])

    useEffect(()=>{
        if (socket == null) return

        socket.on("load-chat", (data)=>{
            console.log("coming from editor", data)
            setUsers(data)
        })
        
    }, [socket])

    
    
    

    const wrapperRef = useCallback(wrapper=>{
        if(wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div");
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
        q.disable()
        q.setText('Loading...')
        setQuill(q)
    }, [])

    
  return (
      <>
      <Header roomID = {roomID}></Header>
    <div className="wrapper">
    <div className="container" ref={wrapperRef}>
    </div>
    <div className="side-bar">
    {socket ? <Chat roomID = {roomID} socket={socket} userslol={users}/> : null}
    </div>
    
    </div>
    <Footer></Footer>
    
    </>
  )
}
