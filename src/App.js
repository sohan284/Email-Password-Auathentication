import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import './App.css';
import app from "./firebase.init";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);
function App() {
  const [validated, setValidated] = useState(false);
  const [error,setError] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [registered,setRegistered] =useState('');
  const handleEmailBlur = e =>{
    setEmail(e.target.value);

  }
  const handlePasswordBlur = e =>{
    setPassword(e.target.value);
  }
  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
      

  }
  const handleFormSubmit = event =>{
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
     
      event.stopPropagation();
      // return;
    }
    if(!/(?=.*[!@#$%^&*])/.test(password)){
      setError('password should contain at least a number')
      // return;

    }
  

    setValidated(true);
    if(registered){
      signInWithEmailAndPassword(auth,email,password)
      .then(result => {
        const user =result.user;
        console.log(user);
      })
      .catch(error => {
        console.log(error);
      })

    }
    else{
    createUserWithEmailAndPassword(auth,email,password)
    .then(result =>{
      const user = result.user;
      console.log(user);
      setEmail('');
      setPassword('');
    verifyEmail();
    })
    .catch(error=>{
      console.log(error);
      setError(error.message)
    })
  }
    event.preventDefault();
    console.log(email,password)
  }
  const handlePasswordReset = () =>{
    sendPasswordResetEmail(auth,email)
    .then(() =>{
      console.log('email send')

    })
    
  
  }
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log('varify email');
    })
  }

  return (
    <div>
      <div className="registration w-50 mx-auto">
        <h2 className="text-primary mt-5">Please {registered? 'Login': 'Register'} </h2>
      <Form noValidate validated={validated} onClick={handleFormSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered" />
  </Form.Group>
        <p>{error}</p>
        <Button onClick={handlePasswordReset} variant="link">Forgot Password?</Button>
        <br />
        <Button variant="primary" type="submit">{registered? 'Log in': 'Register'}</Button>
      </Form>
      </div>
    </div>
  );
}

export default App;
