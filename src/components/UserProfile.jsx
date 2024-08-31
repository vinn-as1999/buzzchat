import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { MdBlock, MdClose } from "react-icons/md"
import { GrDislike } from "react-icons/gr"


function UserProfile(props) {
  const username = props.displayChatName;
  const profiles = JSON.parse(localStorage.getItem('profiles'));

  useEffect(() => {
    console.log('A bio está aqui', profiles[username].bio)
  }, [])
  
  return (
    <>
      <main className='userInfo'>
        <header>
          <div className='closeUI'>
            <div style={{cursor: 'pointer'}}
              onClick={props.home.closeChat}>
              <MdClose size={50} color='brown' />
            </div>
          </div>
          {
            profiles[username].picture ? <img className='profilePhoto' src={profiles[username].picture} alt="profile picture" /> : 
            <FaUserCircle size={200} color='rgb(209, 209, 209)' />
          }
          <div style={{color: 'grey'}}>
              Online
          </div>
        </header>

        <section style={{cursor: 'default'}}>
          {username}
        </section>

        <section style={{fontSize: 30, padding: 5}}>
            {profiles[username].name}
        </section>

        <section className={props.profile.bio ? 'displayBio' : 'noBio'}>
          <div style={{whiteSpace: 'pre-line', marginLeft: 10}}>
            {profiles[username].bio}
          </div>
        </section>
        
        <footer>
            <section style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                <div className='userInfoOptions'>
                    <MdBlock size={30} color='#E23A3A' />
                    <div style={{color: '#E23A3A', padding: 10}}>Block {username}</div>
                </div>
                <div className='userInfoOptions'>
                    <GrDislike size={25} color='#E23A3A' />
                    <div style={{color: '#E23A3A', padding: 10}}>Report {username}</div>
                </div>
            </section>
        </footer>
      </main>
    </>
  )
}

export default UserProfile;
