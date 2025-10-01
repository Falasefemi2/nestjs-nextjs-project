"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/zutsand/store"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { toast } from "sonner"
import { getRedirectUrlForUser } from "@/lib/roleRouting"

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>;


function LoginForm({
    className,
    onToggleToSignup,
    ...props
}: React.ComponentProps<"form"> & { onToggleToSignup: () => void }) {

    const router = useRouter();


    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const onSubmit = async (values: LoginFormValues) => {
        clearError();
        try {
            await login(values);
            toast.success("Login successful!", {
                description: "Welcome back! You have been logged in successfully.",
                duration: 3000,
            });
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
                const redirectUrl = getRedirectUrlForUser(currentUser);
                router.push(redirectUrl);
            }
            form.reset();
        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";

            toast.error("Login failed", {
                description: errorMessage,
                duration: 4000,
            });
        }
    };

    const isSubmitting = form.formState.isSubmitting;


    return (
        <Card className={cn("w-full max-w-md mx-auto animate-slide-in", className)}>
            <CardHeader className="space-y-2 text-center pb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-balance">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground text-balance">
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"{...props}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                            Email address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className={cn(
                                                        "pl-10 h-12 transition-all duration-200",
                                                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-2 text-sm text-destructive">
                                            {fieldState.error && (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    {fieldState.error.message}
                                                </>
                                            )}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm font-medium">
                                                Password
                                            </FormLabel>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                                            >
                                                Forgot password?
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className={cn(
                                                        "pl-10 pr-10 h-12 transition-all duration-200",
                                                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-2 text-sm text-destructive">
                                            {fieldState.error && (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    {fieldState.error.message}
                                                </>
                                            )}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Button
                                    type="button"
                                    variant="link"
                                    className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                                    onClick={onToggleToSignup}
                                >
                                    Create account
                                </Button>
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    )
}

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>;

function SignupForm({
    className,
    onToggleToLogin,
    ...props
}: React.ComponentProps<"form"> & { onToggleToLogin: () => void }) {

    const [showPassword, setShowPassword] = useState(false);
    const { signup, isLoading, error, clearError } = useAuthStore();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: RegisterFormValues) => {
        clearError();
        try {
            await signup(values);
            toast.success("Account created!", {
                description: "Your account has been created successfully.",
                duration: 3000,
            });
            form.reset();
        } catch (error) {
            console.error('Signup failed:', error);
            const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
            toast.error("Signup failed", {
                description: errorMessage,
                duration: 4000,
            });
        }
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <Card className={cn("w-full max-w-md mx-auto animate-slide-in", className)}>
            <CardHeader className="space-y-2 text-center pb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-balance">Create account</CardTitle>
                <CardDescription className="text-muted-foreground text-balance">
                    Join us today and get started in minutes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" {...props}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                            Full name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className={cn(
                                                        "pl-10 h-12 transition-all duration-200",
                                                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-2 text-sm text-destructive">
                                            {fieldState.error && (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    {fieldState.error.message}
                                                </>
                                            )}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                            Email address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className={cn(
                                                        "pl-10 h-12 transition-all duration-200",
                                                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-2 text-sm text-destructive">
                                            {fieldState.error && (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    {fieldState.error.message}
                                                </>
                                            )}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a strong password"
                                                    className={cn(
                                                        "pl-10 pr-10 h-12 transition-all duration-200",
                                                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="flex items-center gap-2 text-sm text-destructive">
                                            {fieldState.error && (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    {fieldState.error.message}
                                                </>
                                            )}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                "Create account"
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Button
                                    type="button"
                                    variant="link"
                                    className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                                    onClick={onToggleToLogin}
                                >
                                    Sign in
                                </Button>
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


export function AuthForms({ className, ...props }: React.ComponentProps<"div">) {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className={cn("min-h-screen bg-background flex items-center justify-center p-4", className)} {...props}>
            <div className="w-full max-w-md">
                {isLogin ? (
                    <LoginForm onToggleToSignup={() => setIsLogin(false)} />
                ) : (
                    <SignupForm onToggleToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    )
}
