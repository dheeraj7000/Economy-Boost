"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, TrendingDown, Calculator, Loader2 } from "lucide-react"

interface Transaction {
  amount: number
  type: string
}

interface FinancialHealthResult {
  average_monthly_income: number
  average_monthly_expenses: number
  cash_flow_trend: string
  debt_to_income_ratio: number
  summary: string
}

export function FinancialHealthAnalyzer() {
  const [transactions, setTransactions] = useState("")
  const [result, setResult] = useState<FinancialHealthResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!transactions.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Parse transactions from text input
      const parsedTransactions: Transaction[] = []
      const lines = transactions.split("\n")

      for (const line of lines) {
        const match = line.match(/([+-]?\d+(?:\.\d+)?)\s*(income|expense|revenue|cost)/i)
        if (match) {
          const amount = Number.parseFloat(match[1])
          const type =
            match[2].toLowerCase().includes("income") || match[2].toLowerCase().includes("revenue")
              ? "income"
              : "expense"
          parsedTransactions.push({ amount: Math.abs(amount), type })
        }
      }

      if (parsedTransactions.length === 0) {
        throw new Error("No valid transactions found. Please use format like '1000 income' or '500 expense'")
      }

      const response = await fetch("http://localhost:5000/api/get_financial_health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: parsedTransactions,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const healthResult = await response.json()
      setResult(healthResult)
    } catch (err) {
      console.error("Financial health analysis error:", err)
      setError(err instanceof Error ? err.message : "Unable to analyze financial health")
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend.toLowerCase().includes("positive") || trend.toLowerCase().includes("improving")) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend.toLowerCase().includes("positive") || trend.toLowerCase().includes("improving")) {
      return "text-green-600"
    }
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Financial Health Analyzer
        </CardTitle>
        <CardDescription>Analyze transaction data to assess business financial health</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="transactions" className="text-base font-medium">
            Transaction Data
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Enter transaction data in the format: "amount type" (e.g., "1000 income", "500 expense")
          </p>
          <Textarea
            id="transactions"
            placeholder="1000 income
500 expense
1200 revenue
300 cost
800 income"
            value={transactions}
            onChange={(e) => setTransactions(e.target.value)}
            className="min-h-32 font-mono text-sm"
          />
        </div>

        <Button onClick={handleAnalyze} disabled={!transactions.trim() || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Analyze Financial Health
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Monthly Income</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ${result.average_monthly_income.toLocaleString()}
                </span>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Monthly Expenses</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  ${result.average_monthly_expenses.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cash Flow Trend</span>
                <Badge variant="secondary" className={getTrendColor(result.cash_flow_trend)}>
                  {getTrendIcon(result.cash_flow_trend)}
                  {result.cash_flow_trend}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Debt-to-Income Ratio</span>
                  <span className="font-bold">{(result.debt_to_income_ratio * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.debt_to_income_ratio * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Lower ratios indicate better financial health (below 36% is ideal)
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
