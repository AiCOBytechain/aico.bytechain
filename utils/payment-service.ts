// Types for payment processing
export type PaymentMethod = "visa" | "mastercard" | "paypal"

export interface PaymentDetails {
  method: PaymentMethod
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  // PayPal specific fields
  paypalEmail?: string
  // Billing address fields
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

// Encryption utility for sensitive data
// In a real app, this would use a proper encryption library
const encryptData = (data: string): string => {
  // This is a placeholder. In a real app, use a proper encryption method
  // For example, you might use the Web Crypto API or a library like CryptoJS
  return btoa(`encrypted:${data}`)
}

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-numeric characters
  const sanitizedNumber = cardNumber.replace(/\D/g, "")

  if (!/^\d+$/.test(sanitizedNumber)) return false

  // Check length (most cards are 13-19 digits)
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) return false

  // Luhn algorithm implementation
  let sum = 0
  let double = false

  // Loop from right to left
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(sanitizedNumber.charAt(i))

    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    double = !double
  }

  return sum % 10 === 0
}

// Validate expiry date (MM/YY format)
export const validateExpiryDate = (expiryDate: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
  if (!regex.test(expiryDate)) return false

  const [month, year] = expiryDate.split("/")
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const expYear = Number.parseInt(year)
  const expMonth = Number.parseInt(month)

  // Check if the card is expired
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false
  }

  return true
}

// Detect card type based on card number
export const detectCardType = (cardNumber: string): PaymentMethod | null => {
  // Remove spaces and non-numeric characters
  const sanitizedNumber = cardNumber.replace(/\D/g, "")

  // Visa: Starts with 4
  if (/^4/.test(sanitizedNumber)) return "visa"

  // Mastercard: Starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(sanitizedNumber) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/.test(sanitizedNumber)) {
    return "mastercard"
  }

  return null
}

// Process payment with appropriate gateway based on payment method
export const processPayment = async (
  amount: number,
  currency: string,
  paymentDetails: PaymentDetails,
): Promise<PaymentResult> => {
  try {
    // In a real app, this would call your backend API which would then interact with the payment gateway
    // For demo purposes, we'll simulate the API call with a timeout

    // Validate payment details based on method
    if (paymentDetails.method === "visa" || paymentDetails.method === "mastercard") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv ||
        !paymentDetails.cardholderName
      ) {
        return {
          success: false,
          error: "Missing required card details",
        }
      }

      // Validate card number
      if (!validateCardNumber(paymentDetails.cardNumber)) {
        return {
          success: false,
          error: "Invalid card number",
        }
      }

      // Validate expiry date
      if (!validateExpiryDate(paymentDetails.expiryDate)) {
        return {
          success: false,
          error: "Card expired or invalid expiry date",
        }
      }

      // Validate CVV
      if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
        return {
          success: false,
          error: "Invalid CVV",
        }
      }
    } else if (paymentDetails.method === "paypal") {
      if (!paymentDetails.paypalEmail) {
        return {
          success: false,
          error: "PayPal email is required",
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.paypalEmail || !emailRegex.test(paymentDetails.paypalEmail)) {
        return {
          success: false,
          error: "Invalid PayPal email format",
        }
      }
    }

    // Simulate API call to payment gateway
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a mock transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

    // Log the transaction (in a real app, this would be done securely on the server)
    console.log(`Payment processed: ${amount} ${currency} via ${paymentDetails.method}`)

    return {
      success: true,
      transactionId,
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown payment processing error",
    }
  }
}

// Save payment method for future use (with user consent)
export const savePaymentMethod = async (userId: string, paymentDetails: PaymentDetails): Promise<boolean> => {
  try {
    // In a real app, this would securely store tokenized payment information
    // Never store raw card details - use a token from your payment processor

    // For this demo, we'll simulate storing a token
    const token = encryptData(
      JSON.stringify({
        method: paymentDetails.method,
        lastFour:
          paymentDetails.method === "paypal"
            ? paymentDetails.paypalEmail?.substring(0, 4)
            : paymentDetails.cardNumber?.slice(-4),
        expiryDate: paymentDetails.expiryDate,
      }),
    )

    // Simulate API call to save the token
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`Payment method saved for user ${userId}: ${token}`)

    return true
  } catch (error) {
    console.error("Error saving payment method:", error)
    return false
  }
}

// Get saved payment methods for a user
export const getSavedPaymentMethods = async (userId: string): Promise<any[]> => {
  // In a real app, this would fetch tokenized payment methods from your backend
  // For this demo, we'll return mock data

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: "pm_1",
      type: "visa",
      lastFour: "4242",
      expiryDate: "12/25",
    },
    {
      id: "pm_2",
      type: "paypal",
      email: "user@example.com",
    },
  ]
}
