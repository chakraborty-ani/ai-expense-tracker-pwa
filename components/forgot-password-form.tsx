"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

// COMPONENTS
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// UTILS
import { firebaseForgotPassword } from "@/lib/firebase/firebase-login"
import { cn } from "@/lib/utils"

// FORM VALIDATION SCHEMA
const FORGOT_PASSWORD_FORM_SCEHMA = z.object({
	email: z.string().email({ message: "Invalid email" }).min(1, { message: "Required" }),
})

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
	// ROUTER
	const router = useRouter()

	// STATES
	const [isLoading, setIsLoading] = useState(false)

	// FORM INITIALIZATION
	const form = useForm<z.infer<typeof FORGOT_PASSWORD_FORM_SCEHMA>>({
		resolver: zodResolver(FORGOT_PASSWORD_FORM_SCEHMA),
		defaultValues: {
			email: "",
		},
	})

	// FORM SUBMISSION HANDLER
	const onSubmit = async (data: z.infer<typeof FORGOT_PASSWORD_FORM_SCEHMA>) => {
		setIsLoading(true)

		await firebaseForgotPassword({ email: data.email })
		router.push("/login")

		setIsLoading(false)
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Reset Password</CardTitle>
					<CardDescription>Enter your email below to receive a reset link</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								{/* EMAIL */}
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="m@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* BUTTONS */}
								<Button type="submit" className="w-full cursor-pointer">
									{isLoading ? "Sending..." : "Send Reset Link"}
								</Button>
							</div>
						</form>
					</Form>

					{/* REDIRECT TO SIGN UP */}
					<div className="mt-4 text-center text-sm">
						<span
							className="underline underline-offset-4 cursor-pointer"
							onClick={() => router.push("/login")}
						>
							Back to Login
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
