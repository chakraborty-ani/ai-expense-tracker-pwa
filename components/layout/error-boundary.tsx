"use client"

import React from "react"

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	ErrorBoundaryState
> {
	constructor(props: { children: React.ReactNode }) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("App error:", error, info.componentStack)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen items-center justify-center p-6">
					<div className="text-center space-y-4">
						<h2 className="text-xl font-semibold">Something went wrong</h2>
						<p className="text-sm text-muted-foreground">
							{this.state.error?.message || "An unexpected error occurred."}
						</p>
						<button
							className="text-sm underline cursor-pointer"
							onClick={() => {
								this.setState({ hasError: false })
								window.location.reload()
							}}
						>
							Reload page
						</button>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
