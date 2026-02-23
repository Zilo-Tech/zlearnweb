import Link from 'next/link'

export default function ActionButton() {
  return (
    <div className='px-4 flex gap-3 items-center'>
      <Link href="/auth/login" className='border border-white rounded px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-primary-950 transition'>
        Log In
      </Link>
      <Link href="/auth/register" className='bg-primary-500 text-white rounded px-4 py-2 text-sm font-semibold hover:bg-primary-400 transition'>
        Sign Up
      </Link>
    </div>
  )
}
