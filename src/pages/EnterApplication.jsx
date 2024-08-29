import React, { useEffect, useState } from 'react'
import Register from '../components/Register';
import LoginForm from '../components/LoginForm';
import { FaRocketchat } from "react-icons/fa";


const EnterApplication = (props) => {

  const [greetings, setGreetings] = useState(`Welcome back!`);
  const [phrase, setPhrase] = useState(`Sign in to continue your chat experience`);
  const [buttonText, setButtonText] = useState(`Sign up`);
  const [animate, setAnimate] = useState(true);
  const [error, setError] = useState();
  const [registerError, setRegisterError] = useState();

  function changeScreen() {
    if (animate === false) {
        setAnimate(true);
        setGreetings(`Welcome back!`);
        setPhrase(`Sign in to continue your chat experience`);
        setButtonText(`Sign up`);
        setError();
        setRegisterError();

    } else {
        setAnimate(false);
        setGreetings(`It's a pleasure to see you here!`);
        setPhrase(`Sign up and welcome to your new chat network`);
        setButtonText(`Sign in`);
        setError();
        setRegisterError();
    }
  };

  useEffect(() => {
    if(error) {
      setGreetings(`Something is wrong :(`)
      setPhrase(`It looks like your credentials are wrong or don't exists in our database. Try again or sign up for free...`);
    }

    if(registerError) {
      setGreetings(`Passwords don't match...`);
      setPhrase(`You need to confirm your password to register your account`);
    }
  }, [error, registerError])

  return (
    <>
      <section className='entryContainer'>
        <div className='enterForm'>
            <div className='pageTitle'>
              BuzzChat <FaRocketchat />
            </div>
            { 
              animate === true ? <LoginForm animate={animate} 
              setIsToken={props.setIsToken} 
              error={error} 
              setError={setError} /> : 
              
              <Register animate={animate} registerError={registerError} setRegisterError={setRegisterError} />
            }
        </div>

        <div style={error || registerError && { background: 'linear-gradient(to right, #E54242, #FB4F4F)' } || {background: 'linear-gradient(to right, #B72EC4, #C136CE )'}}
        className={
          animate === null && 'greetBox' || 
          animate === true && 'greetBoxAfter' || 
          animate === false && 'greetBoxReturn'
        }>
            <div className='greetings'>{greetings}</div>
            <div className='phrase'>{phrase}</div>

            <div style={{color: '#D3D3D3', marginLeft: '1vh', marginTop: '8vh'}}>
              {animate === true ? 'Want to join us? Sign up now!' : `Already have an account? Sign in!`}
            </div>
            <button style={error || registerError ? {backgroundColor: 'brown'} : {}} onClick={changeScreen}>{buttonText}</button>
        </div>
      </section>
    </>
  )
};

export default EnterApplication;
