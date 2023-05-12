import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'
import { Dialog } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import doFetch from '../httpService.js'
import { PageToolbar } from '../components'
import { leaveTypeJson } from '../constants/index.js'

export default function QueueRequest() {
    const [requestsList, setRequestsList] = useState([]);
    const [requestDetails, setRequestDetails] = useState(false);

    const handleModal = () => setRequestDetails(false);

    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        doFetch('http://localhost:8080/days-off', {
            method: 'GET'
        }).then(data => {
            console.log('Success:', data);
            setRequestsList(data);
        }).catch(error => {
            console.error('Error:', error);
            setErrorMessage(error.error);
        });
    }, [])

    const handleRequest = (status, id) => {
        let payload = {
            status: status
        }
        doFetch('http://localhost:8080/days-off/' + id, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        }).then(data => {
            console.log('Success:', data);
            setRequestsList(prevState => prevState.filter(r => r.id !== id));
            handleModal();
        }).catch(error => {
            console.error('Error:', error);
            setErrorMessage(error.error);
        });
    }

    const navigate = useNavigate();
    const viewBalance = (requestName) => {
        navigate('/balance?query=' + requestName)
    }

    return (
        <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
            <div className='pt-5 px-4'>
                <PageToolbar title='Leave Request Queue'></PageToolbar>

                {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

                {requestsList.map((request) => <div key={request.id} className='mx-2 mb-2 border-b pb-4'>
                    <Request request={request} setRequestDetails={setRequestDetails} />

                    <Modal request={request} requestDetails={requestDetails} handleModal={handleModal} handleRequest={handleRequest} viewBalance={viewBalance} />
                </div>)}
            </div>
        </div>
    )
}

function Request({ request, setRequestDetails }) {
    return (
        <section onClick={() => setRequestDetails(true)} className='flex flex-row items-center'>
            <img className="inline-block h-12 w-12 rounded-full mr-4" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />

            <div>
                <p className="fullname font-semibold mb-1">request.name</p>

                <div className='mb-1 flex'>
                    <p className='start text-xs text-gray-600 flex items-center mr-4'>
                        <CalendarIcon className='w-4 h-4 mr-1' />
                        {format(new Date(request.start), 'PP')}
                    </p>
                    <p className='end text-xs text-gray-600 flex items-center'>
                        <CalendarIcon className='w-4 h-4 mr-1' />
                        {format(new Date(request.end), 'PP')}
                    </p>
                </div>

                <div className='flex'>
                    <p className='type text-xs text-gray-600 mr-1'>{leaveTypeJson[request.type]} :</p>
                    <p className='distance text-xs text-red-700 mb-1'>request.distance {(request.distance) == 1 ? "Day" : "Days"} off</p>
                </div>
            </div>
        </section>
    )
}

function Modal({ request, requestDetails, handleModal, handleRequest, viewBalance }) {
    return (
        <Dialog open={requestDetails} onClose={handleModal}>
            <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#11111105]'>
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                        <section className='flex flex-col items-start mb-4 cursor-pointer'>
                            <div className='flex items-center mb-2'>
                                <img className="inline-block h-12 w-12 rounded-full mr-4" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />

                                <div>
                                    <p className="fullname font-semibold">request.name</p>
                                    <p onClick={() => viewBalance(request.name)} className="text-sm text-blue-600">View balance</p>
                                </div>
                            </div>

                            <div>
                                <div className='mb-1 flex'>
                                    <p className='start text-sm text-gray-600 flex items-center mr-4'>
                                        <label htmlFor='start' className="mr-1 text-xs">Start:</label>
                                        {format(new Date(request.start), 'PP')}
                                    </p>

                                    <p className='end text-sm text-gray-600 flex items-center'>
                                        <label htmlFor='end' className="mr-1 text-xs">End:</label>
                                        {format(new Date(request.end), 'PP')}
                                    </p>
                                </div>

                                <div className='flex'>
                                    <p className='type text-sm text-gray-600 mr-1'>{leaveTypeJson[request.type]} :</p>
                                    <p className='distance text-sm text-gray-600 mb-1'>request.distance {(request.distance) == 1 ? "Day" : "Days"} off</p>
                                </div>

                                <p className='reason text-sm text-gray-600 mb-1'>
                                    <label htmlFor='explanation' className="mr-1 text-xs">Explanation:</label>
                                    request.reason</p>

                                <p className='distance text-xs text-gray-400'>Created at: {format(new Date(request.createdAt), 'PP')}</p>
                            </div>
                        </section>

                        <section className='flex text-center justify-center'>
                            <button onClick={() => handleRequest('REJECTED', request.id)} className='rounded-lg p-2 text-white shadow-md bg-red-500 w-1/2'>Reject</button>
                            <button onClick={() => handleRequest('ACCEPTED', request.id)} className='rounded-lg p-2 text-white shadow-md ml-4 bg-green-500 w-1/2'>Accept</button>
                        </section>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}