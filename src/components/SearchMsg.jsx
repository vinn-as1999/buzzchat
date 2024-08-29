import React from 'react'
import { BsSearchHeart } from "react-icons/bs";


const SearchMsg = () => {
  return (
    <>
      <section style={styles.section}>
        <BsSearchHeart style={styles.searchBttn} />
        <div style={styles.searchMsg}>
            Search for new <br/> friends...
        </div>
      </section>
    </>
  )
}

const styles = {
    section: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    searchBttn: {
        fontSize: '10vw',
        color: '#5D3C56',
        opacity: 0.5
    },
    searchMsg: {
        color: '#8E477E',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 30,
        marginTop: '20px',
        fontWeight: 'bold'
    }
}

export default SearchMsg;
