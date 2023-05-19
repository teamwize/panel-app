import Root from './routes/root'
import { useContext } from "react"
import { Sidebar } from './components'
import { UserContext } from "./contexts/UserContext.jsx"

export default function App() {
  const { user, logout, isAuthenticated } = useContext(UserContext);

  return (
    <div className='md:flex md:flex-wrap md:h-screen md:justify-center'>
      {isAuthenticated() && <Sidebar user={user} logout={logout} />}
      <Root />
    </div>
  )
}