import React, { useEffect, useState } from 'react'
import ChatBttn from './ChatBttn.jsx';
import NoFriends from '../NoFriends.jsx';
import { FaRocketchat } from 'react-icons/fa';

const ChatsDisplay = (props) => {
  const friendsArray = localStorage.getItem('friends');
  const friends = JSON.parse(friendsArray);
  
  return (
    <>
      <section className='chats'>
        <div className='homePageTitle'>
          <div style={{padding: '0px 10px'}}>
            <span>Buzz</span>
            <span style={{color: '#A537C4'}}>Chat</span>
          </div><FaRocketchat color= '#A537C4' />
        </div>
        <input style={{width: '34vw', borderColor: 'grey'}} type="text" 
        placeholder='Search for chats' autoFocus="true" /> {/* it doesn't works for a while*/}
        {
          friends && friends.length > 0 ? friends.map((friend, index) => (
            <div onClick={() => {props.setDisplayChatName(friend); 
              props.home.displayChat()}}
              key={index}>
              <ChatBttn name={friend} getMessages={props.getMessages} profile={props.profile} home={props.home} histMsg={props.histMsg} />
            </div>)
          ) : (<NoFriends />)
        }
      </section>
    </>
  )
}

export default ChatsDisplay;
