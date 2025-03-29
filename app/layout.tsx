import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "AI Expense Tracker",
	description: "An AI-powered expense tracking PWA for effortless financial management.",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: ["expense tracker", "AI expense tracker", "finance", "budgeting", "PWA", "Next.js"],
	themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
	// authors: [
	// 	{
	// 		name: "imvinojanv",
	// 		url: "https://www.linkedin.com/in/imvinojanv/",
	// 	},
	// ],
	viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
	icons: [
		{ rel: "apple-touch-icon", url: "images/manifest/icon-128x128.png" },
		{ rel: "icon", url: "images/manifest/icon-128x128.png" },
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	)
}
