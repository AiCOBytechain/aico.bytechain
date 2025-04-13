"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { PaymentMethod } from "@/utils/payment-service"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  disabled?: boolean
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Method</h3>

      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        disabled={disabled}
      >
        <div>
          <RadioGroupItem value="visa" id="visa" className="peer sr-only" disabled={disabled} />
          <Label
            htmlFor="visa"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-seablue-600 [&:has([data-state=checked])]:border-seablue-600"
          >
            <div className="mb-3 h-12 w-full flex items-center justify-center">
              <div className="h-8 w-12 relative">
                <img src="/financial-network-symbol.png" alt="Visa" className="object-contain" />
              </div>
            </div>
            <span className="text-sm font-medium">Visa</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="mastercard" id="mastercard" className="peer sr-only" disabled={disabled} />
          <Label
            htmlFor="mastercard"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-seablue-600 [&:has([data-state=checked])]:border-seablue-600"
          >
            <div className="mb-3 h-12 w-full flex items-center justify-center">
              <div className="h-8 w-12 relative">
                <img src="/overlapping-circles-logo.png" alt="Mastercard" className="object-contain" />
              </div>
            </div>
            <span className="text-sm font-medium">Mastercard</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" disabled={disabled} />
          <Label
            htmlFor="paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-seablue-600 [&:has([data-state=checked])]:border-seablue-600"
          >
            <div className="mb-3 h-12 w-full flex items-center justify-center">
              <div className="h-8 w-12 relative">
                <img src="/stylized-payment-symbols.png" alt="PayPal" className="object-contain" />
              </div>
            </div>
            <span className="text-sm font-medium">PayPal</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
