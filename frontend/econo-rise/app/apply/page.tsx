"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { MultiStepForm } from "@/components/multi-step-form"
import { AssessmentResults } from "@/components/assessment-results"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { assessLoanEligibility, APIError, type AssessmentRequest, type AssessmentResponse } from "@/lib/api"

interface FormData {
  businessDescription: string
  transactionData: string
}

export default function ApplyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AssessmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const request: AssessmentRequest = {
        business_description: formData.businessDescription,
        transaction_data: formData.transactionData,
      }

      const assessmentResult = await assessLoanEligibility(request)
      setResult(assessmentResult)
    } catch (err) {
      console.error("Assessment error:", err)
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred during assessment.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Card className="max-w-2xl mx-auto mb-8 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Connection Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {isLoading && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="font-medium">Analyzing Your Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI is processing your business data and economic indicators...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !result && <MultiStepForm onSubmit={handleFormSubmit} isLoading={isLoading} />}

        {result && <AssessmentResults result={result} onBack={handleBack} />}
      </div>
    </main>
  )
}
