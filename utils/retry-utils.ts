/**
 * Retry utility with exponential backoff and jitter
 */
export interface RetryOptions {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  factor: number
  jitter: boolean
  onRetry?: (attempt: number, delay: number, error: any) => void
}

export const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 500,
  maxDelay: 10000,
  factor: 2,
  jitter: true,
}

export async function withRetry<T>(fn: () => Promise<T>, options: Partial<RetryOptions> = {}): Promise<T> {
  const opts = { ...defaultRetryOptions, ...options }
  let attempt = 0
  let lastError: any = null

  while (true) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      attempt++

      // Check if we've reached max retries
      if (attempt >= opts.maxRetries) {
        console.warn(`Max retries (${opts.maxRetries}) reached. Giving up.`, error)
        throw error
      }

      // Calculate delay with exponential backoff
      let delay = Math.min(opts.maxDelay, opts.initialDelay * Math.pow(opts.factor, attempt))

      // Add jitter to prevent synchronized retries
      if (opts.jitter) {
        delay = Math.random() * delay * 0.3 + delay * 0.7
      }

      // Call onRetry callback if provided
      if (opts.onRetry) {
        opts.onRetry(attempt, delay, error)
      }

      console.log(`Retry attempt ${attempt}/${opts.maxRetries} after ${delay}ms`)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
