"use client"
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js';
export default function ModalSearch() {
      const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button
          onClick={() => setIsVisible(!isVisible)}
          className='border border-gray-300 rounded-full p-2'>
          <Icon icon="circum:search" width="24" height="24" />
        </button>
        <AnimatePresence>
          {isVisible &&
          <motion.div
            className='fixed inset-0 bg-black/10 flex  justify-center z-100'>
            <motion.div
              initial={{ height: 100, width: 100, opacity: 0}}
              animate={{ height: '60%', width: '100%', opacity:1 }}
              transition={{ duration: 0.5 }}
              exit={{height: 100, width: 100, opacity:0}}
              className='bg-white flex  justify-center p-4'

            >
              <div className="max-w-5xl max-auto w-full mt-20">
                <div className="search-wrap relative">
                  <input type='text' placeholder='Search for something' className='w-full border-gray-300 border-b py-2 px-10 outline-0' />
                  <Icon icon="iconamoon:search-thin" width="24" height="24" className='absolute top-1.5' />
                  <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute right-3">
                    <Icon icon="iconoir:cancel" width="24" height="24" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>
    </>
  )
}
