import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { io } from 'socket.io-client'
import EnterApplication from './pages/EnterApplication'
import Home from './pages/Home'
import './index.css'


function App() {
  const [login, setLogin] = useState(false);
  const [isToken, setIsToken] = useState(false);

  const socket = io('http://localhost:3333')

  if (isToken) {
    console.log('o token', isToken)
    socket.emit('online', localStorage.getItem('id'));
  }

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
          <Route element={<Home login={login} setLogin={setLogin} isToken={isToken} setIsToken={setIsToken} />} path='/home' />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default App;
