"use client"

import { usePathname } from "next/navigation"
import React from "react"

// COMPONENTS
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// CONSTANTS
const NON_AUTHENTICATED_ROUTES = ["/login", "/register"]

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname()

	// Check if the current route is one of the non-authenticated routes
	// If it is, render the children without the sidebar and header
	if (pathname && NON_AUTHENTICATED_ROUTES.includes(pathname)) {
		return <>{children}</>
	}

	// If the current route is not one of the non-authenticated routes, render the sidebar and header
	// along with the children
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<>{children}</>
			</SidebarInset>
		</SidebarProvider>
	)
}
