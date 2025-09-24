"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DevelopmentData {
  country: string
  indicator: string
  data: Array<{
    year: string
    value: number
  }>
}

const countries = [
  { code: "IND", name: "India" },
  { code: "BRA", name: "Brazil" },
  { code: "KEN", name: "Kenya" },
  { code: "NGA", name: "Nigeria" },
  { code: "IDN", name: "Indonesia" },
  { code: "BGD", name: "Bangladesh" },
]

export function DevelopmentIndicatorsWidget() {
  const [selectedCountry, setSelectedCountry] = useState("IND")
  const [data, setData] = useState<DevelopmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevelopmentData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:5000/api/get_development_indicators?country=${selectedCountry}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const developmentData = await response.json()
        setData(developmentData)
      } catch (err) {
        console.error("Development data fetch error:", err)
        setError("Unable to fetch development indicators")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevelopmentData()
  }, [selectedCountry])

  const selectedCountryName = countries.find((c) => c.code === selectedCountry)?.name || selectedCountry

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Development Indicators
        </CardTitle>
        <CardDescription>Population data from World Bank for emerging markets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Country</label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedCountryName}</h4>
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                Population Data
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.data.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`} />
                <Tooltip formatter={(value) => [`${(Number(value) / 1e6).toFixed(1)}M`, "Population"]} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Latest:</strong>{" "}
                {data.data.length > 0 &&
                  `${(data.data[data.data.length - 1].value / 1e6).toFixed(1)}M people in ${
                    data.data[data.data.length - 1].year
                  }`}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
