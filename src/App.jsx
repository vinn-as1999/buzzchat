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

  const socket = io('http://localhost:3333')

  if (isToken) {
    console.log('o token', isToken)
    socket.emit('online', localStorage.getItem('id'));
  }

  async function getProfileInfo() {
    const getProfileUrl = `http://localhost:3333/api/getProfile?param=${localStorage.getItem('username')}`;
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
      const obj = {
        [username]: prof
      }

      localStorage.setItem('profiles', JSON.stringify(obj))
      
      setProfile(prevProfile => ({
        ...prevProfile,
        obj
      }));
      
      
      return data;
    } else {
      console.log('Error fetching data');
    }
  }

  async function getFriends(params) {
    
  }

  async function getBlocked(params) {
    
  }
  
  useEffect(() => {
    getProfileInfo()
  }, [])

  useEffect(() => {
    socket.on('notification', (message) => {
      console.log('NOVA MENSAGEM PRA VOCÊ: ', message)
    })
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
