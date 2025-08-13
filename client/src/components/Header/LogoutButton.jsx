import React from 'react'
import axiosInstance from '../../utils/axios.helper'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout as authLogout } from '../../store/authSlice'

function LogoutButton({ className = '' }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/users/logout')
      if (response.status === 200) {
        toast.success('Logged out successfully')
        localStorage.removeItem('access_token')
        dispatch(authLogout())
        navigate('/')
        window.location.reload()
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to log out. Please try again.")
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={`
        ${className}
        text-left w-full
      `}
    >
      Logout
    </button>
  )
}

export default LogoutButton
