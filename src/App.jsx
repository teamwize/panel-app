import Root from './modules/routes'
import { useContext } from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from './core/components'
import { UserContext } from './contexts/UserContext';
import {ThemeContextProvider} from './contexts/ThemeContext'


export default function App() {
  const { user, logout, isAuthenticated } = useContext(UserContext);

  return (
    <ThemeContextProvider>
      <div className='md:flex md:flex-wrap md:h-screen h-full md:justify-center bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200'>
        {isAuthenticated() && <Sidebar user={user} logout={logout} />}
        <Root />
      </div>
      <ToastContainer toastClassName={"relative flex p-1 min-h-10 shadow-sm text-sm md:text-base rounded-md justify-between overflow-hidden cursor-pointer border border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800"}  position="top-right" hideProgressBar autoClose={5000} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </ThemeContextProvider>
  )
}