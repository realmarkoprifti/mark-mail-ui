import React, { useState } from 'react'
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
    Textarea,
    HStack,
    FormErrorMessage
  } from '@chakra-ui/react'
import { compose_mail } from './api_requests'



function Compose(props) {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Compose Mail</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form method="post" id='compose-form' onSubmit={(event) => {    
                    event.preventDefault()
                    console.log(1212)
                    compose_mail(document.querySelector("#compose-form"))
                    .then(response => {
                        console.log(response)
                        localStorage.setItem("mailbox", "sent")
                        document.querySelector("#close-btn").click()
                    })
                    .catch(error => {
                        setError(true)
                        setLoading(false)
                    })

              }}>
                <FormControl isInvalid={error}>
                    <Input type='email' name='receiver' placeholder='To:'  />
                    {error && <FormErrorMessage>Invalid receiver address</FormErrorMessage>}          
                </FormControl>
                <br />
                <FormControl>
                    <Input type='text' name='subject' placeholder='Subject:' />
                </FormControl>
                <br />
                <Textarea name='content' placeholder='Email Body' />
                <HStack display={"flex"} justifyContent={"end"} marginTop={"25px"}>
                    <Button colorScheme='red' mr={3} onClick={props.onClose} id="close-btn">
                      Close
                    </Button>
                    <Button colorScheme='messenger' type='submit' isLoading={loading} onClick={() => setLoading(true)}>Compose</Button>
                </HStack>
              </form>
            </ModalBody>    
          </ModalContent>
      </Modal>
    )
}

export default Compose