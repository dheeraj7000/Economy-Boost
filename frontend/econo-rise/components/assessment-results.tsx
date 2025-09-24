"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, TrendingUp, FileText, ArrowLeft } from "lucide-react"

interface AssessmentResult {
  loan_eligibility_score: number
  key_risk_factors: string[]
  recommendation: string
}

interface AssessmentResultsProps {
  result: AssessmentResult
  onBack: () => void
}

export function AssessmentResults({ result, onBack }: AssessmentResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  const getRecommendationIcon = (score: number) => {
    if (score >= 60) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <AlertTriangle className="h-5 w-5 text-yellow-600" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          New Application
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Loan Assessment Results</h2>
          <p className="text-muted-foreground">AI-powered analysis of your loan application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Score */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Loan Eligibility Score
            </CardTitle>
            <CardDescription>Based on AI analysis of your business and transaction data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{result.loan_eligibility_score}</span>
                <Badge variant="secondary" className={getScoreColor(result.loan_eligibility_score)}>
                  {getScoreLabel(result.loan_eligibility_score)}
                </Badge>
              </div>
              <Progress value={result.loan_eligibility_score} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Score range: 0-100 (Higher scores indicate better loan eligibility)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRecommendationIcon(result.loan_eligibility_score)}
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Eligibility</span>
                <span className={`text-sm font-medium ${getScoreColor(result.loan_eligibility_score)}`}>
                  {getScoreLabel(result.loan_eligibility_score)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Risk Factors</span>
                <span className="text-sm font-medium">{result.key_risk_factors.length} identified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={result.loan_eligibility_score >= 60 ? "default" : "secondary"}>
                  {result.loan_eligibility_score >= 60 ? "Approved" : "Under Review"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Key Risk Factors
            </CardTitle>
            <CardDescription>Areas that may impact loan approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.key_risk_factors.length > 0 ? (
                result.key_risk_factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No significant risk factors identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              AI Recommendation
            </CardTitle>
            <CardDescription>Detailed analysis and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">{result.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
