"use client"

import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PaymentResult } from "@/utils/payment-service"

interface PaymentConfirmationProps {
  result: PaymentResult
  onClose: () => void
  onRetry?: () => void
}

export function PaymentConfirmation({ result, onClose, onRetry }: PaymentConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {result.success ? (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Payment Successful</h3>
          <p className="text-muted-foreground mb-4">
            Your payment has been processed successfully. Thank you for your subscription!
          </p>
          {result.transactionId && (
            <p className="text-sm bg-gray-100 p-2 rounded mb-4">Transaction ID: {result.transactionId}</p>
          )}
          <Button onClick={onClose} className="bg-seablue-600 hover:bg-seablue-700">
            Continue
          </Button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
          <p className="text-muted-foreground mb-4">
            {result.error || "There was an issue processing your payment. Please try again."}
          </p>
          <div className="flex space-x-4">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
            <Button onClick={onClose} className="bg-seablue-600 hover:bg-seablue-700">
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
