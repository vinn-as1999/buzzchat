import React, { useState, useEffect } from 'react'
import { MdOutlineAlternateEmail } from "react-icons/md"
import { PiWarningDiamondFill } from "react-icons/pi"

import { FaLock } from "react-icons/fa6"
import { FaRocketchat } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const LoginForm = (props) => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    const url = `http://localhost:3333/api/login`;
    const restrict = `http://localhost:3333/api/restrict`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }).then(response => response.json())
        .then(data => {

          data.error && props.setError(data.error);
          data.token && [localStorage.setItem('token', data.token), localStorage.setItem('id', data.id)]

          fetch(restrict, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            props.setIsToken(true);
            navigate('/home')
          })
        }).catch(err => {
          console.log('ERRO:', err)
        })
    } catch (err) {
      console.log('erro ao autenticar: ', err)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/home')
    }
    else {
        console.log(props.isToken)
        navigate('/');
    }
  }, [props.isToken]);

  return (
    <>
      <form className={
        props.animate === null && 'formBox' ||
        props.animate === true && 'formBoxAfter' ||
        props.animate === false && 'formBoxReturn'
        }
        onSubmit={handleLogin}
        >

        <div className='errorBox'>        
          {props.error}
        </div>

        <div className='pageTitle'>
          BuzzChat <FaRocketchat />
        </div>

        <h1>LOGIN</h1>

        <label htmlFor="">Email</label>
        <div>
            {
              [
                !props.error && <MdOutlineAlternateEmail />,
                props.error && <PiWarningDiamondFill color='#CC3535' />
              ]
            }
            <input type="email" placeholder='example@email.com' autoFocus={true} 
            onChange={e => setEmail(e.target.value)} style={props.error && {borderColor: 'red'}} />
        </div>

        <label htmlFor="">Password</label>
        <div>
            {
              [
                !props.error && <FaLock />,
                props.error && <PiWarningDiamondFill color='#CC3535' />
              ]
            }
            <input type="password" placeholder='your password here' 
            onChange={e => setPassword(e.target.value)} style={props.error && {borderColor: 'red'}}  />
        </div>

        <button>Log In</button>

      </form>
    </>
  )
};

export default LoginForm;
