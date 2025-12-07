"use client"
import Logo from './Logo'
import NavItems from './NavItems'
import ActionButton from './ActionButton'
import ModalSearch from '../Seachbar/ModalSearch'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'
import LanguageActions from './LanguageActions'


// Main Header Component
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between  pr-4 md:px-2 xl:px-8 py-4 bg-primary-950 '>
        <div className="left-section flex items-center gap-10">
          <Logo />
          <div className="hidden min-[1300px]:block text-gray-800">
            <NavItems />
          </div>
        </div>
        <div className="right-section flex items-center gap-4 xl:gap-0">
          <ModalSearch />
          <div className='hidden min-[1400px]:block'>
            <ActionButton />
          </div>
          <LanguageActions />
          <button
            className="min-[1400px]:hidden text-white "
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon
              icon={isMobileMenuOpen ? "ion:close" : "hugeicons:menu-11"}
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="min-[1400px]:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-8 py-6">
            <NavItems isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
