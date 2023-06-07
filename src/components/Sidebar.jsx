import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { navigation, logo } from '../constants'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  return (
    <div className="min-h-0 flex-col md:w-1/6 md:fixed md:top-0 md:bottom-0 md:left-0 border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-gray-100">
      <section className='md-size hidden md:block'>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <img className="h-8 w-auto" src={logo.src} alt={logo.alt} />
          </div>
          <Navbar/>
        </div>
        <Profile />
      </section>

      <section className='sm-size md:hidden fixed z-20 bg-gray-100 dark:bg-gray-900 w-full'>
        <Disclosure as="nav" className='border-b border-gray-100 dark:border-gray-700 shadow z-10 relative'>
          <>
            <div className="mx-auto max-w-7xl px-4">
              <div className="mr-2 flex flex-row-reverse h-16 justify-end items-center">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                  <div className='flex items-center justify-between absolute right-0 left-0 mx-6'>
                    <Bars3Icon className="h-7 w-7" aria-hidden="true" />
                    <img className="h-8 w-auto" src={logo.src} alt={logo.alt} />
                  </div>
                </Disclosure.Button>
              </div>
            </div>

            <Disclosure.Panel className="w-full shadow z-10" style={{ height: 'calc(100vh - 64px)' }}>
              {({ close }) => (
                <div className='flex flex-col justify-between'>
                  <Navbar/>
                  <Profile close={close} />
                </div>
              )}
            </Disclosure.Panel>
          </>
        </Disclosure>
      </section>
    </div>
  )
}

function Navbar() {
  const location = useLocation()
  const [selectedOption, setSelectedOption] = useState("")

  const handleOptionClick = (href) => {
    setSelectedOption(href)
  }

  return (
    <nav className="md:mt-5 flex-1 px-4 border-t border-gray-200 dark:border-gray-700 md:border-0 md:mx-0" aria-label="Sidebar">
      {navigation.map((item) => (
        <a onClick={() => handleOptionClick(item.href)} key={item.name} href={item.href} className={`group flex items-center rounded-md py-2 px-1 mt-2 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-200 dark:hover:bg-indigo-400 hover:bg-indigo-100 hover:bg-opacity-75
        ${location.pathname === item.href || selectedOption === item.href ? 'bg-indigo-200 dark:bg-indigo-600 bg-opacity-75' : ''}`}>
          <item.icon className="mr-2 h-7 w-7 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <span className="flex-1 text-gray-600 dark:text-gray-300">{item.name}</span>
        </a>
      ))}
    </nav>
  )
}

function Profile({ close }) {
  const navigate = useNavigate()

  const viewProfile = () => {
    if (close) {
      close()
    };
    navigate("/setting/profile")
  }

  return (
    <div onClick={viewProfile} className="flex p-4 absolute bottom-0 w-full right-0 left-0">
      <div className="flex items-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:bg-opacity-75 rounded-md w-full">
        <img className="inline-block h-9 w-9 rounded-full p-1" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-2">Tom Cook</p>
      </div>
    </div>
  )
}