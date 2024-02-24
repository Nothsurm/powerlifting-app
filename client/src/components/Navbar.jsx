import { Navbar, Button, Dropdown } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '../redux/theme/theme.js';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../redux/api/userApiSlice.js';
import { logout } from '../redux/features/auth/authSlice.js';
import { toast } from 'react-toastify'

export default function Header() {
    const path = useLocation().pathname
    const { theme } = useSelector((state) => state.theme)
    const { userInfo } = useSelector((state) => state.auth)

    const [logoutApiCall] = useLogoutMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignout = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/signin')
            toast.success('Successfully logged out')
        } catch (error) {
            toast.error(error)
        }
    }

  return (
    <Navbar className='border-b-2 z-20 top-0 sticky'>
        <Link to='/' className='hidden sm:flex text-center flex-col'>
            <Button gradientDuoTone="tealToLime">RUSHDON</Button>
            <span className='text-xs font-semibold'>POWERLIFTING</span>
        </Link>
        <div className="flex flex-row gap-2">
            {userInfo ? (
                <Dropdown 
                    className='flex items-center'
                    arrowIcon={false}
                    inline
                    label = {userInfo.username}
                >
                    <Dropdown.Header>
                        <span className='block text-sm'>@{userInfo.username}</span>
                        <span className='block text-sm font-medium truncate'>{userInfo.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                </Dropdown>
            ) : (
                <Link to='/signin'>
                    <Button gradientDuoTone='tealToLime' outline className='w-14 sm:w-full'>
                        Login
                    </Button>
                </Link>
            )}
            <Button 
                className='w-10 sm:w-12 h-10' 
                color='gray' 
                pill 
                onClick={() => dispatch(toggleTheme())}
            >
                {theme === 'light' ? <FaMoon/> : <FaSun />}
            </Button>
            {userInfo ? (
                <></>
            ): (
                <Link to='/'>
                    <Button gradientDuoTone='pinkToOrange' outline className='w-16 sm:w-full'>
                        Register
                    </Button>
                </Link>
            )}
        </div>
        <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                <Link to='/projects'>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}
