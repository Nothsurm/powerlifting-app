import { Navbar, Button } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '../redux/theme/theme.js';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
    const path = useLocation().pathname
    const { theme } = useSelector((state) => state.theme)

    const dispatch = useDispatch()
  return (
    <Navbar className='border-b-2 z-20 top-0 sticky'>
        <Link to='/' className='hidden sm:flex text-center flex-col'>
            <Button gradientDuoTone="tealToLime">RUSHDON</Button>
            <span className='text-xs font-semibold'>POWERLIFTING</span>
        </Link>
        <div className="flex flex-row gap-2">
            <Link to='sign-in'>
                <Button gradientDuoTone='tealToLime' outline className='w-14 sm:w-full'>
                    Login
                </Button>
            </Link>
            <Button 
                className='w-10 sm:w-12 h-10' 
                color='gray' 
                pill 
                onClick={() => dispatch(toggleTheme())}
            >
                {theme === 'light' ? <FaMoon/> : <FaSun />}
            </Button>
            <Link to='sign-up'>
                <Button gradientDuoTone='pinkToOrange' outline className='w-16 sm:w-full'>
                    Register
                </Button>
            </Link>
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
