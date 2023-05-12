import { PageToolbar } from '../components'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function PendingRequest() {
    return (
        <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
            <div className='pt-5 p-4'>
                <PageToolbar title='Pending Request'></PageToolbar>

                <div className='flex flex-col justify-center items-center text-center absolute top-0 bottom-0 right-0 left-0'>
                    <ClockIcon className="h-9 w-9 mb-2" aria-hidden="true"></ClockIcon>
                    <p className='font-semibold'>Your request has been registered. <br /> The result will be sent.</p>
                </div>
            </div>
        </div>
    )
}