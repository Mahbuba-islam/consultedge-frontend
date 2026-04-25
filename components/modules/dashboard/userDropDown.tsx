import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/src/types/user.types"
import { Key, LogOut, User } from "lucide-react"
import Link from "next/link"
import LogoutButton from "@/components/modules/auth/LogoutButton"

interface UserDropdownProps{
    userInfo : UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="rounded-full border-0 bg-linear-to-br from-blue-600 via-cyan-500 to-teal-400 text-white shadow-md shadow-cyan-500/30 transition-all hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 hover:shadow-lg hover:shadow-cyan-500/40">
                <span className="text-sm font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                </span>
            </Button>
        </DropdownMenuTrigger>


        <DropdownMenuContent align={"end"} className="w-56">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                        {userInfo.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {userInfo.email}
                    </p>

                    <p className="text-xs text-primary capitalize">
                        {userInfo.role.toLowerCase().replace("_", " ")}
                    </p>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <DropdownMenuItem>
                <Link href={"/my-profile"}>
                <User className="mr-2 h-4 w-4"/>
                    My Profile
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
                <Link href={"/change-password"}>
                    <Key className="mr-2 h-4 w-4"/>
                    Change Password
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator/>


            <DropdownMenuItem asChild className="cursor-pointer text-red-600">
                <LogoutButton className="flex w-full items-center text-left text-red-600 disabled:opacity-60">
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </LogoutButton>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown