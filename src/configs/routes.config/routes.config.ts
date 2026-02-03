import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        authority: [],
    },
    {
        key: 'collapseMenu.item1',
        path: '/collapse-menu-item-view-1',
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        authority: [],
    },
    ...othersRoute,
]
