import * as React from "react"

// COMPONENTS
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ICONS
import { EyeIcon, EyeOffIcon } from "lucide-react"

export const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => {
		const [show, setShow] = React.useState(false)

		return (
			<div className="relative">
				<Input
					type={show ? "text" : "password"}
					className={`pr-10 ${className ?? ""}`}
					ref={ref}
					{...props}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
					tabIndex={-1}
					onClick={() => setShow(prev => !prev)}
				>
					{show ? (
						<EyeOffIcon className="h-4 w-4" aria-label="Hide password" />
					) : (
						<EyeIcon className="h-4 w-4" aria-label="Show password" />
					)}
				</Button>
			</div>
		)
	}
)

PasswordInput.displayName = "PasswordInput"
