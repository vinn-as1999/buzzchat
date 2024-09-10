import React, { useEffect, useRef, useState } from 'react'
import ChatBalloon from './ChatBalloon'
import { FaUserCircle } from 'react-icons/fa'
import { GrSend } from "react-icons/gr"
import { MdClose } from "react-icons/md"
import DisplayDay from './DisplayDay'
import NoMessages from '../NoMessages'
import { io } from 'socket.io-client'


const socket = io('http://localhost:3333')

const IndividualChat = (props) => {
  const newChatUrl = 'http://localhost:3333/api/newchat'
  const newMsgUrl = 'http://localhost:3333/api/newmsg'
  const date = new Date();

  const [message, setMessage] = useState('');
  const scrollRef = useRef();

  const [ user_1, user_2 ] = [ localStorage.getItem('id'), localStorage.getItem('id2') ]
  const chatUser = props.displayChatName;
  const chatProfile = props.profile;

  function getDay() {
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
  }  
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${months[month]} ${day}, ${year}`
  };

  function getHour() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();

    const {
      hour: formatedHour,
      min: formatedMin
    } = {
      hour: String(hour).padStart(2, '0'),
      min: String(min).padStart(2, '0')
    }

    return `${formatedHour}:${formatedMin}`
  };

  async function sendMsgFunction(info) {
    if (info && message.trim()) {
      const response = await fetch(newMsgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: info.convId,
          sender: info.sender,
          receiver: user_2,
          content: message,
          day: getDay(),
          hour: getHour()
  
        })
      });
  
      const data = await response.json();
      props.setHistMsg(prev => [...prev, data.msg]);
      props.addFriend(props.displayChatName);

      socket.emit('newMessage', data.msg);
      moveToTop(props.displayChatName)
  
      return data;

    } else {
      console.log('problema aí: ', info.convId, info.sender)
    }
  };

  async function createChatController() {
    const ids = [user_1, user_2];
    const queryUrl = `http://localhost:3333/api/isconversation`

    try {
      const info = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ids': encodeURIComponent(JSON.stringify(ids))
        }
      })

      const conversation = await info.json();

      if(!conversation.chat) {
        const response = await fetch(newChatUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            participant_1: user_1,
            participant_2: user_2
          })
        });

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem(user_2, data.convId);
    
          await props.getMessages(data.convId)
          sendMsgFunction({
            convId: data.convId,
            sender: user_1
          });
          await props.setHistMsg(prev => [...prev, message]);
          setMessage('');
        }

      } else {
        console.log('já tem chat: ', conversation)
        const infoObj = {
          convId: conversation.chat,
          sender: user_1
        }
        
        await props.getMessages(conversation.chat);
        sendMsgFunction(infoObj)
        setMessage('');
      }

    } catch(err) {
      console.log('erro ao buscar conversa', err)
    }
  };

  function moveToTop(value) {
    let friendList = JSON.parse(localStorage.getItem('friends'));
  
    if (!Array.isArray(friendList)) {
      console.log('Invalid friend list');
      return;
    }
  
    const index = friendList.indexOf(value);
  
    if (index === -1) {
      console.log('Friend not found');
      return;
    }

    const element = friendList.splice(index, 1)[0];
  
    friendList.unshift(element);
    localStorage.setItem('friends', JSON.stringify(friendList));
  };


  useEffect(() => {    
    socket.on('message', (receivedMessage) => {
      props.setHistMsg((prev) => {
        if (prev.find(msg => msg._id === receivedMessage._id)) {
          return prev;
        }

        return [...prev, receivedMessage];
      });
    });

    socket.on('notification', notification => console.log('notificação pai', notification))
  
    return () => {
      socket.off('message');
    };
  }, []);


  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [props.histMsg])
  

  return (
    <>
      <main className='chatDisplay'>

        <section>
          <header className='chatHeader'
          onClick={() => {props.home.displayUserInfo(chatUser); console.log(chatUser)}}>
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              {
                chatProfile[chatUser] && chatProfile[chatUser].picture ?
                <img src={chatProfile[chatUser].picture} alt="chat profile picture"
                  className='singleChatProfilePic' /> :
                <FaUserCircle size={60} style={{
                  margin: 20,
                  color: '#D0D0D0'
                }} />
              }
              <div>
                <div className='userChatName'>
                  {props.displayChatName}
                </div>
                <div className='userChatStatus'>
                  Online
                </div>
              </div>
            </div>

            <MdClose className='closeBttn'
              onClick={(event) => {
                props.home.closeChat();
                event.stopPropagation()
                }} />
          </header>

          <section className="chatBody">
            <div className='msgs'>
              {
                props.empty === true ? (<NoMessages />) : props.histMsg.map((data, index) => (
                  <>
                    <div className='dayBallon'>
                    {
                      (index === 0 || props.histMsg[index - 1].day !== data.day) && (
                        <DisplayDay day={data.day} />
                      )
                    }
                    </div>
                    <div key={index}
                      >
                      <ChatBalloon hour={data.hour} 
                      msgContent={data.content} 
                      sender={data.sender} 
                      user_1={user_1} />
                    </div>
                    <div ref={scrollRef}></div>
                  </>
                ))
              }
            </div>

            <div>
              <section className='msg-box'>
                <input type="text" value={message} placeholder='Send message...' style={{width: 500, padding: '0px 10px'}} autoFocus={true} onKeyDown={(e) => e.key === 'Enter' && createChatController()}
                onChange={(e) => setMessage(e.target.value)} />
                <button className='send-button'
                  onClick={createChatController}>
                  <GrSend />
                </button>
              </section>
            </div>

          </section>
        </section>

      </main>
    </>
  )
};

export default IndividualChat;
