import React, {useState} from 'react'
import Editor from './Editor'
import{ BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import {v4 as uuidV4} from "uuid"

export default function App() {
  const roomID = uuidV4()
  console.log(roomID)
  return (
    <Router>
      <Routes>
        <Route path ='/' element={<Navigate to={`/room/${roomID}`}/>}/>
        <Route path ='room/:id' element={<Editor id={roomID}/>}>
        </Route>
      </Routes>
      
    </Router>
  )
}
