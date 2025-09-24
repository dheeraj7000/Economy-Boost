import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Users, Shield, BarChart3, Globe } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Advanced machine learning algorithms provide fair and accurate credit assessments using Mistral AI technology.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Economic Data",
    description:
      "Make informed lending decisions with live unemployment rates, consumer price index, and market indicators.",
  },
  {
    icon: Users,
    title: "Financial Inclusion",
    description: "Democratizing access to capital for underserved communities and emerging market entrepreneurs.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Comprehensive risk assessment tools that analyze transaction patterns and financial health indicators.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description: "Leverage World Bank development indicators and Nasdaq market data for strategic insights.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Supporting entrepreneurs worldwide with localized economic data and country-specific insights.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">Revolutionizing Access to Capital</h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Our platform combines cutting-edge AI technology with comprehensive economic data to create fair,
            transparent, and accessible lending solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
