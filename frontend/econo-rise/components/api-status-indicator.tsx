"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { checkAPIHealth } from "@/lib/api"

export function APIStatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true)
      const status = await checkAPIHealth()
      setIsOnline(status)
      setIsChecking(false)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isChecking) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking API
      </Badge>
    )
  }

  return (
    <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
      {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      API {isOnline ? "Online" : "Offline"}
    </Badge>
  )
}
