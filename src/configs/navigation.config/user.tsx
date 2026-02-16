import { PiUserDuotone } from 'react-icons/pi'
import { TbLock, TbUserSquare } from 'react-icons/tb'
import type {
  UserMainSettingsNavigation,
  UserSettingsNavigation,
} from '@/@types/navigation'

export const dropdownItemList: UserSettingsNavigation[] = [
  {
    label: 'Profile',
    path: '/me',
    icon: <PiUserDuotone />,
  },
]

export const userSettingsMenu: UserMainSettingsNavigation[] = [
  {
    label: 'Profile',
    value: 'me',
    path: '/me',
    icon: <TbUserSquare />,
  },
  {
    label: 'Security',
    value: 'security',
    path: '/me/security',
    icon: <TbLock />,
  },
]
