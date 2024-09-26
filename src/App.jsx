import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { io } from 'socket.io-client'
import EnterApplication from './pages/EnterApplication'
import Home from './pages/Home'
import './index.css'


function App() {
  const [login, setLogin] = useState(false);
  const [isToken, setIsToken] = useState(false);
  const [profile, setProfile] = useState({});
  const [socket, setSocket] = useState(null);

  async function getProfileInfo(username) {
    const getProfileUrl = `http://localhost:3333/api/getProfile?param=${username}`;
    const response = await fetch(getProfileUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      const prof = data.profileInfo;
      const username = localStorage.getItem('username');
      
      setProfile(prevProfiles => {
        const updatedProfiles = {
          ...prevProfiles,
          [username]: prof
        }

        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

        console.log(updatedProfiles)

        return updatedProfiles;
      });
      
      return data.profileInfo;

    } else {
      console.log('Error fetching data');
    }
  }

  async function getFriends(params) {
    
  }

  async function getBlocked(params) {
    
  }

  useEffect(() => {
    const newSocket = io('http://localhost:3333', {
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);

    // Desconecta o socket quando o componente desmonta
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    getProfileInfo(localStorage.getItem('username'))
  }, [])

  useEffect(() => {
    if (socket && isToken) {
      console.log('o token', isToken)
      socket.emit('online', localStorage.getItem('id'));
    }
  }, [])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<EnterApplication setIsToken={setIsToken} />} path='/' />
          <Route element={<Home login={login} setLogin={setLogin} isToken={isToken} setIsToken={setIsToken} profile={profile} setProfile={setProfile} getProfileInfo={getProfileInfo} />} path='/home' />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default App;
