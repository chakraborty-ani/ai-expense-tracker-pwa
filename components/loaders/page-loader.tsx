import { SpinnerCircularFixed } from "spinners-react"

const PageLoader = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-background">
			<SpinnerCircularFixed
				size={50}
				thickness={180}
				speed={100}
				color="var(--foreground)"
				secondaryColor="var(--card)"
			/>
		</div>
	)
}

export default PageLoader
