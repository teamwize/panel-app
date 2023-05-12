import { useEffect, useState, useCallback } from 'react'
import { useForm } from "react-hook-form"
import doFetch from '../httpService.js'
import { PageToolbar } from '../components'
import { Dialog } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { UserIcon, CameraIcon } from '@heroicons/react/20/solid'

export default function Profile() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const [changeName, setChangeName] = useState(false)
  const [employeeInfo, setEmployeeInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [photo, setPhoto] = useState({})


  useEffect(() => {
    doFetch('http://localhost:8080/users/me', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }, [])

  const closeChangeName = () => setChangeName(false)

  const onCancel = () => {
    closeChangeName();
    reset()
  }

  const onSubmit = (data) => {
    let payload = {
      fullname: data.fullname
    }
    doFetch('http://localhost:8080/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }).then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
    closeChangeName();
    console.log(data)
  }


    return (
      <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
        <div className='pt-5 p-4'>
          <PageToolbar title='Profile'></PageToolbar>

          {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

          <main>
            <div className='mb-4'>
              <div>
                {/* <img src={employeeInfo.img} alt="Photo" /> */}
                {/* <img className="h-40 w-40 rounded-full right-0 left-0 mx-auto" src={photo} ref={cropperRef} />
              <div className='bg-indigo-600 w-12 h-12 flex items-center rounded-full absolute top-64 right-28'>
                <label className='right-0 left-0 mx-auto z-10 cursor-pointer' htmlFor="upload-photo">
                  <CameraIcon className='w-7 h-7 text-white'></CameraIcon>
                </label>
                <input onChange={handlePhotoChange} id='upload-photo' type="file" className='hidden' />
              </div> */}
              </div>


            </div>

            <div className='flex flex-col'>
              <div className='flex items-center mb-4'>
                <UserIcon className='w-8 h-8 mr-2'></UserIcon>

                <div onClick={() => setChangeName(true)} className='flex justify-between items-center shadow border border-gray-300 w-full rounded-md px-4 py-2'>
                  <button className='flex flex-col text-sm font-medium text-gray-900'>
                    <label className='text-xs font-medium text-gray-600' htmlFor="fullName">FullName</label>
                    employeeInfo.name
                  </button>

                  <PencilIcon className='w-4 h-4'></PencilIcon>
                </div>
              </div>

              <Dialog open={changeName} onClose={closeChangeName}>
                <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c]'>
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                      <div className='flex items-center mb-6'>
                        <h1 className='font-semibold'>Change FullName</h1>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)}>
                        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

                        <div className="mb-6">
                          <input {...register("fullname", { required: "FullName is required", maxLength: { value: 20, message: "The length of the fullname should be less than 20 characters" }, minLength: { value: 2, message: "The length of the fullname shouldn't be less than 2 characters" } })} aria-invalid={errors.fullname ? "true" : "false"} name="fullname" type="text" className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.fullname && <Alert>{errors.fullname.message}</Alert>}
                        </div>

                        <section className='flex text-center justify-center'>
                          <button onClick={onCancel} className='rounded-lg p-2 shadow-md border border-indigo-600 w-1/2'>Cancel</button>
                          <button type="submit" className='rounded-lg p-2 shadow-md ml-4 bg-indigo-600 text-white w-1/2'>Save</button>
                        </section>
                      </form>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    )
  }

  function Alert({ children }) {
    return (
      <p className="text-sm font-medium leading-6 text-red-900 mt-2" role="alert">{children}</p>
    )
  }