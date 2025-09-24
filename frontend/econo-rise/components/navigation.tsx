"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { APIStatusIndicator } from "@/components/api-status-indicator"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">EconoRise</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/apply" className="text-foreground hover:text-primary transition-colors">
              Apply for Loan
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Lender Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <APIStatusIndicator />
            <Button asChild>
              <Link href="/apply">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
