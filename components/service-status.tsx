"use client"

import { useState, useEffect } from "react"
import { serviceHealth, type ServiceStatus } from "@/utils/service-health"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ServiceStatusIndicatorProps {
  serviceId: string
  label?: string
  showResetButton?: boolean
  className?: string
}

export function ServiceStatusIndicator({
  serviceId,
  label,
  showResetButton = false,
  className = "",
}: ServiceStatusIndicatorProps) {
  const [status, setStatus] = useState<ServiceStatus>("operational")
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  useEffect(() => {
    if (!serviceHealth) return

    // Get initial status
    const health = serviceHealth.getServiceHealth(serviceId)
    setStatus(health.status)
    setLastChecked(health.lastChecked)

    // Subscribe to updates
    const unsubscribe = serviceHealth.subscribe((id, health) => {
      if (id === serviceId) {
        setStatus(health.status)
        setLastChecked(health.lastChecked)
      }
    })

    return unsubscribe
  }, [serviceId])

  const getStatusDetails = () => {
    switch (status) {
      case "operational":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Operational",
          variant: "outline",
          className: "bg-green-50 text-green-700 border-green-200",
        }
      case "degraded":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Degraded",
          variant: "outline",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        }
      case "unavailable":
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: "Unavailable",
          variant: "outline",
          className: "bg-red-50 text-red-700 border-red-200",
        }
    }
  }

  const statusDetails = getStatusDetails()
  const formattedTime = lastChecked.toLocaleTimeString()

  const handleReset = () => {
    if (serviceHealth) {
      serviceHealth.resetService(serviceId)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <Badge variant="outline" className={statusDetails.className}>
              {statusDetails.icon}
              <span className="ml-1">{label ? `${label}: ${statusDetails.text}` : statusDetails.text}</span>
            </Badge>

            {showResetButton && (status === "degraded" || status === "unavailable") && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReset}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last checked: {formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
