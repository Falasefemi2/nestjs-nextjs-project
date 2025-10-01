"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Home, Search, HelpCircle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                {/* 404 Visual */}
                <div className="relative">
                    <div className="text-[12rem] md:text-[16rem] font-bold text-primary/20 leading-none select-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/10 rounded-full p-8 backdrop-blur-sm">
                            <HelpCircle className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Page not found</h1>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
                        {
                            "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL."
                        }
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-3 gap-4 mt-12">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Home className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Go Home</h3>
                            <p className="text-sm text-muted-foreground">Return to our homepage and start fresh</p>
                            <Button asChild className="w-full">
                                <Link href="/">Take me home</Link>
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Search className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Search</h3>
                            <p className="text-sm text-muted-foreground">Try searching for what you need</p>
                            <Button variant="outline" className="w-full bg-transparent">
                                Search site
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <ArrowLeft className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Go Back</h3>
                            <p className="text-sm text-muted-foreground">Return to the previous page</p>
                            <Button variant="outline" className="w-full bg-transparent" onClick={() => window.history.back()}>
                                Go back
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Help Text */}
                <div className="pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Still having trouble?{" "}
                        <Link href="/contact" className="text-primary hover:underline font-medium">
                            Contact our support team
                        </Link>{" "}
                        for assistance.
                    </p>
                </div>
            </div>
        </div>
    )
}
