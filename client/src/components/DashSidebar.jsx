import { Sidebar } from "flowbite-react"
import { HiUser } from 'react-icons/hi'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

export default function DashSidebar() {
    const { userInfo } = useSelector((state) => state.auth)
    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])
  return (
    <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Link to='/dashboard?tab=profile'>
                <Sidebar.Item 
                  active={tab === 'profile'} 
                  icon={HiUser} 
                  label={userInfo.isAdmin ? 'Admin' : 'User'}
                  labelColor='dark' 
                  as='div'
                >
                        Profile
                </Sidebar.Item>
            </Link>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
