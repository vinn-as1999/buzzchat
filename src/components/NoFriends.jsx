import React from 'react'
import { TfiFaceSad } from "react-icons/tfi";


const NoFriends = () => {
  return (
    <>
      <section className='noFriends'>
        <TfiFaceSad size={200} />
        <div className='noFriendsTxt'>
            No friends here...
        </div>
      </section>
    </>
  )
}

export default NoFriends
