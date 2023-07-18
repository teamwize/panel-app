import Root from './modules/routes'
import { useContext } from "react"
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
    </ThemeProvider>
  )
}