"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { detectCardType, validateCardNumber, validateExpiryDate } from "@/utils/payment-service"
import { CreditCard, Calendar, Lock } from "lucide-react"

interface CreditCardFormProps {
  onCardDetailsChange: (details: {
    cardNumber: string
    cardholderName: string
    expiryDate: string
    cvv: string
    isValid: boolean
  }) => void
  disabled?: boolean
}

export function CreditCardForm({ onCardDetailsChange, disabled = false }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null)
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  })

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const sanitized = value.replace(/\D/g, "")
    const groups = []

    for (let i = 0; i < sanitized.length; i += 4) {
      groups.push(sanitized.slice(i, i + 4))
    }

    return groups.join(" ")
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const sanitized = value.replace(/\D/g, "")

    if (sanitized.length <= 2) {
      return sanitized
    }

    return `${sanitized.slice(0, 2)}/${sanitized.slice(2, 4)}`
  }

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "")

    if (value.length <= 19) {
      setCardNumber(formatCardNumber(value))
      setCardType(detectCardType(value))

      if (value.length > 0 && !validateCardNumber(value)) {
        setErrors((prev) => ({ ...prev, cardNumber: "Invalid card number" }))
      } else {
        setErrors((prev) => ({ ...prev, cardNumber: "" }))
      }
    }
  }

  // Handle expiry date change
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, "")

    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value))

      if (value.length === 4) {
        const formatted = formatExpiryDate(value)
        if (!validateExpiryDate(formatted)) {
          setErrors((prev) => ({ ...prev, expiryDate: "Invalid or expired date" }))
        } else {
          setErrors((prev) => ({ ...prev, expiryDate: "" }))
        }
      } else {
        setErrors((prev) => ({ ...prev, expiryDate: "" }))
      }
    }
  }

  // Handle CVV change
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")

    if (value.length <= 4) {
      setCvv(value)

      if (value.length > 0 && (value.length < 3 || value.length > 4)) {
        setErrors((prev) => ({ ...prev, cvv: "CVV must be 3-4 digits" }))
      } else {
        setErrors((prev) => ({ ...prev, cvv: "" }))
      }
    }
  }

  // Handle cardholder name change
  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value)

    if (e.target.value.trim().length === 0) {
      setErrors((prev) => ({ ...prev, cardholderName: "Cardholder name is required" }))
    } else {
      setErrors((prev) => ({ ...prev, cardholderName: "" }))
    }
  }

  // Update parent component with card details and validation status
  useEffect(() => {
    const isValid =
      cardNumber.length > 0 &&
      cardholderName.trim().length > 0 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      !errors.cardNumber &&
      !errors.cardholderName &&
      !errors.expiryDate &&
      !errors.cvv

    onCardDetailsChange({
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardholderName,
      expiryDate,
      cvv,
      isValid,
    })
  }, [cardNumber, cardholderName, expiryDate, cvv, errors, onCardDetailsChange])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-number" className="flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Card Number
          {cardType && (
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {cardType === "visa" ? "Visa" : "Mastercard"}
            </span>
          )}
        </Label>
        <Input
          id="card-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={errors.cardNumber ? "border-red-500" : ""}
          disabled={disabled}
        />
        {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardholder-name">Cardholder Name</Label>
        <Input
          id="cardholder-name"
          placeholder="John Doe"
          value={cardholderName}
          onChange={handleCardholderNameChange}
          className={errors.cardholderName ? "border-red-500" : ""}
          disabled={disabled}
        />
        {errors.cardholderName && <p className="text-xs text-red-500">{errors.cardholderName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry-date" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Expiry Date
          </Label>
          <Input
            id="expiry-date"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            className={errors.expiryDate ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            CVV
          </Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            className={errors.cvv ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        <p className="flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Your payment information is encrypted and secure.
        </p>
      </div>
    </div>
  )
}
