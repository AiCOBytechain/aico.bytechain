"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckoutForm } from "@/components/payment/checkout-form"

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Calculate savings percentage
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12
    const savings = ((monthlyCost - yearly) / monthlyCost) * 100
    return Math.round(savings)
  }

  // Original prices before 60% discount
  const originalPrices = {
    standard: {
      monthly: 19.99,
      yearly: 500,
    },
    professional: {
      monthly: 49.99,
      yearly: 500,
    },
    enterprise: {
      monthly: 99.99,
      yearly: 500,
    },
  }

  // Apply 60% discount
  const discountedPrices = {
    standard: {
      monthly: originalPrices.standard.monthly * 0.4,
      yearly: originalPrices.standard.yearly * 0.4,
    },
    professional: {
      monthly: originalPrices.professional.monthly * 0.4,
      yearly: originalPrices.professional.yearly * 0.4,
    },
    enterprise: {
      monthly: originalPrices.enterprise.monthly * 0.4,
      yearly: originalPrices.enterprise.yearly * 0.4,
    },
  }

  // Apply 15% increase to the discounted prices
  const finalPrices = {
    standard: {
      monthly: discountedPrices.standard.monthly * 1.15,
      yearly: discountedPrices.standard.yearly * 1.15,
    },
    professional: {
      monthly: discountedPrices.professional.monthly * 1.15,
      yearly: discountedPrices.professional.yearly * 1.15,
    },
    enterprise: {
      monthly: discountedPrices.enterprise.monthly * 1.15,
      yearly: discountedPrices.enterprise.yearly * 1.15,
    },
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic inventory management for individuals and startups",
      monthlyPrice: 0,
      yearlyPrice: 0,
      originalMonthlyPrice: 0,
      originalYearlyPrice: 0,
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
      id: "standard",
      name: "Standard",
      description: "Complete inventory solution for small businesses",
      originalMonthlyPrice: originalPrices.standard.monthly,
      originalYearlyPrice: originalPrices.standard.yearly,
      monthlyPrice: finalPrices.standard.monthly,
      yearlyPrice: finalPrices.standard.yearly,
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
      id: "professional",
      name: "Professional",
      description: "Advanced features for growing businesses",
      originalMonthlyPrice: originalPrices.professional.monthly,
      originalYearlyPrice: originalPrices.professional.yearly,
      monthlyPrice: finalPrices.professional.monthly,
      yearlyPrice: finalPrices.professional.yearly,
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
      id: "enterprise",
      name: "Enterprise",
      description: "Complete solution for large organizations",
      originalMonthlyPrice: originalPrices.enterprise.monthly,
      originalYearlyPrice: originalPrices.enterprise.yearly,
      monthlyPrice: finalPrices.enterprise.monthly,
      yearlyPrice: finalPrices.enterprise.yearly,
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

  // Handle subscription button click
  const handleSubscribe = (plan: any) => {
    if (plan.id === "free") {
      // Handle free plan signup
      window.location.href = "/auth/signup"
      return
    }

    if (plan.id === "enterprise") {
      // Handle enterprise plan (contact sales)
      window.location.href = "/contact"
      return
    }

    // For paid plans, show checkout
    setSelectedPlan(plan)
    setShowCheckout(true)
  }

  // Handle checkout success
  const handleCheckoutSuccess = () => {
    // In a real app, you would redirect to a success page or dashboard
    setShowCheckout(false)
  }

  // Handle checkout cancel
  const handleCheckoutCancel = () => {
    setShowCheckout(false)
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-seablue-900">
            Simple, Transparent Pricing
          </h1>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mx-auto max-w-[700px] border border-green-200 animate-pulse">
            <span className="font-bold">Limited Time Offer:</span> 60% OFF all plans!
          </div>
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
                {plan.monthlyPrice === 0 ? (
                  <span className="text-4xl font-bold text-seablue-900">Free</span>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-bold text-seablue-900">
                        ${annual ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                      </span>
                      {plan.originalMonthlyPrice > 0 && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${annual ? plan.originalYearlyPrice.toFixed(2) : plan.originalMonthlyPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground">{annual ? "/year" : "/month"}</span>
                    <div className="mt-1 text-sm font-medium text-green-600">60% Discount Applied!</div>
                    {annual && plan.monthlyPrice > 0 && (
                      <div className="mt-1 text-xs text-green-600">
                        Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                      </div>
                    )}
                  </>
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
                onClick={() => handleSubscribe(plan)}
              >
                {plan.cta}
              </Button>
              {plan.name !== "Free" && (
                <div className="w-full flex justify-center mt-2 space-x-2">
                  <img src="/financial-network-symbol.png" alt="Visa" className="h-5 w-auto" />
                  <img src="/overlapping-circles-logo.png" alt="Mastercard" className="h-5 w-auto" />
                  <img src="/stylized-payment-symbols.png" alt="PayPal" className="h-5 w-auto" />
                </div>
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
              <img src="/financial-network-symbol.png" alt="Visa" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-sm mt-1">Visa</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border p-2">
              <img src="/overlapping-circles-logo.png" alt="Mastercard" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-sm mt-1">Mastercard</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border p-2">
              <img src="/stylized-payment-symbols.png" alt="PayPal" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-sm mt-1">PayPal</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <h4 className="text-lg font-medium mb-2">Secure Payment Processing</h4>
          <p className="text-sm text-muted-foreground">
            All payments are securely processed using industry-standard encryption. Your payment information is never
            stored on our servers. We comply with PCI DSS standards to ensure the highest level of security for your
            transactions.
          </p>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[800px] p-0">
          {selectedPlan && (
            <CheckoutForm
              planName={selectedPlan.name}
              planDescription={selectedPlan.description}
              amount={annual ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}
              isAnnual={annual}
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
