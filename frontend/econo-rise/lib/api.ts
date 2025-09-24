const API_BASE_URL = "http://localhost:5000/api"

// Type definitions for API responses
export interface AssessmentRequest {
  business_description: string
  transaction_data: string
}

export interface AssessmentResponse {
  loan_eligibility_score: number
  key_risk_factors: string[]
  recommendation: string
}

export interface EconomicIndicators {
  unemployment_rate: Record<string, number>
  consumer_price_index: Record<string, number>
}

export interface MarketDataItem {
  as_of_date: string
  description: string
  file_id: string
  title: string
}

export interface Transaction {
  amount: number
  type: string
}

export interface FinancialHealthRequest {
  transactions: Transaction[]
}

export interface FinancialHealthResponse {
  average_monthly_income: number
  average_monthly_expenses: number
  cash_flow_trend: string
  debt_to_income_ratio: number
  summary: string
}

export interface DevelopmentIndicatorsResponse {
  country: string
  indicator: string
  data: Array<{
    year: string
    value: number
  }>
}

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Generic API request function with error handling
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new APIError(`HTTP error! status: ${response.status}`, response.status, endpoint)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Handle network errors or JSON parsing errors
    throw new APIError(
      `Failed to connect to EconoRise API. Please ensure the backend server is running on localhost:5000.`,
      undefined,
      endpoint,
    )
  }
}

// API Functions for each endpoint

/**
 * Assess loan eligibility using AI-powered analysis
 * POST /api/assess_eligibility
 */
export async function assessLoanEligibility(request: AssessmentRequest): Promise<AssessmentResponse> {
  return apiRequest<AssessmentResponse>("/assess_eligibility", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

/**
 * Get economic indicators from FRED API
 * GET /api/get_economic_indicators
 */
export async function getEconomicIndicators(): Promise<EconomicIndicators> {
  return apiRequest<EconomicIndicators>("/get_economic_indicators")
}

/**
 * Get financial health analysis
 * POST /api/get_financial_health
 */
export async function getFinancialHealth(request: FinancialHealthRequest): Promise<FinancialHealthResponse> {
  return apiRequest<FinancialHealthResponse>("/get_financial_health", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

/**
 * Get market data from Nasdaq Data Link
 * GET /api/get_market_data
 */
export async function getMarketData(): Promise<MarketDataItem[]> {
  return apiRequest<MarketDataItem[]>("/get_market_data")
}

/**
 * Get development indicators from World Bank
 * GET /api/get_development_indicators
 */
export async function getDevelopmentIndicators(country = "IND"): Promise<DevelopmentIndicatorsResponse> {
  return apiRequest<DevelopmentIndicatorsResponse>(`/get_development_indicators?country=${country}`)
}

// Utility functions for data processing

/**
 * Parse transaction text into structured transaction objects
 */
export function parseTransactions(transactionText: string): Transaction[] {
  const transactions: Transaction[] = []
  const lines = transactionText.split("\n")

  for (const line of lines) {
    const match = line.match(/([+-]?\d+(?:\.\d+)?)\s*(income|expense|revenue|cost)/i)
    if (match) {
      const amount = Number.parseFloat(match[1])
      const type =
        match[2].toLowerCase().includes("income") || match[2].toLowerCase().includes("revenue") ? "income" : "expense"
      transactions.push({ amount: Math.abs(amount), type })
    }
  }

  return transactions
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage values for display
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Get score color class based on loan eligibility score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

/**
 * Get score label based on loan eligibility score
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Needs Improvement"
}

/**
 * Check if API is available
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/get_economic_indicators`)
    return true
  } catch {
    return false
  }
}
