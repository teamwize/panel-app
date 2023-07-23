import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { hexToRgb } from '@material-ui/core'
import he from 'date-fns/esm/locale/he/index.js'

const example = [
  {
    month: 'June 2023',
    holidays: [
      { date: 'June 4th', weekday: 'Sunday', name: 'Death of khomeini' },
      { date: 'June 5th', weekday: 'Monday', name: 'Revolt of Khordad' },
    ]
  },
  {
    month: 'September 2023',
    holidays: [
      { date: 'September 23rd', weekday: 'Saturday', name: 'September Equinox' }
    ]
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function OfficialHolidays() {
  const navigate = useNavigate()
  const goBack = () => navigate('/settings');

  return (
    <div className='md:w-4/5 overflow-y-auto w-full fixed mb-2 top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Official Holidays</h1>
        </div>

        <div className="-my-[9px] sm:-mx-6 lg:-mx-8 px-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <tbody className="bg-gray-50 dark:bg-gray-800">{example.map((e) => <HolidayTable e={e} key={e.month} />)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function HolidayTable({ e }) {
  return (
    <Fragment>
      <tr className="border-t border-gray-200 dark:border-gray-700">
        <th colSpan={5} scope="colgroup" className="bg-gray-100 dark:bg-gray-900 py-2 pl-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">{e.month}</th>
      </tr>
      {e.holidays.map((h, hIdx) => <HolidaysItem h={h} hIdx={hIdx} key={h.date} />)}
    </Fragment>
  )
}

function HolidaysItem({ h, hIdx }) {
  return (
    <tr className={classNames(hIdx === 0 ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700', 'border-t')}>
      <td className="whitespace-nowrap px-2 py-3 text-sm text-gray-700 dark:text-gray-200">{h.date}</td>
      <td className="whitespace-nowrap px-2 py-3 text-sm text-gray-700 dark:text-gray-200">{h.weekday}</td>
      <td className="whitespace-nowrap px-2 py-3 text-sm text-gray-700 dark:text-gray-200">{h.name}</td>
    </tr>
  )
}