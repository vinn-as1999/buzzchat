import React, { useState } from 'react'
import ChatBttn from './ChatBttn'
import { RiSearchLine } from "react-icons/ri"
import SearchMsg from '../SearchMsg'
import { FaRocketchat } from 'react-icons/fa'


const UserSearchs = (props) => {

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
          <input style={{width: '29vw', borderColor: 'grey'}} type="text" placeholder='Search for users' onChange={(e) => props.setTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && props.searchUsers()}
          autoFocus="true" />

          <button style={{display: 'flex', width: '5vw', height: '4vh', alignItems: 'center', justifyContent: 'center', margin: 5}}
              onClick={props.searchUsers}>
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
