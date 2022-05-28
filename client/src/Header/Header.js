import {useState} from 'react'
import './Header.css'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";

export default function Header(params) {

  const [isCopied, setIsCopied] = useState("false")



  return (
    <div className='header'>
      <h2 className="main-name">quickCollab</h2>
      <div className="invite-link">
        <div>Invite Link --> &nbsp;</div>
        <CopyToClipboard text={`localhost:3000/room/${params.roomID}`}>
          <button id="copy-link-button"><AiOutlineCopy/></button>
        </CopyToClipboard>
        <input type="text"  value={params.roomID} readOnly id="invite-link-input"/></div>

    </div>
  )
}
