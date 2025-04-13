"use client"

// This file ensures that client-side utilities are properly initialized
// Import it in components that need client-side utilities

import { serviceHealth } from "./service-health"

// Export a function to initialize client-side utilities
export function initClientUtilities() {
  // This function doesn't need to do anything,
  // just importing it ensures the utilities are initialized
  return { serviceHealth }
}

// Export a check for client-side environment
export const isClient = typeof window !== "undefined"
