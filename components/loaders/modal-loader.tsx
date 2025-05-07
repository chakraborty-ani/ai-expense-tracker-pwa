import FadeLoader from "react-spinners/FadeLoader"

const ModalLoader = () => {
	return (
		<div className="flex h-full w-full items-center justify-center bg-background">
			<FadeLoader
				color={"var(--foreground)"}
				loading={true}
				height={15}
				width={5}
				radius={2}
				margin={2}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
	)
}

export default ModalLoader
