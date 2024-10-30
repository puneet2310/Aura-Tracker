import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import axiosInstance from './utils/axios.helper'
import { getCurrentUser } from './hooks/getCurrentUser'


function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()  
  
  useEffect(() => {
    getCurrentUser(dispatch) // get current user data
    .then(() => {
      setLoading(false)
    })
    .catch((error) => {
      console.log(error)
    })

  }, [dispatch]) 

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
        <div className='w-full block'>
          <Header />
          <main >
            <Outlet />
          </main>
          <Footer/>
          <ToastContainer/>
        </div>
      </div>
  )
}

export default App
