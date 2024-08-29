import React from 'react';

const ChatBalloon = (props) => {

  return (
    <>
      <section style={{width: '100%'}}
        className='balloon'>
        <div className='message'
          style={props.sender === props.user_1 ? {float: 'right', textAlign: 'left'} : {float: 'left', textAlign: 'left'}}>
          {props.msgContent}
          <div className='hour'>
            {props.hour}
          </div>
        </div>
      </section>
    </>
  )
}

export default ChatBalloon;
