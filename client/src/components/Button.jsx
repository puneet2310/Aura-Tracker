import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-indigo-600',
    textColor = 'text-white',
    className = '',
    ...props // yha pr hmne sb additional props bhi add kr diye h jo user ne pass kiya hai
}) {
  return (
    <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} type={type} {...props}>
        {children}
    </button>
  )
}

export default Button


// here we make the common button component which we can use in our whole project