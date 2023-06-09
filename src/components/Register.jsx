import React, { useEffect, useState, useRef } from 'react'
import './scss/login.scss'
import { FormControl, FormLabel, Input, Text, Collapse, Button, FormErrorMessage, NumberInput, NumberInputField, FormHelperText } from '@chakra-ui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { check_email, register } from './api_requests'
import { useNavigate } from 'react-router-dom'



function Register() {
  const [emailError, setEmailError] = useState(false)
  const [passError, setPassError] = useState(false)
  const [loadBtn, setLoadBtn] = useState(false)
  const [loadCollapse, setLoadCollapse] = useState(false)
  const navigate = useNavigate()
  const recaptcha = useRef()

  useEffect(() => {
    localStorage.setItem("register", true)
  }, [])

  return (
    <div className='register container'>
        <div className='register container-box'>
          <Text fontSize={"xl"}>Register@MarkMail</Text>
          <br />
          <br />
          <form action="" method="post" id='register-form' onSubmit={(event) => {
            event.preventDefault()
            const token = recaptcha.current.getValue()

            register(document.querySelector("#register-form"), token)
            .then(response => {
              setLoadBtn(false)
              navigate("/login")
              
            })
            .catch(error => {console.log(error); setLoadBtn(false)})
          }}>
            <FormControl isReadOnly={loadCollapse} isInvalid={emailError} >
              <FormLabel>Enter your desired email</FormLabel>
              <Input id='email' type='email' name='email' />
              {emailError && <FormErrorMessage>Email is taken</FormErrorMessage>}
            </FormControl>
            <br />
            <Collapse in={loadCollapse} animateOpacity>
              <FormControl>
                  <FormLabel>Rescue Code</FormLabel>
                  <NumberInput>
                    <NumberInputField maxLength={16} name='rescue_code' />
                  </NumberInput>
                  <FormHelperText>Don't lose it! Used to reset your password</FormHelperText>
              </FormControl>
              <br />
              <FormControl isInvalid={passError}>
                <FormLabel>Enter your password</FormLabel>
                <Input type='password' name='password' id='passwd' />
                {passError && <FormErrorMessage>Passwords do not match</FormErrorMessage>}
              </FormControl>
              <br />
              <FormControl isInvalid={passError} >
                <FormLabel>Repeat Password</FormLabel>
                <Input type='password' name='repeat_password' onChange={(event) => {
                  if (event.target.value !== document.querySelector("#passwd").value) {
                    setPassError(true)
                  }
                  else {
                    setPassError(false)
                  }
                }} />
                {passError && <FormErrorMessage>Passwords do not match</FormErrorMessage>}
              </FormControl>
              <br />
              <ReCAPTCHA sitekey='6LeG6VImAAAAAM9IxcppMo46lVx6iLSMD15vron2' ref={recaptcha} />
            </Collapse>
            {loadCollapse && <br />}
            <Button colorScheme='messenger' onClick={() => {
                setLoadBtn(true)
                setEmailError(false)
                if (!loadCollapse) {
                  setTimeout(() => {
                    check_email(document.querySelector("#email").value)
                    .then(response => {
                      setLoadCollapse(true)
                    })
                    .catch(error => setEmailError(true))
                    setLoadBtn(false)
                  }, 1450)
                }
            }} width={"100%"} isLoading={loadBtn} type={loadCollapse ? "submit": "button"}>{loadCollapse ? "Register" : "Check mail"}</Button>
          </form>
        </div>
    </div>
  )
}

export default Register