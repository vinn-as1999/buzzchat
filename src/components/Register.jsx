import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { PiWarningDiamondFill } from 'react-icons/pi';
import ServerAnswer from './chats/ServerAnswer';


const Register = (props) => {

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [answer, setAnswer] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    const url = `http://localhost:3333/api/register`;

    if (password === confirmPassword) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      }).then(response => response.json())
        .then(data => setAnswer(data.message))
        .catch(err => {
          console.log('Erro ao enviar requisição.', err)
        });
    } else {
      props.setRegisterError(true);

    }
  };

  return (
    <>
        <form className='formBox' onSubmit={handleSubmit}>

          <h1>REGISTER</h1>

          <label htmlFor="">Username</label>
          <div>
            <FaRegUserCircle />
            <input type='text' placeholder='WilliamHarrys' autoFocus={true} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <label htmlFor="">Email</label>
          <div>
            <MdOutlineAlternateEmail /> 
            <input type="email" placeholder='example@email.com'
            onChange={(e) => setEmail(e.target.value)} />
          </div>

          <label htmlFor="">Password</label>
          <div>
            <FaLock />
            <input type="password" placeholder='your password here'
            onChange={(e) => setPassword(e.target.value)} />
          </div>

          <label htmlFor="">Confirm your password</label>
          <div>
            <FaLock />
            <input type="password" placeholder='your password again'
            onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          
          <button type='submit'>Get started</button>

          {
            answer && <ServerAnswer answer={answer} />
          }
        </form>
    </>
  )
}

export default Register
