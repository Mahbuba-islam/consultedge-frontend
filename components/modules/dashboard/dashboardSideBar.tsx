import { getDefaultDashboardRoute, type UserRole } from "@/src/lib/authUtilis"
import { getNavItemsByRole } from "@/src/lib/navItems"
import { getUserInfo } from "@/src/services/auth.services"
import { NavSection } from "@/src/types/dashboard.types"
import { UserInfo } from "@/src/types/user.types"
import DashboardSidebarContent from "./dashboardSideBarContent"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()
  const resolvedRole = (userInfo?.role as UserRole) || "CLIENT"
  const resolvedUserInfo: UserInfo = {
    id: userInfo?.id || "guest",
    name: userInfo?.name || "Guest User",
    email: userInfo?.email || "",
    role: resolvedRole,
  }
  const navItems : NavSection[] = getNavItemsByRole(resolvedRole)

  const dashboardHome = getDefaultDashboardRoute(resolvedRole)
  return (
    <DashboardSidebarContent userInfo={resolvedUserInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}

export default DashboardSidebar