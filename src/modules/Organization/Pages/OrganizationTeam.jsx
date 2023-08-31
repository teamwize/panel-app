import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const example = [
  {name: 'Financial', count: '2'},
  {name: 'Support', count: '5'},
  {name: 'Sales', count: '3'},
  {name: 'Technical', count: '4'}
]

export default function OrganizationTeam() {
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  const goBack = () => navigate('/organization');

  const viewCreateTeam = () => {
    navigate('/organization/team/create')
  }

  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <div className='flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
            </button>
            <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Teams</h1>
          </div>

          <button onClick={viewCreateTeam} className='flex items-center rounded-lg px-2 py-1 shadow-sm bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            <PlusIcon className='h-5 w-5 mr-2 text-gray-400'></PlusIcon>
            Add Team
          </button>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <div className="-my-[9px] sm:-mx-6 lg:-mx-8 px-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="w-full divide-y divide-gray-300">
              <thead>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <th scope="col" className="bg-gray-100 dark:bg-gray-900 py-2 pl-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 w-1/2">Team</th>
                  <th scope="col" className="bg-gray-100 dark:bg-gray-900 py-2 pl-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 w-1/2">Members</th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 dark:bg-gray-800 w-full">{example.map((e, hIdx) => <TeamTable e={e} key={e.name} hIdx={hIdx} />)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamTable({ e, hIdx }) {
  return (
    <tr className={classNames(hIdx === 0 ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700', 'border-t')}>
      <td className="whitespace-nowrap px-2 py-3 text-sm text-gray-700 dark:text-gray-200">{e.name}</td>
      <td className="whitespace-nowrap px-2 py-3 text-sm text-gray-700 dark:text-gray-200">{e.count} members</td>
    </tr>
  )
}