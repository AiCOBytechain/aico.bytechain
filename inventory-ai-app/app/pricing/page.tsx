"use client"

import { useState } from "react"
import { Check, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  // Calculate savings percentage
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12
    const savings = ((monthlyCost - yearly) / monthlyCost) * 100
    return Math.round(savings)
  }

  const plans = [
    {
      name: "Free",
      description: "Basic inventory management for individuals and startups",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { name: "Up to 100 inventory items", included: true },
        { name: "Basic inventory tracking", included: true },
        { name: "Single user account", included: true },
        { name: "AI-powered insights (limited)", included: true },
        { name: "Email support", included: true },
        { name: "Marketplace access", included: true },
        { name: "Sensory code tracking", included: false },
        { name: "Advanced AI consultation", included: false },
        { name: "Team management", included: false },
        { name: "API access", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Standard",
      description: "Complete inventory solution for small businesses",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        { name: "Up to 1,000 inventory items", included: true },
        { name: "Advanced inventory tracking", included: true },
        { name: "Up to 3 user accounts", included: true },
        { name: "AI-powered insights", included: true },
        { name: "Priority email support", included: true },
        { name: "Marketplace access", included: true },
        { name: "Sensory code tracking (basic)", included: true },
        { name: "Advanced AI consultation", included: false },
        { name: "Team management", included: false },
        { name: "API access", included: false },
      ],
      cta: "Subscribe Now",
      popular: true,
    },
    {
      name: "Professional",
      description: "Advanced features for growing businesses",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        { name: "Up to 10,000 inventory items", included: true },
        { name: "Advanced inventory tracking", included: true },
        { name: "Up to 10 user accounts", included: true },
        { name: "AI-powered insights (premium)", included: true },
        { name: "Priority email & phone support", included: true },
        { name: "Marketplace access (premium)", included: true },
        { name: "Sensory code tracking (advanced)", included: true },
        { name: "Advanced AI consultation", included: true },
        { name: "Team management", included: true },
        { name: "API access", included: false },
      ],
      cta: "Subscribe Now",
      popular: false,
    },
    {
      name: "Enterprise",
      description: "Complete solution for large organizations",
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      features: [
        { name: "Unlimited inventory items", included: true },
        { name: "Advanced inventory tracking", included: true },
        { name: "Unlimited user accounts", included: true },
        { name: "AI-powered insights (enterprise)", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Marketplace access (enterprise)", included: true },
        { name: "Sensory code tracking (enterprise)", included: true },
        { name: "Advanced AI consultation", included: true },
        { name: "Team management", included: true },
        { name: "API access", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-seablue-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Choose the perfect plan for your inventory management needs
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <span className={`text-sm ${!annual ? "font-medium text-seablue-900" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} className="data-[state=checked]:bg-seablue-600" />
          <span className={`text-sm ${annual ? "font-medium text-seablue-900" : "text-muted-foreground"}`}>Annual</span>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            Save up to 17%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`flex flex-col ${plan.popular ? "border-seablue-600 shadow-lg shadow-seablue-100" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-seablue-600 px-3 py-1 text-xs font-medium text-white">
                Most Popular
              </div>
            )}
            <CardHeader className={`${plan.popular ? "pt-8" : ""}`}>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[50px]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold text-seablue-900">
                  ${annual ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  {plan.monthlyPrice === 0 ? "" : annual ? "/year" : "/month"}
                </span>

                {annual && plan.monthlyPrice > 0 && (
                  <div className="mt-1 text-xs text-green-600">
                    Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                  </div>
                )}
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <Check className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <X className="mr-2 h-5 w-5 shrink-0 text-gray-300" />
                    )}
                    <span className={`text-sm ${feature.included ? "" : "text-muted-foreground"}`}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-seablue-600 hover:bg-seablue-700"
                    : plan.name === "Free"
                      ? "bg-seablue-600 hover:bg-seablue-700"
                      : "bg-seablue-600 hover:bg-seablue-700"
                }`}
              >
                {plan.cta}
              </Button>
              {plan.name !== "Free" && (
                <p className="w-full text-xs text-center text-muted-foreground mt-2">
                  Pay securely with PayPal, Visa, or Mastercard
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-seablue-900">Accepted Payment Methods</h3>
          <p className="text-muted-foreground mt-1">Secure and flexible payment options for your convenience</p>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-2">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border p-2">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#003087]" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .634-.546h4.823a.641.641 0 0 1 .633.547l.317 2.066a.642.642 0 0 1-.634.736H6.39l-1.057 7.866a.641.641 0 0 1-.634.546H3.076a.641.641 0 0 1-.634-.546l-.634-4.605a.641.641 0 0 1 .634-.736h3.387l-.317-2.066a.641.641 0 0 1 .634-.736h4.823a.641.641 0 0 1 .633.547l.317 2.066a.642.642 0 0 1-.634.736H7.71l1.057 7.866a.641.641 0 0 1-.634.546h-1.057z" />
                <path d="M19.23 7.873h-4.823a.641.641 0 0 1-.633-.547l-.317-2.066a.641.641 0 0 1 .634-.736h4.823a.641.641 0 0 1 .633.547l.317 2.066a.641.641 0 0 1-.634.736z" />
                <path d="M21.53 21.337h-4.823a.641.641 0 0 1-.633-.547l-2.107-13.464a.641.641 0 0 1 .634-.736h4.823a.641.641 0 0 1 .633.547l2.107 13.464a.641.641 0 0 1-.634.736z" />
              </svg>
            </div>
            <span className="text-sm font-medium mt-2">PayPal</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border p-2">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#1A1F71]" fill="currentColor">
                <path d="M22.5 12a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-4.266-5.73a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm18.138 5.73a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-3.468 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5z" />
                <path d="M19.5 7a.5.5 0 0 1-.5.5h-14a.5.5 0 0 1 0-1h14a.5.5 0 0 1 .5.5zm0 10a.5.5 0 0 1-.5.5h-14a.5.5 0 0 1 0-1h14a.5.5 0 0 1 .5.5z" />
                <path d="M22.5 16.5a.5.5 0 0 1-.5.5h-20a.5.5 0 0 1 0-1h20a.5.5 0 0 1 .5.5zm0-9a.5.5 0 0 1-.5.5h-20a.5.5 0 0 1 0-1h20a.5.5 0 0 1 .5.5z" />
                <path d="M16.5 19.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1 0-1h8a.5.5 0 0 1 .5.5zm0-15a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1 0-1h8a.5.5 0 0 1 .5.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium mt-2">Visa</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border p-2">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                <circle cx="7" cy="12" r="3" fill="#EB001B" />
                <circle cx="17" cy="12" r="3" fill="#F79E1B" />
                <path d="M12 15a3 3 0 0 1 0-6 3 3 0 0 1 0 6z" fill="#FF5F00" />
              </svg>
            </div>
            <span className="text-sm font-medium mt-2">Mastercard</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">All payments are secure and encrypted</p>
      </div>

      <div className="mt-16 rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-left">
          <div className="rounded-full bg-seablue-100 p-3">
            <Zap className="h-6 w-6 text-seablue-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-seablue-900">Enterprise Solutions</h3>
            <p className="text-muted-foreground">
              Need a custom solution for your large organization? Contact our sales team for a tailored package.
            </p>
          </div>
          <div className="sm:ml-auto">
            <Button className="bg-seablue-600 hover:bg-seablue-700">Contact Sales</Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-seablue-900">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated
                difference. When downgrading, the new rate will apply at the start of your next billing cycle.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For
                Enterprise plans, we also offer invoice payment options.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial available?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial. You
                can upgrade to a paid plan at any time during or after your trial.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is the sensory code tracking feature?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sensory code tracking allows you to monitor your inventory items in real-time using QR codes, barcodes,
                or RFID tags. This feature provides detailed tracking information, including location, temperature,
                humidity, and movement data for your valuable inventory.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

