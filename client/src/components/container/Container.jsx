import React from 'react'

function Container({children}) {
  return (
    <div className=' w-full mx-auto px-2 max-w-screen-xl'>
        {children}
    </div>
  );
}

export default Container

//container ke andr children ko pass karenge
//container bs sirf ek box hota hai jiski height width styling define krte hai
