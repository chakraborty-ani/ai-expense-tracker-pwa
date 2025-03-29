import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
					<CardDescription>Create your account and start tracking</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="m@example.com" required />
							</div>
							<div className="grid gap-3 grid-cols-2">
								<div className="grid gap-3 w-full">
									<Label htmlFor="first-name">First name</Label>
									<Input id="first-name" type="text" required />
								</div>
								<div className="grid gap-3 w-full">
									<Label htmlFor="last-name">Last name</Label>
									<Input id="last-name" type="text" required />
								</div>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="password">Password</Label>
								<Input id="password" type="password" required />
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
									Register
								</Button>
								<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
									<span className="relative z-10 bg-card px-2 text-muted-foreground">
										Or
									</span>
								</div>
								<Button variant="outline" className="w-full">
									Login with Google
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<a href="#" className="underline underline-offset-4">
								Login
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
