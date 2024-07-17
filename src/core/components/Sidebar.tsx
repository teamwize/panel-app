import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentEmployee, getEmployee } from '../../services/WorkiveApiClient'
import { navigation } from '../../constants'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Logo } from '.'
import { Location, Navigation, UserResponse } from '~/constants/types'

type SidebarProps = {
  user: UserResponse | null;
  logout: ()=> void
}

export default function Sidebar({user, logout}: SidebarProps) {

  return (
    <div className="min-h-0 flex-col md:w-1/5 min-w-min max-w-[17%] md:fixed md:top-0 md:bottom-0 md:left-0 border-b md:border-r border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-gray-100">
      <section className='md-size hidden md:block'>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-6">
            <Logo className="h-8 w-auto" />
          </div>
          <Navbar close={close} />
        </div>
        <Profile user={user} close={close} />
      </section>

      <section className='sm-size md:hidden fixed z-20 bg-gray-100 dark:bg-gray-900 w-full'>
        <Disclosure as="nav" className='border-b border-gray-200 dark:border-gray-800 shadow z-10 relative'>
          <>
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex flex-row-reverse h-16 justify-end items-center">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-indigo-500">
                  <div className='flex items-center justify-between absolute right-0 left-0 mx-6'>
                    <Bars3Icon className="h-7 w-7" aria-hidden="true" />
                    <Logo className="h-8 w-auto" />
                  </div>
                </Disclosure.Button>
              </div>
            </div>

            <Disclosure.Panel className="w-full shadow z-10" style={{ height: 'calc(100vh - 64px)' }}>
              {({ close }) => (
                <div className='flex flex-col justify-between'>
                  <Navbar close={close} />
                  <Profile close={close} user={user} />
                </div>
              )}
            </Disclosure.Panel>
          </>
        </Disclosure>
      </section>
    </div>
  )
}

type NavbarProps = {
  close: () => void;
}

function Navbar({ close }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleOptionClick = (href: string) => {
    setSelectedOption(href)
    navigate(href);
    if (close) {
      close()
    };
  }

  return (
    <nav className="md:mt-5 flex-1 px-4 border-t border-gray-200 dark:border-gray-800 md:border-0 md:mx-0"
      aria-label="Sidebar">
      {navigation.map((item) =>
        <NavigationItem item={item} key={item.name} handleOptionClick={handleOptionClick}
          location={location} selectedOption={selectedOption} />)}
    </nav>
  )
}

type NavigationItemProps = {
  item: Navigation;
  handleOptionClick: (href: string) => void;
  location: Location;
  selectedOption: string;
}

function NavigationItem({ item, handleOptionClick, location, selectedOption }: NavigationItemProps) {
  return (
    <button onClick={() => handleOptionClick(item.href)}
      className={`group flex w-full text-left items-center rounded-md p-2 mt-2 text-xs md:text-sm font-semibold dark:text-indigo-200 dark:hover:bg-indigo-700 hover:bg-indigo-200 hover:bg-opacity-75
      ${location.pathname === item.href || selectedOption === item.href ? 'bg-indigo-100 dark:bg-indigo-800 bg-opacity-75' : ''}`}>
      <item.icon className="mr-2 h-7 w-7 flex-shrink-0 text-indigo-500" aria-hidden="true" />
      <span className="flex-1 text-indigo-900 dark:text-indigo-200">{item.name}</span>
    </button>
  )
}

type ProfileProps = {
  close: () => void;
  user: UserResponse | null;
}

function Profile({ close, user }: ProfileProps) {
  const navigate = useNavigate()

  const viewProfile = () => {
    if (close) {
      close()
    };
    navigate("/profile")
  }

  return (
    <div onClick={viewProfile} className="flex p-4 absolute bottom-0 w-full right-0 left-0 cursor-pointer">
      <div className="flex items-center hover:bg-indigo-200 dark:hover:bg-indigo-700 hover:bg-opacity-75 rounded-md w-full p-2">
        <img className="inline-block h-7 w-7 rounded-full mr-2"
          src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
        <p className="text-xs md:text-sm font-semibold text-indigo-900 dark:text-indigo-200">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
    </div>
  )
}