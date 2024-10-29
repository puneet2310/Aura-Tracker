import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
function Home() {

    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.auth.user)
    const authStatus = useSelector((state) => state.auth.status)

  return (
    <div>Welcome {user}</div>
  )
}

export default Home