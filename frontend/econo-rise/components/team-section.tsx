import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    description:
      "Former Goldman Sachs analyst with 10+ years in fintech and microfinance. Passionate about financial inclusion.",
    avatar: "/professional-woman-ceo.png",
    initials: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-founder",
    description:
      "AI/ML expert from Google with expertise in credit risk modeling and large-scale data processing systems.",
    avatar: "/professional-man-cto.png",
    initials: "MR",
  },
  {
    name: "Priya Patel",
    role: "Head of Data Science",
    description: "PhD in Economics from MIT, specializing in emerging market analysis and macroeconomic modeling.",
    avatar: "/professional-woman-data-scientist.png",
    initials: "PP",
  },
  {
    name: "James Thompson",
    role: "Head of Product",
    description: "Former product lead at Stripe, focused on building accessible financial products for global markets.",
    avatar: "/professional-product-manager.png",
    initials: "JT",
  },
]

export function TeamSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            A diverse group of experts united by the mission to democratize access to capital and empower entrepreneurs
            worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold">{member.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
