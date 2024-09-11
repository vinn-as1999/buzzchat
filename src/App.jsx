import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { io } from 'socket.io-client'
import EnterApplication from './pages/EnterApplication'
import Home from './pages/Home'
import './index.css'


function App() {
  const [login, setLogin] = useState(false);
  const [isToken, setIsToken] = useState(false);

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
