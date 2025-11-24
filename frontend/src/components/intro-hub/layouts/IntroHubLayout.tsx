'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Drawer, Avatar, Dropdown } from '@/components/ui'
import { 
  HiSquares2X2, 
  HiUsers, 
  HiMagnifyingGlass, 
  HiArrowsRightLeft, 
  HiUser,
  HiBars3,
  HiXMark
} from 'react-icons/hi2'
import { useAuth } from '@/contexts/AuthContext'

interface IntroHubLayoutProps {
  children: React.ReactNode
}

const IntroHubLayout: React.FC<IntroHubLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { text: 'Dashboard', icon: <HiSquares2X2 className="text-xl" />, path: '/dashboard' },
    { text: 'Contacts', icon: <HiUsers className="text-xl" />, path: '/contacts' },
    { text: 'Search', icon: <HiMagnifyingGlass className="text-xl" />, path: '/search' },
    { text: 'Requests', icon: <HiArrowsRightLeft className="text-xl" />, path: '/requests' },
  ]

  const handleLogout = () => {
    logout()
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const stringToColor = (string: string): string => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  const avatarColor = user ? stringToColor(user.full_name) : '#1976d2'

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Intro-Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.text}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <Avatar
            size={40}
            shape="circle"
            style={{ backgroundColor: avatarColor }}
            className="text-white font-semibold"
            src={user?.profile_image}
          >
            {user?.first_name?.charAt(0) || 'U'}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Intro-Hub
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {mobileMenuOpen ? (
            <HiXMark className="text-2xl text-gray-700 dark:text-gray-300" />
          ) : (
            <HiBars3 className="text-2xl text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        placement="left"
        width={280}
        className="lg:hidden"
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 mt-16 lg:mt-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {menuItems.find((item) => item.path === pathname)?.text || 'Intro-Hub'}
          </h2>
          
          <Dropdown
            renderTitle={
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar
                  size={36}
                  shape="circle"
                  style={{ backgroundColor: avatarColor }}
                  className="text-white font-semibold"
                  src={user?.profile_image}
                >
                  {user?.first_name?.charAt(0) || 'U'}
                </Avatar>
              </button>
            }
            placement="bottom-end"
          >
            <Dropdown.Item eventKey="profile" onClick={handleProfileClick}>
              <div className="flex items-center gap-2">
                <HiUser className="text-lg" />
                <span>Profile</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="logout" onClick={handleLogout}>
              <div className="flex items-center gap-2 text-red-600">
                <span>Logout</span>
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default IntroHubLayout

// Made with Bob
