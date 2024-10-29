import React from 'react'
import axiosInstance from '../../utils/axios.helper'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout as authLogout } from '../../store/authSlice'
function LogoutButton() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      
      const response = await axiosInstance.post('/users/logout')
      
      if (response.status === 200) {
        localStorage.removeItem('access_token')
        console.log('Logout success')
        dispatch(authLogout())
        toast.success('Logged out successfully')
        window.location.reload()
        navigate('/')
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to log out. Please try again.")
    }
  }
  return (
    <button
    onClick={handleLogout}
    className='inline-block px-6 py-2 transition duration-200 transform hover:scale-90 hover:bg-slate-600 hover:text-white rounded-full text-gray-300'
    >Logout</button>
  )
}

export default LogoutButton