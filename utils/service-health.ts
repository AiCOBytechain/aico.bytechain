// Check if we're running on the client side
const isClient = typeof window !== "undefined"

/**
 * Service health monitor to track API availability
 */
export type ServiceStatus = "operational" | "degraded" | "unavailable"

export interface ServiceHealth {
  status: ServiceStatus
  lastChecked: Date
  failureCount: number
  consecutiveFailures: number
  recoveryAttempts: number
}

class ServiceHealthMonitor {
  private services: Map<string, ServiceHealth> = new Map()
  private listeners: Set<(serviceId: string, health: ServiceHealth) => void> = new Set()

  constructor() {
    // Only initialize services if we're on the client side
    if (isClient) {
      this.initService("chat-api")
      this.initService("inventory-api")
    }
  }

  private initService(serviceId: string): void {
    this.services.set(serviceId, {
      status: "operational",
      lastChecked: new Date(),
      failureCount: 0,
      consecutiveFailures: 0,
      recoveryAttempts: 0,
    })
  }

  public getServiceHealth(serviceId: string): ServiceHealth {
    if (!this.services.has(serviceId)) {
      this.initService(serviceId)
    }
    return this.services.get(serviceId)!
  }

  public reportSuccess(serviceId: string): void {
    if (!this.services.has(serviceId)) {
      this.initService(serviceId)
    }

    const health = this.services.get(serviceId)!
    const updatedHealth: ServiceHealth = {
      ...health,
      status: "operational",
      lastChecked: new Date(),
      consecutiveFailures: 0,
      recoveryAttempts: health.status !== "operational" ? health.recoveryAttempts + 1 : 0,
    }

    this.services.set(serviceId, updatedHealth)
    this.notifyListeners(serviceId, updatedHealth)
  }

  public reportFailure(serviceId: string): void {
    if (!this.services.has(serviceId)) {
      this.initService(serviceId)
    }

    const health = this.services.get(serviceId)!
    const consecutiveFailures = health.consecutiveFailures + 1

    // Determine new status based on consecutive failures
    let newStatus: ServiceStatus = health.status
    if (consecutiveFailures >= 5) {
      newStatus = "unavailable"
    } else if (consecutiveFailures >= 2) {
      newStatus = "degraded"
    }

    const updatedHealth: ServiceHealth = {
      ...health,
      status: newStatus,
      lastChecked: new Date(),
      failureCount: health.failureCount + 1,
      consecutiveFailures,
      recoveryAttempts: 0,
    }

    this.services.set(serviceId, updatedHealth)
    this.notifyListeners(serviceId, updatedHealth)
  }

  public subscribe(callback: (serviceId: string, health: ServiceHealth) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private notifyListeners(serviceId: string, health: ServiceHealth): void {
    this.listeners.forEach((listener) => {
      try {
        listener(serviceId, health)
      } catch (error) {
        console.error("Error in service health listener:", error)
      }
    })
  }

  public resetService(serviceId: string): void {
    this.initService(serviceId)
    this.notifyListeners(serviceId, this.getServiceHealth(serviceId))
  }
}

// Singleton instance - only create if on client side
export const serviceHealth = isClient ? new ServiceHealthMonitor() : null
