import React from 'react'
import './scss/login.scss'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText, 
  Input,
  Button,
  Flex
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import { login } from './api_requests'
import { Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'


function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const recaptcha = useRef()

  return (
    <div className='login container'>
      <div className="login-box container-box">
        <form method="post" onSubmit={(event) => {

            event.preventDefault()
            
            login(event.currentTarget, recaptcha.current.getValue())
            .then(data => {
              localStorage.setItem("refresh", data.refresh)
              localStorage.setItem("access", data.access)
              window.location.pathname = "/"
            })
            .catch(error => {
              event.target.reset()
              recaptcha.current.reset()
              setError(true)
              setLoading(false)
            })

          }}>
          <FormControl isInvalid={error}>
            <FormLabel>Enter MarkMail address</FormLabel>
            <Input type='email' name='email' />
            <FormHelperText>Join us <Link href='/register'>here</Link></FormHelperText>
          </FormControl>
          <br />
          <FormControl isInvalid={error}>
            <FormLabel>Enter your password</FormLabel>
            <Input type='password' name='password' />
            <Flex flexDirection={"row"}>
              {error && <FormErrorMessage marginRight={"10px"}>Invalid credentials</FormErrorMessage>}
              <FormHelperText>Reset it <Link href='/forgot-password' onClick={() => localStorage.setItem("rescue", "forgotPassword")}>here</Link></FormHelperText>
            </Flex>
          </FormControl>
          <br />
          <ReCaptcha sitekey='6LeG6VImAAAAAM9IxcppMo46lVx6iLSMD15vron2' ref={recaptcha} />
          <br />
          <Button  type='submit' colorScheme='messenger' width={"100%"} onClick={() => setLoading(true)
          } isLoading={loading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login