import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Navbar';

export default function App() {
  return (
    <>
      <ToastContainer />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

