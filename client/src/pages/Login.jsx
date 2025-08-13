import React from 'react'
import { Login as LoginComponent } from '../components'

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <LoginComponent />
      </div>
    </div>
  )
}

export default Login
