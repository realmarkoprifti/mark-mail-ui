import React, { useEffect, useState } from 'react'
import { Icon, Box, Heading, Stack, Button, Flex, Text, Table, Thead, Tbody, Spinner, Tr, Th, Td, HStack, TableContainer, Center } from '@chakra-ui/react'
import { FiMail } from 'react-icons/fi'
import { AiFillStar, AiOutlineQuestion, AiOutlinePlus } from 'react-icons/ai'
import { BsMailbox } from 'react-icons/bs'
import { GoTrashcan } from 'react-icons/go'
import { get_emails, refresh, logout, change_status } from './api_requests'
import { useNavigate } from 'react-router-dom'
import Compose from './Compose'
import ChangePassword from './ChangePassword'
import ShowEmail from './ShowEmail'


function Home() {
  const [loading, setLoading] = useState(true)
  const [mailbox, setMailBox] = useState("inbox")
  const [emails, setEmails] = useState([])
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [compose, setCompose] = useState(false)
  const [changePasswd, setChangePasswd] = useState(false)

  const [email, setEmail] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailSender, setEmailSender] = useState("")
  const [emailID, setEmailID] = useState(0)

  const [read, setRead] = useState(false)
  const nav = useNavigate()


  useEffect(() => {
    localStorage.setItem("mailbox", mailbox)

    get_emails(mailbox)
    .then(emails => {
      setLoading(false)
      setError(false)
      setEmails(emails)
      
    })
    .catch(error => {

      if (error.response.status == 401) {
        refresh(localStorage.getItem("refresh"))
        .then(response => {
          localStorage.setItem("access", response.access)
          setReload(true)
        })
        .catch(() => nav("/login"))
      }
      setError(true)

    })
  }, [mailbox, reload])

  useEffect(() => {
    setMailBox(localStorage.getItem("mailbox"))
  }, [localStorage.getItem("mailbox")])

  return (
    <Flex width={"100vw"} height={"100vh"}>
      <Compose isOpen={compose} onClose={() => setCompose(false)} sender={emailSender} />
      <ShowEmail isOpen={email} onClose={() => setEmail(false)} subject={emailSubject} body={emailBody} sender={emailSender} id={emailID} mailbox={mailbox} />
      <ChangePassword isOpen={changePasswd} onClose={() => setChangePasswd(false)} />
      <Box width={"380px"} boxShadow={"md"} display={"flex"} flexDirection={"column"} padding={"0px 10px"}>
        <Heading textAlign={"center"} marginTop={"10px"}>MarkMail</Heading>
        <Stack direction={"column"} spacing={4} mt={"50px"}>
              <Button colorScheme='messenger' variant={"ghost"} onClick={() => setMailBox(mailbox => "inbox")}> Inbox <Icon as={BsMailbox} marginLeft={"auto"} fontSize={"20px"} /></Button>
              <Button colorScheme='messenger' variant={"ghost"} onClick={() => setMailBox(mailbox => "sent")}> Sent <Icon as={FiMail} marginLeft={"auto"} fontSize={"20px"} /></Button>
              <Button colorScheme='messenger' variant={"ghost"} onClick={() => setMailBox(mailbox => "favourites")}> Favourites <Icon as={AiFillStar} marginLeft={"auto"} fontSize={"20px"} /></Button>
              <Button colorScheme='messenger' variant={"ghost"} onClick={() => setMailBox(mailbox => "archived")}> Archived <Icon as={GoTrashcan} marginLeft={"auto"} fontSize={"20px"} /></Button>
              <Button colorScheme='messenger' marginTop={"15px"} onClick={() => setCompose(true)}>Compose</Button>
        </Stack>
        <HStack spacing={2} marginTop={"auto"} marginBottom={"10px"}>
            <Button width={"100%"} colorScheme='messenger' onClick={() => setChangePasswd(true)}>Change Password</Button>
            <Button width={"100%"} isLoading={logoutLoading} colorScheme='red'  onClick={() => {
              setLogoutLoading(true)
              setTimeout(() => {
                logout()
                localStorage.clear()
                nav("/login")
              }, 1250)

            }}>Log Out</Button>
        </HStack>
      </Box>
      {!loading ? <Box flex="1">
          {!error && emails.length > 0 ? <TableContainer>
            <Heading margin={"15px"}>{mailbox[0].toUpperCase() + mailbox.slice(1, mailbox.length - 0)}</Heading>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th textAlign={"start"}>Subject</Th>
                  <Th textAlign={"center"}>Content</Th>
                  <Th textAlign={"end"}>Timestamp</Th>
                </Tr>
              </Thead>
              <Tbody>
                {emails.map(email => {
                  return (
                    <Tr key={email.id} _hover={{backgroundColor: "gray.100", cursor: "pointer"}} backgroundColor={(email.isRead || read || mailbox !== "inbox") && 'gray.100'} onClick={() => {
                        mailbox == "inbox" && !email.isRead && change_status(mailbox, email.id, true)
                        .then(response => setRead(true))
                        .catch(error => console.log(error))

                        setEmailSubject(emailSubject => email.subject)
                        setEmailBody(emailBody => email.content)
                        setEmailSender(emailSender => email.sender)
                        setEmailID(emailID => email.id)
                        setEmail(true)
                    }}>
                      <Td textAlign={"start"}>{email.subject}</Td>
                      <Td textAlign={"center"}><Text isTruncated width={"450px"} marginLeft={"auto"} marginRight={"auto"}>{email.content}</Text></Td>
                      {<Td textAlign={"end"}>{email.timestamp}</Td>}
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer> : 
          <Center flex='1' h={"100%"} flexDirection={"column"}>
            <Icon as={AiOutlineQuestion} fontSize={"300px"}/>
            <Text fontSize={"3xl"}>No emails found.</Text>
          </Center>}        
      </Box> : 
      <Flex flex="1" justifyContent={"center"} alignItems={"center"}>
        <Spinner thickness='4px' size={"xl"} color='blue.600' />
      </Flex>}
    </Flex>
  )
}

export default Home