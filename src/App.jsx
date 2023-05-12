import Root from './routes/root'
import { Sidebar } from './components'

export default function App() {
  let showSidebar = true;

  if (window.location.pathname == '/login' || window.location.pathname == '/register') {
    showSidebar = false
  }
  return (
    <div className='md:flex md:flex-wrap md:h-screen md:justify-center'>
      {showSidebar ? <Sidebar /> : ''}
      <Root />
    </div>
  )
}