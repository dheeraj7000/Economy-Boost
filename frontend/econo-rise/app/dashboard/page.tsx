import { Navigation } from "@/components/navigation"
import { EconomicIndicatorsWidget } from "@/components/economic-indicators-widget"
import { MarketDataWidget } from "@/components/market-data-widget"
import { FinancialHealthAnalyzer } from "@/components/financial-health-analyzer"
import { DevelopmentIndicatorsWidget } from "@/components/development-indicators-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Calculator } from "lucide-react"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-4">Lender Dashboard</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Real-time economic data and financial analysis tools to make informed lending decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Economic Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Live unemployment and CPI data from FRED API</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Financial market data from Nasdaq Data Link</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="h-4 w-4 text-primary" />
                Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analyze business transaction patterns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                Global Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">World Bank development indicators</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <EconomicIndicatorsWidget />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketDataWidget />
            <DevelopmentIndicatorsWidget />
          </div>

          <FinancialHealthAnalyzer />
        </div>
      </div>
    </main>
  )
}
