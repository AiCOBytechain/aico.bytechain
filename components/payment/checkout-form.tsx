"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, ShieldCheck, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { PaymentMethodSelector } from "./payment-method-selector"
import { CreditCardForm } from "./credit-card-form"
import { PayPalForm } from "./paypal-form"
import { BillingAddressForm } from "./billing-address-form"
import { PaymentConfirmation } from "./payment-confirmation"

import { type PaymentMethod, type PaymentDetails, processPayment, savePaymentMethod } from "@/utils/payment-service"

interface CheckoutFormProps {
  planName: string
  planDescription: string
  amount: number
  currency?: string
  isAnnual?: boolean
  onSuccess?: () => void
  onCancel?: () => void
}

export function CheckoutForm({
  planName,
  planDescription,
  amount,
  currency = "USD",
  isAnnual = false,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("visa")

  // Form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    isValid: false,
  })

  const [paypalDetails, setPaypalDetails] = useState({
    email: "",
    isValid: false,
  })

  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isValid: false,
  })

  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [savePaymentInfo, setSavePaymentInfo] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean
    transactionId?: string
    error?: string
  } | null>(null)

  // Check if form is valid based on selected payment method
  const isFormValid = () => {
    const isAddressValid = billingAddress.isValid
    const isPaymentValid =
      paymentMethod === "visa" || paymentMethod === "mastercard" ? cardDetails.isValid : paypalDetails.isValid

    return isAddressValid && isPaymentValid && agreeToTerms
  }

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast({
        title: "Please complete all required fields",
        description: "Make sure all payment and billing information is filled out correctly.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Prepare payment details based on selected method
      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        billingAddress: {
          line1: billingAddress.line1,
          line2: billingAddress.line2,
          city: billingAddress.city,
          state: billingAddress.state,
          postalCode: billingAddress.postalCode,
          country: billingAddress.country,
        },
      }

      if (paymentMethod === "visa" || paymentMethod === "mastercard") {
        paymentDetails.cardNumber = cardDetails.cardNumber
        paymentDetails.expiryDate = cardDetails.expiryDate
        paymentDetails.cvv = cardDetails.cvv
        paymentDetails.cardholderName = cardDetails.cardholderName
      } else if (paymentMethod === "paypal") {
        paymentDetails.paypalEmail = paypalDetails.email
      }

      // Process payment
      const result = await processPayment(amount, currency, paymentDetails)

      // Save payment method if requested
      if (result.success && savePaymentInfo) {
        // In a real app, you would use the user's ID from auth context
        await savePaymentMethod("user123", paymentDetails)
      }

      // Set result and show confirmation
      setPaymentResult(result)
      setShowConfirmation(true)

      // Call onSuccess callback if payment was successful
      if (result.success && onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Payment error:", error)

      setPaymentResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
      setShowConfirmation(true)

      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  // Handle confirmation close
  const handleConfirmationClose = () => {
    setShowConfirmation(false)

    if (paymentResult?.success) {
      // In a real app, you would redirect to a success page or dashboard
      toast({
        title: "Subscription Activated",
        description: `Your ${planName} subscription has been activated successfully.`,
      })
    }
  }

  // Handle payment retry
  const handleRetry = () => {
    setShowConfirmation(false)
    setPaymentResult(null)
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Secure checkout for your {planName} subscription</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="flex justify-between mb-1">
                <span>
                  {planName} Plan ({isAnnual ? "Annual" : "Monthly"})
                </span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{planDescription}</p>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>
                  ${amount.toFixed(2)} {currency}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
              disabled={isProcessing}
            />

            {/* Payment Details Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details</h3>

              {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
                <CreditCardForm onCardDetailsChange={setCardDetails} disabled={isProcessing} />
              )}

              {paymentMethod === "paypal" && (
                <PayPalForm onPayPalDetailsChange={setPaypalDetails} disabled={isProcessing} />
              )}
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Billing Address</h3>
              <BillingAddressForm onAddressChange={setBillingAddress} disabled={isProcessing} />
            </div>

            {/* Save Payment Info */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-payment"
                checked={savePaymentInfo}
                onCheckedChange={(checked) => setSavePaymentInfo(!!checked)}
                disabled={isProcessing}
              />
              <Label htmlFor="save-payment">Save payment information for future purchases</Label>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                disabled={isProcessing}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, you agree to our{" "}
                  <a href="#" className="text-seablue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-seablue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
                <p className="text-xs text-green-700 mt-1">
                  Your payment information is encrypted and secure. We use industry-standard security measures to
                  protect your data.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-seablue-600 hover:bg-seablue-700"
              disabled={isProcessing || !isFormValid()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${amount.toFixed(2)} {currency}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          {paymentResult && (
            <PaymentConfirmation result={paymentResult} onClose={handleConfirmationClose} onRetry={handleRetry} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
