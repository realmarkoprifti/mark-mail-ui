import React, { useRef, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input,
    FormLabel,
    HStack,
    FormErrorMessage
} from '@chakra-ui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { change_password } from './api_requests'

function ChangePassword(props) {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const recaptcha = useRef()
    

    return (
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
            <ModalBody>
                <form method="post" id="changepasswd-form" onSubmit={(event) => {
                    event.preventDefault()
                    const form = document.querySelector("#changepasswd-form")

                    change_password(form, recaptcha.current.getValue())
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        setError(true)
                        setLoading(false)
                        form.reset()
                        recaptcha.current.reset()
                    })
                }}>
                    <br />
                    <FormControl isInvalid={error}>
                        <FormLabel>Old Password</FormLabel>
                        <Input type='password' name='old_password' />
                        {error && <FormErrorMessage>Password is incorrect</FormErrorMessage>}
                    </FormControl>
                    <br />
                    <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input type='password' name='new_password' />
                    </FormControl>
                    <br />
                    <ReCAPTCHA sitekey='6LeG6VImAAAAAM9IxcppMo46lVx6iLSMD15vron2' ref={recaptcha} />
                    <br />
                    <HStack display={"flex"} justifyContent={"end"} marginTop={"25px"}>
                        <Button colorScheme='red' mr={1} onClick={props.onClose} id="close-btn">
                        Close
                        </Button>
                        <Button colorScheme='messenger' type='submit' isLoading={loading} onClick={() => setLoading(true)}>Change Password</Button>
                    </HStack>
                </form>
            </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ChangePassword