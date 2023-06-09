import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, redirect, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import Register from './components/Register'
import { refresh } from './components/api_requests'


function App() {
  const [auth, setAuth] = useState(false)

  function get_refresh() {
    refresh(localStorage.getItem('refresh'))
    .then(data => {
      localStorage.setItem("access", data.access)
      setAuth(false)
      redirect("/")
    })
    .catch(() => {
      if (localStorage.getItem("rescue") !== "forgotPassword")
      setAuth(true)
    })
  }


  useEffect(() => {
    localStorage.setItem("mailbox", "inbox")
    if (localStorage.getItem("rescue") === "forgotPassword") {
      redirect("/forgot-password")
    }

    if (localStorage.getItem("register")) {
      redirect("/register")
    } 

    else {
      get_refresh()

      setInterval(() => {
        get_refresh()
      }, 300000)
    }

  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        {auth && <Navigate to="/login" replace={true} />}
      </BrowserRouter>
    </>
  )
}

export default App