import React from 'react'
import { FaSpinner } from 'react-icons/fa'

function Loading() {
  return (
    <div className="flex flex-col  items-center mt-8 min-h-screen">
        <FaSpinner className="animate-spin text-indigo-600 text-3xl" /> {/* Loader with spinning animation */}
        <p className='mt-4'>Please wait while loading...</p>
    </div>
  )
}

export default Loading