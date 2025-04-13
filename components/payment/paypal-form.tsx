"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, ExternalLink } from "lucide-react"

interface PayPalFormProps {
  onPayPalDetailsChange: (details: {
    email: string
    isValid: boolean
  }) => void
  disabled?: boolean
}

export function PayPalForm({ onPayPalDetailsChange, disabled = false }: PayPalFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  // Validate email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)

    if (e.target.value.trim().length === 0) {
      setError("Email is required")
    } else if (!validateEmail(e.target.value)) {
      setError("Please enter a valid email address")
    } else {
      setError("")
    }
  }

  // Update parent component with PayPal details and validation status
  useEffect(() => {
    const isValid = email.trim().length > 0 && validateEmail(email) && !error

    onPayPalDetailsChange({
      email,
      isValid,
    })
  }, [email, error, onPayPalDetailsChange])

  // Simulate PayPal redirect
  const handlePayPalRedirect = () => {
    window.open("https://www.paypal.com", "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="paypal-email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          PayPal Email
        </Label>
        <Input
          id="paypal-email"
          type="email"
          placeholder="your-email@example.com"
          value={email}
          onChange={handleEmailChange}
          className={error ? "border-red-500" : ""}
          disabled={disabled}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <p className="text-sm text-blue-700">
          You'll be redirected to PayPal to complete your payment securely. After payment, you'll return to AiCO to
          confirm your subscription.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handlePayPalRedirect}
        disabled={disabled || !validateEmail(email)}
      >
        <img src="/stylized-payment-symbols.png" alt="PayPal" className="h-5 mr-2" />
        Pay with PayPal
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>

      <div className="mt-2 text-xs text-muted-foreground">
        <p>By continuing, you agree to PayPal's terms and conditions.</p>
      </div>
    </div>
  )
}
