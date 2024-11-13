import React from 'react'
import { FcBullish } from 'react-icons/fc'

function Logo({width = '10px'}) {
  return (
    // <img src={'https://www.goprotrack.com/assets/img/protrack_logo.png'} className='ml-4 h-12 w-12' alt='logo' width={width}/>
    <FcBullish fontSize={35}/>
  )
}

export default Logo