import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import AvatarEditor from "react-avatar-editor"
import { Slider } from "@material-ui/core"
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { Dialog } from '@headlessui/react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { UserIcon, CameraIcon } from '@heroicons/react/20/solid'

export default function Profile() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const [employeeInfo, setEmployeeInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
  })
  var editor = ""

  const goBack = () => navigate('/setting');

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

  const onSubmit = (data) => {
    let payload = {
      fullname: data.fullname
    }
    setIsProcessing(true);

    doFetch('http://localhost:8080/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
    console.log(data)
  }

  const handleFileChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    })
  }

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
      doFetch('http://localhost:8080/users/me', {
        method: 'POST',
        body: JSON.stringify(payload),
      }).then(data => {
        console.log('Success:', data);
      }).catch(error => {
        console.error('Error:', error);
        setErrorMessage(error.error)
      })
    }
  }


  return (
    <div className='md:w-5/6 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0 mb-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 p-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Profile Photo</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <main>
          <div>
            <div className='w-40 flex flex-col right-0 left-0 mx-auto'>
              <img src={picture.croppedImg} className="h-40 w-40 rounded-full" />
              <div className='bg-indigo-600 w-12 h-12 flex flex-row items-center rounded-full relative bottom-10 left-24'>
                <label className='right-0 left-0 mx-auto z-10 cursor-pointer' htmlFor="upload-photo">
                  <CameraIcon className='w-7 h-7 text-white'></CameraIcon>
                </label>
                <input key={picture.img} id='upload-photo' type="file" className='hidden' onChange={handleFileChange} />
              </div>
            </div>

            <Dialog open={picture.cropperOpen} onClose={() => setPicture({ ...picture, cropperOpen: false })}>
              <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#11111138] z-50'>
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                    <div className='flex items-center mb-6'>
                      <UserIcon className='w-6 h-6 mr-2'></UserIcon>
                      <h1 className='font-semibold'>Set Profile Photo</h1>
                    </div>

                    <AvatarEditor ref={setEditorRef} image={picture.img} width={200} height={200} border={50} color={[255, 255, 255, 0.6]} rotate={0} scale={picture.zoom} />

                    <Slider aria-label="raceSlider" value={picture.zoom} min={1} max={10} step={0.1} onChange={handleSlider}></Slider>

                    <section className='flex text-center justify-center'>
                      <button onClick={handleCancel} className='rounded-lg p-2 shadow-md border border-indigo-600 w-1/2'>Cancel</button>
                      <button onClick={handleSave} className='rounded-lg p-2 shadow-md ml-4 bg-indigo-600 text-white w-1/2'>Save</button>
                    </section>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          </div>

          <div className='flex flex-col'>
            <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">Profile Info</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

              <div className='w-full'>
                <label className="block text-sm font-semibold md:text-base leading-6 mb-2" htmlFor="fullName">FullName</label>
                <input placeholder="employeeInfo.name" {...register("fullname", { required: "FullName is required", maxLength: { value: 20, message: "FullName must be under 20 characters" }, minLength: { value: 2, message: "FullName must be over 2 characters" } })}
                  aria-invalid={errors.fullname ? "true" : "false"} name="fullname" type="text"
                  className="block w-full rounded-md border dark:border-gray-700 border-gray-200 px-4 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 " />
                {errors.fullname && <Alert>{errors.fullname.message}</Alert>}
              </div>

              <button type="submit" className='flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4'>
                {isProcessing ? "Waiting ..." : "Save"}
              </button>
            </form>
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