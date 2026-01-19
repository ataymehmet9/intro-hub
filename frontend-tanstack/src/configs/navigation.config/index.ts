import { NAV_ITEM_TYPE_ITEM } from "@/constants/navigation.constant";

import type { NavigationTree } from "@/@types/navigation";

const navigationConfig: NavigationTree[] = [
  {
    key: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
    translateKey: "nav.dashboard",
    icon: "home",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: "contacts",
    path: "/contacts",
    title: "Contacts",
    translateKey: "nav.contacts",
    icon: "singleMenu",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: "requests",
    path: "/requests",
    title: "Requests",
    translateKey: "nav.requests",
    icon: "collapseMenu",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: "search",
    path: "/search",
    title: "Search",
    translateKey: "nav.search",
    icon: "groupMenu",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: "profile",
    path: "/profile",
    title: "Profile",
    translateKey: "nav.profile",
    icon: "groupSingleMenu",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
];

export default navigationConfig;
