import React, { useEffect, useState } from 'react'
import ChatBttn from './ChatBttn.jsx'
import NoFriends from '../NoFriends.jsx'
import { FaRocketchat } from 'react-icons/fa'
import { io } from 'socket.io-client'

const ChatsDisplay = (props) => {
  const friendsArray = localStorage.getItem('friends');
  const friends = JSON.parse(friendsArray);
  const [friendsDisplay, setFriendsDisplay] = useState(friends);
  const mainUser = props.profile.mainUser;

  const socket = io('http://localhost:3333');

  function searchFriends(term) {
    if (term) {
      const userFriends = friends.filter(friend => friend.includes(term));
      setFriendsDisplay(userFriends);

    } else {
      setFriendsDisplay(friends);

    }
  };

  useEffect(() => {
    socket.on('receivedMessage', (message) => {
      console.log('a mensagem: ', message)
    });
  
    return () => {
      socket.off('receivedMessage');  // Limpa o listener ao desmontar o componente
    };
  }, []);
  
  return (
    <>
      <section className='chats'>
        <div className='homePageTitle'>
          <div className='logo'>
            <span>Buzz</span>
            <span style={{color: '#A537C4'}}>Chat</span>
            <FaRocketchat color= '#A537C4' />
          </div>
          <div className='homeGreetings'>
            { 
              props.profile[mainUser].name &&
              `Welcome, ${props.profile[mainUser].name}!` ||
              `Welcome, my friend!`
            }
          </div>
        </div>
        <input style={{width: '34vw', borderColor: 'grey'}} type="text"
          placeholder='Search for chats' autoFocus="true" 
          onChange={(e) => {searchFriends(e.target.value)}} />
        {
          friendsDisplay && friendsDisplay.length > 0 ? friendsDisplay.map((friend, index) => (
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
};

export default ChatsDisplay;
