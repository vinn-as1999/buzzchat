import React, { useState } from 'react'
import ChatBttn from './ChatBttn'
import { RiSearchLine } from "react-icons/ri"
import SearchMsg from '../SearchMsg'
import { FaRocketchat } from 'react-icons/fa'


const UserSearchs = (props) => {

  function searchUsers() {
    const queryUrl = `http://localhost:3333/api/getchats?searchTerm=${encodeURIComponent(props.term)}`
    fetch(queryUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    }).then(response => response.json())
      .then(data => {
      const list = data.chats;
      const usernames = list.filter(user => user.username
          .toLowerCase()
          .includes(props.term.toLowerCase()))
          .map(user => {
              if (user._id !== localStorage.getItem('id')) {
                  return user.username;
              }
          });
      props.term && props.setUserList(usernames) || !props.term && props.setUserList([]);
      });
  };


  return (
    <>
      <section className='users'>
        <div className='homePageTitle'>
          <div style={{padding: '0px 10px'}}>
            <span>Buzz</span>
            <span style={{color: '#A537C4'}}>Chat</span>
          </div><FaRocketchat color= '#A537C4' />
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <input style={{width: '29vw', borderColor: 'grey'}} type="text" placeholder='Search for users' onChange={(e) => props.setTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
          autoFocus="true" />

          <button style={{display: 'flex', width: '5vw', height: '4vh', alignItems: 'center', justifyContent: 'center', margin: 5}}
              onClick={searchUsers}>
            <RiSearchLine />
          </button>

        </div>

        { 
          props.userList.length > 0 ? props.userList.map((user, index) => (
            user ? (
            <div key={index} className='newChats' onClick={() => {props.home.displayChat(); 
              props.setDisplayChatName(user)}}>
              <ChatBttn name={user} getMessages={props.getMessages} profile={props.profile} home={props.home}/>
            </div>
          ) : null)) 
          : <SearchMsg />
        }
      </section>
    </>
  )
};

export default UserSearchs;
