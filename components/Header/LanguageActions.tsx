import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { code: 'en', name: 'English', flag: 'twemoji:flag-united-states' },
  { code: 'es', name: 'Español', flag: 'twemoji:flag-spain' },
  { code: 'fr', name: 'Français', flag: 'twemoji:flag-france' },
  { code: 'de', name: 'Deutsch', flag: 'twemoji:flag-germany' },
  { code: 'it', name: 'Italiano', flag: 'twemoji:flag-italy' },
  { code: 'pt', name: 'Português', flag: 'twemoji:flag-portugal' },
  { code: 'ru', name: 'Русский', flag: 'twemoji:flag-russia' },
  { code: 'zh', name: '中文', flag: 'twemoji:flag-china' },
  { code: 'ja', name: '日本語', flag: 'twemoji:flag-japan' },
  { code: 'ko', name: '한국어', flag: 'twemoji:flag-south-korea' },
  { code: 'ar', name: 'العربية', flag: 'twemoji:flag-saudi-arabia' },
  { code: 'hi', name: 'हिन्दी', flag: 'twemoji:flag-india' },
  { code: 'tr', name: 'Türkçe', flag: 'twemoji:flag-turkey' },
  { code: 'nl', name: 'Nederlands', flag: 'twemoji:flag-netherlands' },
  { code: 'pl', name: 'Polski', flag: 'twemoji:flag-poland' },
  { code: 'sv', name: 'Svenska', flag: 'twemoji:flag-sweden' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'twemoji:flag-vietnam' },
  { code: 'th', name: 'ไทย', flag: 'twemoji:flag-thailand' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'twemoji:flag-indonesia' },
  { code: 'cs', name: 'Čeština', flag: 'twemoji:flag-czechia' },
]

export default function LanguageActions() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  return (
    <div className=''>
      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex gap-2 items-center hover:opacity-80 transition-opacity text-white md:text-gray-800">
              <Icon icon={selectedLanguage.flag} className='hidden md:block' width="24" height="24" />
              <span className="font-semibold">{selectedLanguage.name}</span>
              <Icon icon="mage:chevron-down" width="20" height="20" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-[90vh] overflow-y-auto mr-10">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setSelectedLanguage(language)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon icon={language.flag} width="20" height="20" />
                  <span className='font-semibold '>{language.name}</span>
                  {selectedLanguage.code === language.code && (
                    <Icon 
                      icon="mdi:check" 
                      width="16" 
                      height="16" 
                      className="ml-auto text-primary"
                    />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}