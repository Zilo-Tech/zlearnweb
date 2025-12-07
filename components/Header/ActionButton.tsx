import React from 'react'

export default function ActionButton() {
  return (
    <div className='px-4 flex gap-3 items-center'>
          <button className='bg-primary-950 rounded px-4 py-2 text-white text-[14px]'>Log In</button>
        <button className='border border-default rounded px-4 py-2 text-[14px] text-white'>Sign Up</button>
    </div>
  )
}
