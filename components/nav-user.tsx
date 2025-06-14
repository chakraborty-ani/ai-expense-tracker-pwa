"use client"

import { IconDotsVertical, IconLogout, IconSettings, IconUserCircle } from "@tabler/icons-react"
import { useState } from "react"

// COMPONENTS
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

// UTILS
import { useAppSelector } from "@/hooks/redux-hooks"
import { signOutCurrentUser } from "@/lib/firebase/firebase-config"

// TYPES
type LogOutAlertProps = {
	onSubmit: () => void
	show?: boolean
	onHide?: () => void
}

export function NavUser() {
	const { isMobile } = useSidebar()

	// REDUX
	const { currentUserDetails } = useAppSelector(state => state.user)

	// STATE
	const [openLogoutAlert, setOpenLogoutAlert] = useState(false)

	// HANDLE LOGOUT
	const handleLogout = () => {
		signOutCurrentUser()
	}

	return (
		<>
			<LogOutAlert
				onSubmit={handleLogout}
				show={openLogoutAlert}
				onHide={() => setOpenLogoutAlert(false)}
			/>

			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg grayscale">
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{currentUserDetails?.firstname} {currentUserDetails?.lastname}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{currentUserDetails?.email}
									</span>
								</div>
								<IconDotsVertical className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{currentUserDetails?.firstname} {currentUserDetails?.lastname}
										</span>
										<span className="text-muted-foreground truncate text-xs">
											{currentUserDetails?.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<IconUserCircle />
									Account
								</DropdownMenuItem>
								<DropdownMenuItem>
									<IconSettings />
									Settings
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setOpenLogoutAlert(true)}>
								<IconLogout />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}

function LogOutAlert({ onSubmit, show, onHide }: LogOutAlertProps) {
	return (
		<AlertDialog open={show} onOpenChange={onHide}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Log out of your account?</AlertDialogTitle>
					<AlertDialogDescription>
						You will be signed out of your session. You can log back in at any time to continue
						using your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onSubmit}>Log Out</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
