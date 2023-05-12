import { navigation } from '../constants'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  return (
    <div className="min-h-0 flex-col md:bg-indigo-700 md:w-1/4 md:fixed md:top-0 md:bottom-0 md:left-0">

      <section className='md-size hidden md:block'>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300" alt="Off Tracker" />
          </div>
          <Navbar />
        </div>
        <Profile />
      </section>
      
      <section className='sm-size md:hidden'>
        <Disclosure as="nav" className='bg-indigo-700 shadow z-10 relative'>
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4">
                <div className="mr-2 flex flex-row-reverse h-16 justify-end items-center">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-indigo-300 ">
                    <div className='flex items-center justify-between absolute right-0 left-0 mx-6'>
                      <Bars3Icon className="h-7 w-9 border border-indigo-300 rounded" aria-hidden="true" />
                      <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300" alt="Off Tracker" />
                    </div>
                  </Disclosure.Button>
                </div>
              </div>
              <Disclosure.Panel className="w-full shadow z-10" style={{ height: 'calc(100vh - 64px)' }}>
                <div className='flex flex-col justify-between'>
                  <Navbar />
                  <Profile />
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </section>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="md:mt-5 flex-1 space-y-1 md:px-2 border-t mx-4 border-indigo-300 md:border-0 md:mx-0" aria-label="Sidebar">
      {navigation.map((item) => (
        <a key={item.name} href={item.href} className={classNames(item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 ', 'group flex items-center rounded-md px-2 py-2 text-sm font-medium my-2')}>
          <item.icon className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300" aria-hidden="true" />
          <span className="flex-1">{item.name}</span>
        </a>
      ))}
    </nav>
  )
}

function Profile() {
  return (
    <div className="flex flex-shrink-0 border-t border-indigo-800 p-4 absolute bottom-0 w-full">
      <a href="#" className="group block w-full flex-shrink-0">
        <div className="flex items-center">
          <img className="inline-block h-9 w-9 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Tom Cook</p>
            <p className="text-xs font-medium text-indigo-200 group-hover:text-white">View profile</p>
          </div>
        </div>
      </a>
    </div>
  )
}