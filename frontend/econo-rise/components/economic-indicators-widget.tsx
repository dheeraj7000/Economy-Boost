"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EconomicData {
  unemployment_rate: Record<string, number>
  consumer_price_index: Record<string, number>
}

export function EconomicIndicatorsWidget() {
  const [data, setData] = useState<EconomicData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEconomicData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get_economic_indicators")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const economicData = await response.json()
        setData(economicData)
      } catch (err) {
        console.error("Economic data fetch error:", err)
        setError("Unable to fetch economic indicators")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEconomicData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Economic Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Economic Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error || "No data available"}</p>
        </CardContent>
      </Card>
    )
  }

  // Process data for charts
  const unemploymentEntries = Object.entries(data.unemployment_rate).slice(-12)
  const cpiEntries = Object.entries(data.consumer_price_index).slice(-12)

  const chartData = unemploymentEntries.map(([date, unemployment], index) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    unemployment: unemployment,
    cpi: cpiEntries[index] ? cpiEntries[index][1] : null,
  }))

  const latestUnemployment = unemploymentEntries[unemploymentEntries.length - 1]?.[1] || 0
  const latestCPI = cpiEntries[cpiEntries.length - 1]?.[1] || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Unemployment Rate
          </CardTitle>
          <CardDescription>Latest macroeconomic indicator from FRED API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">{latestUnemployment.toFixed(1)}%</span>
            <Badge variant="secondary">
              {latestUnemployment > 5 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              )}
              Current
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="unemployment" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Consumer Price Index
          </CardTitle>
          <CardDescription>Inflation indicator from FRED API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">{latestCPI.toFixed(1)}</span>
            <Badge variant="secondary">
              <Activity className="h-3 w-3 mr-1 text-blue-500" />
              Index
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="cpi" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
