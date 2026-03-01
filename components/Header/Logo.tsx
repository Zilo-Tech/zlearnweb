import React from 'react'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href="/"
      className='text-[22px] md:text-[25px] font-semibold text-white flex items-center px-4 md:px-0 hover:opacity-90 transition-opacity'
      aria-label="Z-Learn home"
    >
      <span className='md:-ml-4'><span className=''>Z</span>-Learn</span>
    </Link>
  )
}
