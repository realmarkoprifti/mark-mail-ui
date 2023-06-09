import React, { useEffect, useState, useRef } from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText, 
    Input,
    Button,
    NumberInput,
    NumberInputField,
    Collapse
} from '@chakra-ui/react'
import './scss/login.scss'
import { check_code, reset_password } from './api_requests.js'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'


function ForgotPassword() {
    const [rescue, setRescue] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadPass, setLoadPass] = useState(false)
    const [codeErr, setCodeErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [passMatch, setPassMatch] = useState(false)
    const nav = useNavigate()

    return (
      <div className="forgot container">
          <motion.div className="forgot-password-box container-box" animate={rescue && {height: "550px"}} transition={{duration: 0.4}}>
                <form method="post" id="rescue-form" onSubmit={(event) => {
                    event.preventDefault()
                    const form = document.querySelector("#rescue-form")

                    reset_password(form)
                    .then(response => {
                        localStorage.removeItem("rescue")
                        nav("/login")
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }}>
                    <FormControl isInvalid={emailErr} isReadOnly={rescue}>
                        <FormLabel>Enter your MarkMail address</FormLabel>
                        <Input type='email' name='email' />
                        {emailErr && <FormErrorMessage>Email not found</FormErrorMessage>}
                    </FormControl>
                    <br />
                    <FormControl isInvalid={codeErr} isReadOnly={rescue}>
                        <FormLabel>Enter your Recovery Code</FormLabel>
                        <NumberInput>
                            <NumberInputField maxLength={16} name='rescue_code' />
                        </NumberInput>
                        {codeErr ? <FormErrorMessage>Rescue code is incorrect</FormErrorMessage> : <FormHelperText>Keep this a secret</FormHelperText>}
                    </FormControl>
                    <br />
                    <Collapse in={loadPass} animateOpacity>
                        <FormControl isInvalid={passMatch}>
                            <FormLabel>New Password</FormLabel>
                            <Input type='password' name='password' id="newpass" />
                            {passMatch && <FormErrorMessage>Passwords do not match</FormErrorMessage>}
                        </FormControl>
                        <br />
                        <FormControl isInvalid={passMatch}>
                            <FormLabel>Repeat Password</FormLabel>
                            <Input type='password' name='repeat_password' id="repeatpass" onChange={() => {
                                const pass1 = document.querySelector("#newpass").value
                                const pass2 = document.querySelector("#repeatpass").value

                                if (pass1 !== pass2 && !passMatch) {
                                    setPassMatch(true)
                                }

                                else if (pass1 === pass2) {
                                    setPassMatch(false)
                                }

                            }} />
                            {passMatch && <FormErrorMessage>Passwords do not match</FormErrorMessage>}
                        </FormControl>
                    </Collapse>
                    <br />
                    <Button isLoading={loading} type={loadPass && 'submit'} colorScheme='messenger' onClick={
                        () => {
                            setLoading(true)
                            setCodeErr(false)
                            setEmailErr(false)

                            setTimeout(() => {
                                check_code(document.querySelector("#rescue-form"))
                                .then(response => {                            
                                    if (response.message === "success") {
                                        setLoadPass(true)
                                        setRescue(true)
                                    }
                                })
                                .catch(error => {
                                    if (error.response.data.message === "rescuecode_incorrect") {
                                        setCodeErr(true)
                                    }

                                    else if (error.response.data.message === "email_not_found") {
                                        setEmailErr(true)
                                    }
                                })
    
                                setLoading(false)
                            }, 2500);
                        }
                    } width={"100%"}>
                        {loadPass ? "Change Password" : "Check Code"}
                    </Button>
              </form>
          </motion.div>
      </div>
    )
    }

export default ForgotPassword