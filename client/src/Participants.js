import React from 'react'
import './Participants.css'

export default function Participants(users) {
  const allUsers = users.users.map(user=>(
    <div>{user.name}</div>
  ))
  console.log(allUsers)
  return (
    <div className="participants">
      {allUsers}
    </div>
  )
}
