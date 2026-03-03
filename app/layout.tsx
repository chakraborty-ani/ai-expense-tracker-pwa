import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

// COMPONENTS
import { ThemeProvider } from "@/components/layout/theme-provider"
import { AuthLayout } from "@/components/layout/auth-layout"
import { ReduxProvider } from "@/components/layout/redux-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { ErrorBoundary } from "@/components/layout/error-boundary"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	viewportFit: "cover",
}

export const themeColor = [{ media: "(prefers-color-scheme: dark)", color: "#fff" }]

export const metadata: Metadata = {
	title: "AI Expense Tracker",
	description: "An AI-powered expense tracking PWA for effortless financial management.",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: ["expense tracker", "AI expense tracker", "finance", "budgeting", "PWA", "Next.js"],
	icons: [
		{ rel: "apple-touch-icon", url: "images/manifest/icon-128x128.png" },
		{ rel: "icon", url: "images/manifest/icon-128x128.png" },
	],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ReduxProvider>
						<ErrorBoundary>
							<AuthLayout>
								<MainLayout>
									{children}
									<Toaster richColors />
								</MainLayout>
							</AuthLayout>
						</ErrorBoundary>
					</ReduxProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
