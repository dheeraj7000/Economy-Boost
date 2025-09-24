"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Upload, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  businessDescription: string
  transactionData: string
}

interface MultiStepFormProps {
  onSubmit: (data: FormData) => void
  isLoading?: boolean
}

export function MultiStepForm({ onSubmit, isLoading = false }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessDescription: "",
    transactionData: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessDescription.trim().length > 0
      case 2:
        return formData.transactionData.trim().length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Loan Application</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && (
              <>
                <FileText className="h-5 w-5 text-primary" />
                Business Details
              </>
            )}
            {currentStep === 2 && (
              <>
                <Upload className="h-5 w-5 text-primary" />
                Transaction Data
              </>
            )}
            {currentStep === 3 && (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Review & Submit
              </>
            )}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your business and loan requirements"}
            {currentStep === 2 && "Provide your transaction history for analysis"}
            {currentStep === 3 && "Review your information and submit for assessment"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessDescription" className="text-base font-medium">
                  Business Description *
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Describe your business, industry, loan purpose, and any relevant details that would help assess your
                  application.
                </p>
                <Textarea
                  id="businessDescription"
                  placeholder="e.g., I run a small organic farm in Kenya that supplies local markets. I'm seeking a $5,000 loan to purchase new irrigation equipment to expand production during the dry season. My business has been operating for 3 years with steady growth..."
                  value={formData.businessDescription}
                  onChange={(e) => updateFormData("businessDescription", e.target.value)}
                  className="min-h-32 resize-none"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="transactionData" className="text-base font-medium">
                  Transaction Data *
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Paste your transaction history or financial data. This can include bank statements, sales records, or
                  any financial information that demonstrates your business cash flow.
                </p>
                <Textarea
                  id="transactionData"
                  placeholder="e.g., Monthly Sales Data:
Jan 2024: $2,500 revenue, $1,200 expenses
Feb 2024: $2,800 revenue, $1,300 expenses
Mar 2024: $3,200 revenue, $1,400 expenses
...or paste CSV data, bank statement details, etc."
                  value={formData.transactionData}
                  onChange={(e) => updateFormData("transactionData", e.target.value)}
                  className="min-h-40 resize-none font-mono text-sm"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Business Description</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{formData.businessDescription}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Transaction Data</h4>
                <p className="text-sm text-muted-foreground font-mono line-clamp-3">{formData.transactionData}</p>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary mb-1">AI Assessment Ready</h4>
                    <p className="text-sm text-muted-foreground">
                      Your application will be analyzed using advanced AI algorithms and real-time economic data to
                      provide a fair and comprehensive loan eligibility assessment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={cn(currentStep === 1 && "invisible")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid() || isLoading}>
                {isLoading ? "Analyzing..." : "Submit Application"}
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
