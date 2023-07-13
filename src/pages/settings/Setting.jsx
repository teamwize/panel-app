import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeeList } from "../../services/WorkiveApiClient.js"
import { Switch } from '@headlessui/react'
import { Toolbar } from '../../components/index.js'
import { LockClosedIcon, GlobeAltIcon, MoonIcon } from '@heroicons/react/24/outline'
import { ThemeContext } from '../../contexts/index.js'


export default function Setting() {
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const navigate = useNavigate()

  const viewChangePassword = () => {
    navigate('/settings/change-password')
  }

  const viewOfficialHolidays = () => {
    navigate('/settings/official-holiday')
  }

  useEffect(() => {
    employeeList().then(data => {
      console.log('Success:', data);
      setEmployeesList(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    });
  }, [])

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200'>
      <div className='pt-4 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Account'></Toolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <main className='px-4'>
          <div className='flex items-center mb-4'>
            <img className="inline-block h-11 w-11 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
            <p className="text-sm font-semibold md:text-base">e.name</p>
          </div>

          <button onClick={viewChangePassword} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <LockClosedIcon className='w-5 h-5 mr-2'></LockClosedIcon>
            Change Password
          </button>

          <button onClick={viewOfficialHolidays} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <GlobeAltIcon className='w-5 h-5 mr-2'></GlobeAltIcon>
            Official Holidays
          </button>

          <div className='flex justify-between items-center text-sm font-semibold md:text-base'>
            <div className='flex items-center'>
              <MoonIcon className='w-5 h-5 mr-2' />
              Dark mode
            </div>
            <Switch checked={isDarkMode} onChange={toggleDarkMode} className={classNames(isDarkMode ? 'bg-indigo-600' :
              'bg-gray-300', 'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2')}>
              <span aria-hidden="true" className={classNames(isDarkMode ? 'translate-x-5' :
                'translate-x-0', 'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out')} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  )
}