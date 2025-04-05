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
import { firebaseRegisterWithEmailPassword } from "@/lib/firebase/firebase-login"
import { cn } from "@/lib/utils"
import registerNewUserApi from "@/api/post/register-new-user-api"

// FORM VALIDATION SCHEMA
const SIGNUP_FORM_SCHEMA = z.object({
	email: z.string().email({ message: "Invalid email" }).min(1, { message: "Required" }),
	firstname: z.string().min(1, { message: "Required" }),
	lastname: z.string().min(1, { message: "Required" }),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one numeric character")
		.regex(/[\W_]/, "Password must contain at least one special character"),
})

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof SIGNUP_FORM_SCHEMA>>({
		resolver: zodResolver(SIGNUP_FORM_SCHEMA),
		defaultValues: { email: "", firstname: "", lastname: "", password: "" },
	})

	const onSubmit = async (data: z.infer<typeof SIGNUP_FORM_SCHEMA>) => {
		setIsLoading(true)

		try {
			// Register with Firebase
			const firebaseResponse = await firebaseRegisterWithEmailPassword({
				email: data.email,
				password: data.password,
			})

			if (firebaseResponse) {
				// Send user details to backend
				const registerUserRes = await registerNewUserApi({
					email: data.email,
					firstname: data.firstname,
					lastname: data.lastname,
					firebaseId: firebaseResponse.user.uid,
				})

				if (registerUserRes.status === 201) {
					router.push("/")
					console.log("User registered successfully:", registerUserRes.data)
				} else {
					console.log("Error registering user:", registerUserRes.data.message)
				}
			}
		} catch (error) {
			console.error("Signup Error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
					<CardDescription>Create your account and start tracking</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								{/* EMAIL */}
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

								<div className="grid gap-3 grid-cols-2">
									{/* FIRSTNAME */}
									<FormField
										control={form.control}
										name="firstname"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* LASTNAME */}
									<FormField
										control={form.control}
										name="lastname"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* PASSWORD */}
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* BUTTONS */}
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Registering..." : "Register"}
								</Button>
							</div>

							{/* REDIRECT TO LOGIN */}
							<div className="mt-4 text-center text-sm">
								Already have an account?{" "}
								<span
									className="underline cursor-pointer"
									onClick={() => router.push("/login")}
								>
									Login
								</span>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
