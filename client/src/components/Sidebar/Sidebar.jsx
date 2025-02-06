import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FcBullish } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaChevronDown } from 'react-icons/fa' // Importing the chevron down icon
import { STUDENTS_SIDEBAR_LINKS, FACULTY_SIDEBAR_LINKS, NULL_SIDEBAR_LINKS, USER_SIDEBAR_BOTTOM_LINKS } from './Navigations.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { logout as authLogout } from '../../store/authSlice'
import axiosInstance from '../../utils/axios.helper.js'
import { toast } from 'react-toastify'

const linkClass =
  'flex items-center gap-2 font-light px-2 py-2 hover:bg-indigo-200 hover:no-underline active:bg-indigo-300 rounded-lg transition-all duration-150 text-base'

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(false) // State to toggle dropdown for assignments
  const [TopSideBarLinks, setTopSideBarLinks] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    console.log("userData: ", userData)
    if (userData?.role) {
      if (userData.role === 'Student') {
        setTopSideBarLinks(STUDENTS_SIDEBAR_LINKS)
      } 
      else if(userData.role === 'Faculty') {
        setTopSideBarLinks(FACULTY_SIDEBAR_LINKS)
      }
    }
    else setTopSideBarLinks(NULL_SIDEBAR_LINKS)
  }, [userData]) // Run only when userData changes

  const handleLogout = async () => {
    try {
      console.log("logout")
      const response = await axiosInstance.post('/users/logout')
      
      if (response.status === 200) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        console.log('Logout success')
        dispatch(authLogout())
        toast.success('Logged out successfully')
        navigate('/')
        window.location.reload()
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to log out. Please try again.")
    }
  }

  return (
    <div className="bg-gray-50 w-64 md:w-72 p-5 flex flex-col border-r border-gray-200 shadow-lg">
      {/* Logo and Title */}
      <div
        className="flex items-center gap-3 px-1 py-3 border-b border-gray-300 cursor-pointer"
        onClick={() => navigate('/')} // Navigate to homepage when logo is clicked
      >
        <FcBullish fontSize={30} />
        <span className="text-gray-900 text-xl font-semibold">Pro-Track</span>
      </div>

      {/* Links */}
      <div className="py-10 flex flex-1 flex-col gap-3">
        {TopSideBarLinks.map((link) => {
          if (link.subLinks) {
            // Handle the dropdown for assignments
            return (
              <div key={link.key}>
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className={classNames(
                    'flex items-center justify-between gap-2 px-2 py-2 text-gray-700 font-light hover:bg-indigo-200 active:bg-indigo-300 rounded-lg w-full'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </span>
                  <FaChevronDown className={classNames('transition-transform duration-700', openDropdown ? 'rotate-180' : '')} />
                </button>
                {openDropdown && (
                  <div className="pl-6">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.path}
                        to={subLink.path}
                        className={classNames(
                          linkClass,
                          'text-gray-600 hover:text-indigo-600 transition-all duration-150'
                        )}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          // If no subLinks, simply return the link
          return <MemoizedSidebarLink key={link.key} link={link} />
        })}
      </div>

      {/* Bottom Links */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-300">
        {USER_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <MemoizedSidebarLink key={link.key} link={link} />
        ))}
        <div className={classNames(linkClass, 'cursor-pointer text-red-500 hover:text-red-700')}
		onClick={handleLogout}>
          <span 
		  className="text-xl"
		  
		  >
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  )
}

const SidebarLink = React.memo(({ link }) => {
  const { pathname } = useLocation()

  return (
    <Link
      to={link.path}
      className={classNames(
        pathname === link.path ? 'bg-indigo-200 text-indigo-800 font-light shadow-sm' : 'font-light text-gray-700',
        linkClass
      )}
    >
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  )
})

const MemoizedSidebarLink = React.memo(SidebarLink)
