import React from 'react'
import Editor from './Editor'
import{ BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import {v4 as uuidV4} from "uuid"

export default function App() {
  const roomID = uuidV4()
  console.log(roomID)
  return (
    <Router>
      <Routes>
        <Route path ='/' exact element={<Navigate to={`/room/${uuidV4()}`}/>}>
        </Route>
        <Route path ='room/:id' element={<Editor/>}>
        </Route>
      </Routes>
      
    </Router>
  )
}
