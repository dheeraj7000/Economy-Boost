"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Calendar, FileText, Loader2 } from "lucide-react"

interface MarketDataItem {
  as_of_date: string
  description: string
  file_id: string
  title: string
}

export function MarketDataWidget() {
  const [data, setData] = useState<MarketDataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get_market_data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const marketData = await response.json()
        setData(marketData)
      } catch (err) {
        console.error("Market data fetch error:", err)
        setError("Unable to fetch market data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error || "No market data available"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Data
        </CardTitle>
        <CardDescription>Recent financial market data from Nasdaq Data Link</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.as_of_date).toLocaleDateString()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    ID: {item.file_id}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
