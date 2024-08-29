import React from 'react'
import { IoCheckmarkDone } from "react-icons/io5"

const ServerAnswer = (props) => {
  return (
    <>
      <div className='serverAnswer'>
        <IoCheckmarkDone size={25} color='green' />
        {props.answer}
      </div>
    </>
  )
}

export default ServerAnswer;
