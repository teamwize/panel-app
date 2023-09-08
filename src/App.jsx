import Root from './modules/routes'
import { useContext } from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from './core/components'
import { UserContext, ThemeProvider } from './contexts';

export default function App() {
  const { user, logout, isAuthenticated } = useContext(UserContext);

  return (
    <ThemeProvider>
      <div className='md:flex md:flex-wrap md:h-screen h-full md:justify-center bg-gray-100 dark:bg-gray-900'>
        {isAuthenticated() && <Sidebar user={user} logout={logout} />}
        <Root />
      </div>
      <ToastContainer toastClassName={"relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"}  position="top-right" hideProgressBar autoClose={5000} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </ThemeProvider>
  )
}