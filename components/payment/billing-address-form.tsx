"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin } from "lucide-react"

interface BillingAddressFormProps {
  onAddressChange: (address: {
    line1: string
    line2: string
    city: string
    state: string
    postalCode: string
    country: string
    isValid: boolean
  }) => void
  disabled?: boolean
}

export function BillingAddressForm({ onAddressChange, disabled = false }: BillingAddressFormProps) {
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  })

  const [errors, setErrors] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  const [sameAsShipping, setSameAsShipping] = useState(false)

  // Handle address field change
  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))

    // Validate required fields
    if (field === "line1" || field === "city" || field === "state" || field === "postalCode" || field === "country") {
      if (value.trim().length === 0) {
        setErrors((prev) => ({ ...prev, [field]: "This field is required" }))
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }

    // Additional validation for postal code
    if (field === "postalCode") {
      const postalRegex = address.country === "US" ? /^\d{5}(-\d{4})?$/ : /^[A-Za-z0-9\s-]{3,10}$/
      if (value.trim().length > 0 && !postalRegex.test(value)) {
        setErrors((prev) => ({ ...prev, postalCode: "Invalid postal code format" }))
      }
    }
  }

  // Handle "Same as shipping" checkbox
  const handleSameAsShipping = (checked: boolean) => {
    setSameAsShipping(checked)

    if (checked) {
      // In a real app, you would fetch the shipping address from state/context
      // For this demo, we'll use a mock shipping address
      const shippingAddress = {
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "US",
      }

      setAddress(shippingAddress)
      setErrors({
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      })
    }
  }

  // Update parent component with address and validation status
  useEffect(() => {
    const isValid =
      address.line1.trim().length > 0 &&
      address.city.trim().length > 0 &&
      address.state.trim().length > 0 &&
      address.postalCode.trim().length > 0 &&
      address.country.trim().length > 0 &&
      !errors.line1 &&
      !errors.city &&
      !errors.state &&
      !errors.postalCode &&
      !errors.country

    onAddressChange({
      ...address,
      isValid,
    })
  }, [address, errors, onAddressChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="same-as-shipping"
          checked={sameAsShipping}
          onCheckedChange={handleSameAsShipping}
          disabled={disabled}
        />
        <Label htmlFor="same-as-shipping">Same as shipping address</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-line1" className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Address Line 1
        </Label>
        <Input
          id="address-line1"
          placeholder="Street address"
          value={address.line1}
          onChange={(e) => handleAddressChange("line1", e.target.value)}
          className={errors.line1 ? "border-red-500" : ""}
          disabled={disabled || sameAsShipping}
        />
        {errors.line1 && <p className="text-xs text-red-500">{errors.line1}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
        <Input
          id="address-line2"
          placeholder="Apartment, suite, unit, etc."
          value={address.line2}
          onChange={(e) => handleAddressChange("line2", e.target.value)}
          disabled={disabled || sameAsShipping}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            value={address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            className={errors.city ? "border-red-500" : ""}
            disabled={disabled || sameAsShipping}
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            placeholder="State"
            value={address.state}
            onChange={(e) => handleAddressChange("state", e.target.value)}
            className={errors.state ? "border-red-500" : ""}
            disabled={disabled || sameAsShipping}
          />
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal-code">Postal Code</Label>
          <Input
            id="postal-code"
            placeholder="Postal code"
            value={address.postalCode}
            onChange={(e) => handleAddressChange("postalCode", e.target.value)}
            className={errors.postalCode ? "border-red-500" : ""}
            disabled={disabled || sameAsShipping}
          />
          {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={address.country}
            onValueChange={(value) => handleAddressChange("country", value)}
            disabled={disabled || sameAsShipping}
          >
            <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
        </div>
      </div>
    </div>
  )
}
