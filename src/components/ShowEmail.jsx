import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    ModalFooter,
    Button,
    Collapse,
    FormControl,
    Input,
    Textarea,
    FormErrorMessage,
    HStack,
    Icon,
    Tooltip
  } from '@chakra-ui/react'
import { change_status, compose_mail } from './api_requests'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { GoTrashcan } from 'react-icons/go'

function ShowEmail(props) {
    const [reply, setReply] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{props.subject}</ModalHeader>
            <ModalCloseButton id='close-btn' />
            <ModalBody>
              <Text fontSize={"xl"}>Sender: {props.sender}</Text>
              <br />
              <Text fontSize={"xl"}>{props.body}</Text>
              <br />
                <Collapse in={reply} animateOpacity>
                    <form method="post" id='reply-form' onSubmit={(event) => {
                        event.preventDefault()

                        compose_mail(document.querySelector("#reply-form"))
                        .then(response => {
                            setLoading(false)
                            setReply(false)
                            document.querySelector("#close-btn").click()
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    }}>
                        <FormControl>
                            <Input type='text' placeholder='Subject' name='subject' />
                        </FormControl>
                        <br />
                        <FormControl>
                            <Textarea placeholder='Reply' name='content' />
                        </FormControl>
                        <Input type='hidden' value={props.sender} name='receiver' />
                        <Button id="submit-btn" type='submit' display={"none"}></Button>
                    </form>
                </Collapse>
            </ModalBody>
            <HStack paddingLeft={"5px"} display={props.mailbox == "sent" ? "none" : ""}>
              <Tooltip label='Favourite'>
                <Button variant={"ghost"} _hover={{background: "transparent"}} onClick={() => {
                  change_status("favourites", props.id, true)
                  document.querySelector("#close-btn").click()
                  localStorage.setItem("mailbox", "favourites")
                }}><Icon _hover={{color: "yellow.300"}} fontSize={"30px"} as={AiFillStar} /></Button>
              </Tooltip>
              <Tooltip label='Archive'>
                <Button variant={"ghost"} _hover={{background: "transparent"}} onClick={() => {
                    change_status("archived", props.id)
                    document.querySelector("#close-btn").click()
                    localStorage.setItem("mailbox", "archived")
                }}><Icon fontSize={"30px"} as={GoTrashcan} /></Button>
              </Tooltip>
              </HStack>
            <ModalFooter>
              <Button colorScheme='messenger' isLoading={loading} type='button' onClick={() => {
                if (reply) {
                    setLoading(true)
                    document.querySelector("#submit-btn").click()
                }
                else {
                    setReply(true)
                }
              }}>Reply</Button>
            </ModalFooter>
          </ModalContent>
      </Modal>
    )
}

export default ShowEmail