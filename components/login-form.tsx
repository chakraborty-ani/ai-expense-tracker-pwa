"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// COMPONENTS
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// UTILS
import { firebaseLoginWithEmailPassword } from "@/lib/firebase/firebase-login"
import { cn } from "@/lib/utils"

// FORM VALIDATION SCHEMA
const LOGIN_FORM_SCEHMA = z.object({
	email: z.string().email({ message: "Invalid email" }).min(1, { message: "Required" }),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one numeric character")
		.regex(/[\W_]/, "Password must contain at least one special character"),
})

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	// ROUTER
	const router = useRouter()

	// STATES
	const [isLoading, setIsLoading] = useState(false)

	// FORM INITIALIZATION
	const form = useForm<z.infer<typeof LOGIN_FORM_SCEHMA>>({
		resolver: zodResolver(LOGIN_FORM_SCEHMA),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	// FORM SUBMISSION HANDLER
	const onSubmit = async (data: z.infer<typeof LOGIN_FORM_SCEHMA>) => {
		setIsLoading(true)

		try {
			const firebaseResponse = await firebaseLoginWithEmailPassword({
				email: data.email,
				password: data.password,
			})

			if (firebaseResponse) {
				router.push("/")
			}
		} catch (error) {
			console.error("Login Error:", error)
		}

		setIsLoading(false)
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Enter your email below to login to your account</CardDescription>
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

								{/* PASSWORD */}
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<div className="w-full flex items-center">
													<FormLabel>Password</FormLabel>
													<span className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer">
														Forgot your password?
													</span>
												</div>
												<FormControl>
													<Input type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* BUTTONS */}
								<div className="flex flex-col gap-3">
									<Button type="submit" className="w-full cursor-pointer">
										{isLoading ? "Logging in..." : "Login"}
									</Button>
									<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
										<span className="relative z-10 bg-card px-2 text-muted-foreground">
											Or
										</span>
									</div>
									<Button variant="outline" className="w-full cursor-pointer">
										Login with Google
									</Button>
								</div>
							</div>

							{/* REDIRECT TO SIGN UP */}
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{" "}
								<span
									className="underline underline-offset-4 cursor-pointer"
									onClick={() => router.push("/register")}
								>
									Sign up
								</span>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
