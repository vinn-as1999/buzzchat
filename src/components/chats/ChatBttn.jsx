import React, { useRef, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { MdClose } from 'react-icons/md'

const ChatBttn = (props) => {
  const queryUrl = `http://localhost:3333/api/friendId`;
  const profiles = JSON.parse(localStorage.getItem('profiles'));
  const dialogRef = useRef(null);
  const [idRef, setIdRef] = useState('');

  async function conversationChecker(data) {
    console.log('aqui as informações', profiles[props.name])
    if (data) {
      const response = await fetch(`http://localhost:3333/api/isconversation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ids': encodeURIComponent(data)
        }
      });
  
      const convId = await response.json();
      return convId.chat;

    } else {
      console.log('Sem dados')
    }
  };

  async function getFriendId() {
    await fetch(queryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendName: props.name
      })
    }).then(response => response.json())
      .then(async data => {
        localStorage.setItem('id2', data.friendId);
        const convId = await conversationChecker(JSON.stringify(
          [
            localStorage.getItem('id'),
            localStorage.getItem('id2')
          ]
        ));

        props.getMessages(convId);
        setIdRef(data.friendId);
      });
  };

  return (
    <>
      <section className='chatBttn'
        onClick={() => {getFriendId(); props.getMessages(localStorage.getItem(idRef))}}>
        <div style={{width: '10vh'}}>
          {
            profiles[props.name] && profiles[props.name].picture ? 
            <img style={{width: 50, height: 50, borderRadius: '50%', margin: 10}} 
              src={profiles[props.name].picture} alt="profile picture" 
              onClick={(e) => {dialogRef.current.showModal(); e.stopPropagation()}} /> : 
            <FaUserCircle size={50} style={{
              margin: 10,
              color: '#D0D0D0'
            }} /> 
          }
        </div>
        <dialog ref={dialogRef}>
            <div className='imgDialog'>
              <div className='closeBttn'
                onClick={(e) => {dialogRef.current.close(); e.stopPropagation()}}>
                <MdClose size={50} />
              </div>
              <img src={profiles[props.name].picture} />
            </div>
          </dialog>
        <div>
          <header className='chatBttnUsr'>
            {props.name}
          </header>
          <article className='msg'>
            Online
          </article>
        </div>
      </section>
    </>
  )
};

export default ChatBttn;
