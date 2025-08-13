import React, { useEffect } from 'react'
import { Signup as SignupComponent } from '../components'

function Signup() {
  // Log once on mount, not inside JSX
  useEffect(() => {
    console.log("signup in pages folder")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <SignupComponent />
      </div>
    </div>
  )
}

export default Signup
