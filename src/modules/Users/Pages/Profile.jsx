import { useEffect, useState, useContext } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { employee, updateEmployee, updateEmployeePicture } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Toolbar, Button } from '~/core/components'
import { UserContext } from '../../../contexts/index.js'
import AvatarEditor from "react-avatar-editor"
import { Slider } from "@material-ui/core"
import { Dialog } from '@headlessui/react'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { UserIcon, CameraIcon } from '@heroicons/react/20/solid'

export default function Profile() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [employeeInfo, setEmployeeInfo] = useState({})
  const [logOut, setLogOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  })

  //employee information
  useEffect(() => {
    employee().then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    });
  }, [])

  //change picture
  const handleFileChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    })
  }

  //change full name
  const onSubmit = (data) => {
    let payload = {
      fullname: data.fullname
    }
    setIsProcessing(true);

    updateEmployee(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    });
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0 mb-2 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Profile'>
          <button onClick={() => setLogOut(true)} className='flex items-center w-full rounded-md bg-red-700 text-white p-2 text-sm font-semibold shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800'>
            <ArrowLeftOnRectangleIcon className='w-5 h-5 text-gray-400 mr-2'></ArrowLeftOnRectangleIcon>
            Log Out
          </button>
        </Toolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <Logout logOut={logOut} setLogOut={setLogOut}></Logout>

        <main className='px-4'>
          <div>
            <div className='w-40 flex flex-col right-0 left-0 mx-auto'>
              <img src={picture.croppedImg} className="h-40 w-40 rounded-full" />
              <div className='bg-indigo-500 w-12 h-12 flex flex-row items-center rounded-full relative bottom-10 left-24'>
                <label className='right-0 left-0 mx-auto z-10 cursor-pointer' htmlFor="upload-photo">
                  <CameraIcon className='w-7 h-7 text-white'></CameraIcon>
                </label>
                <input key={picture.img} id='upload-photo' type="file" accept="image/jpeg, image/png" className='hidden' onChange={handleFileChange} />
              </div>
            </div>

            <ChangePicture picture={picture} setPicture={setPicture}></ChangePicture>
          </div>

          <div className='flex flex-col'>
            <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200 border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">Information</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

              <div className='w-full'>
                <label className="block text-sm leading-6 mb-2" htmlFor="fullName">Full Name</label>
                <input {...register("fullname", { required: "FullName is required", maxLength: { value: 20, message: "FullName must be under 20 characters" }, minLength: { value: 2, message: "FullName must be over 2 characters" } })}
                  aria-invalid={errors.fullname ? "true" : "false"} name="fullname" type="text"
                  className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 px-4 py-1.5 shadow-sm placeholder:text-gray-600 text-sm md:text-base sm:leading-6 " />
                {errors.fullname && <Alert>{errors.fullname.message}</Alert>}
              </div>

              <Button type='submit' isProcessing={isProcessing} text='Save' className=' flex justify-center w-full md:w-1/4 mt-4'></Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-800 mt-2" role="alert">{children}</p>
  )
}

function Logout({ setLogOut, logOut }) {
  const navigate = useNavigate()
  const { logout } = useContext(UserContext)

  const closeLogOut = () => setLogOut(false)

  //logout
  const handleRequest = (accepted) => {
    if (accepted) {
      logout();
      navigate('/login')
    }
    closeLogOut()
  }

  return (
    <Dialog open={logOut} onClose={closeLogOut}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-40'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 p-6 text-left align-middle transition-all">
            <div className='flex items-center mb-6'>
              <ArrowLeftOnRectangleIcon className='w-5 h-5 mr-2 cursor-pointer text-red-600'></ArrowLeftOnRectangleIcon>
              <h1 className='font-semibold md:text-lg'>Log Out</h1>
            </div>

            <p className="fullname text-sm text-center mb-12">Are you sure you want to log out?</p>

            <section className='flex text-center justify-center'>
              <button onClick={() => handleRequest(false)} className='rounded-lg p-2 shadow-md border border-red-600 w-1/2'>No</button>
              <button onClick={() => handleRequest(true)} className='rounded-lg p-2 shadow-md ml-4 bg-red-600 text-indigo-100 w-1/2'>Yes</button>
            </section>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

function ChangePicture({ picture, setPicture }) {
  var editor = ""

  const setEditorRef = (ed) => editor = ed;

  const handleSlider = (event, value) => {
    event.preventDefault();
    setPicture({
      ...picture,
      zoom: value
    })
  }

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false
    })
  }

  const handleSave = (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg
      })

      let payload = {
        picture: croppedImg
      }
      updateEmployeePicture(payload).then(data => {
        console.log('Success:', data);
      }).catch(error => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
    }
  }

  return (
    <Dialog open={picture.cropperOpen} onClose={() => setPicture({ ...picture, cropperOpen: false })}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-50'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 p-6 text-left align-middle transition-all">
            <div className='flex items-center mb-6'>
              <UserIcon className='w-5 h-5 text-indigo-500 mr-2'></UserIcon>
              <h1 className='font-semibold md:text-lg'>Set Profile Photo</h1>
            </div>

            <AvatarEditor ref={setEditorRef} image={picture.img} width={200} height={200} border={20} color={[255, 255, 255, 0.6]} className='right-0 left-0 mx-auto' rotate={0} scale={picture.zoom} />

            <Slider aria-label="raceSlider" value={picture.zoom} min={1} max={10} step={0.1} onChange={handleSlider}></Slider>

            <section className='flex text-center justify-center'>
              <button onClick={handleCancel} className='rounded-lg p-2 shadow-md border border-indigo-600 w-1/2'>Cancel</button>
              <button onClick={handleSave} className='rounded-lg p-2 shadow-md ml-4 bg-indigo-600 w-1/2'>Save</button>
            </section>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}