import React, { useEffect, useRef, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { MdBlock, MdClose } from "react-icons/md"
import { GrDislike } from "react-icons/gr"


function UserProfile(props) {
  const username = props.displayChatName;
  const profiles = JSON.parse(localStorage.getItem('profiles'));
  const dialogRef = useRef(null);

  useEffect(() => {
    console.log('A bio está aqui', profiles[username].bio)
  }, [])
  
  return (
    <>
      <main className='userInfo'>
        <header>
          <div className='closeUI'>
            <div className='closeBttn'
              onClick={props.home.closeChat}>
              <MdClose size={50} />
            </div>
          </div>

          <dialog ref={dialogRef}>
            <div className='imgDialog'>
              <div className='closeBttn'
                onClick={() => dialogRef.current.close()}>
                <MdClose size={50} />
              </div>
              <img src={profiles[username].picture} />
            </div>
          </dialog>

          {
            profiles[username].picture ? <img className='profilePhoto' src={profiles[username].picture} alt="profile picture" onClick={() => dialogRef.current.showModal()} /> : 
            <FaUserCircle size={200} color='white' />
          }
          <div style={{color: 'white', margin: 10, cursor: 'default'}}>
              Online
          </div>
        </header>

        <section style={{cursor: 'default'}}>
          {username}
        </section>

        <section style={{fontSize: 30, padding: 5}}>
            {profiles[username].name}
        </section>

        <section className={profiles[username].bio ? 'displayBio' : 'noBio'}>
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
