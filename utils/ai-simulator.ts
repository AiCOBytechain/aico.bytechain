/**
 * AI response simulator for fallback content
 */
import { SAMPLE_INVENTORY } from "@/data/sample-inventory"

export interface SimulatedResponseOptions {
  delay?: number
  errorProbability?: number
  variability?: boolean
}

export class AIResponseSimulator {
  private static readonly DEFAULT_OPTIONS: SimulatedResponseOptions = {
    delay: 800,
    errorProbability: 0.02, // Reduced from default value to make the app more stable
    variability: true,
  }

  private static readonly RESPONSE_TEMPLATES = {
    lowStock: [
      "Based on current inventory data, these items are running low:\n\n{items}\n\nI recommend restocking these items soon to avoid stockouts.",
      "You're running low on the following items:\n\n{items}\n\nConsider placing orders soon to maintain optimal inventory levels.",
      "Inventory alert: Low stock detected for these items:\n\n{items}\n\nWould you like me to prepare a restock recommendation?",
    ],
    restock: [
      "Based on historical sales data and current inventory levels, I recommend restocking:\n\n{items}\n\nWould you like me to prepare a purchase order for these items?",
      "Here's my restock recommendation based on your sales velocity and current stock:\n\n{items}\n\nShall I generate a purchase order draft?",
      "To maintain optimal inventory levels, you should restock these items:\n\n{items}\n\nI can help you create a purchase order if needed.",
    ],
    optimize: [
      "To optimize your inventory turnover, I recommend:\n\n{recommendations}\n\nWould you like a detailed analysis of your inventory turnover rates by category?",
      "Here are my optimization suggestions for improving your inventory efficiency:\n\n{recommendations}\n\nI can provide more detailed category-specific recommendations if needed.",
      "Based on my analysis, these changes would optimize your inventory performance:\n\n{recommendations}\n\nWould you like me to simulate the impact of these changes?",
    ],
    analyze: [
      "Based on Q3 sales data analysis:\n\n{analysis}\n\nKey insights:\n{insights}",
      "Here's my analysis of your recent sales performance:\n\n{analysis}\n\nKey takeaways:\n{insights}",
      "After analyzing your Q3 data, I've found these patterns:\n\n{analysis}\n\nStrategic insights:\n{insights}",
    ],
    predict: [
      "Based on historical data and market trends, here's my demand forecast for next month:\n\n{forecast}\n\nI recommend adjusting your inventory accordingly.",
      "Looking at your sales history and market indicators, I predict the following demand changes:\n\n{forecast}\n\nWould you like me to suggest inventory adjustments based on this forecast?",
      "My demand prediction model shows these trends for next month:\n\n{forecast}\n\nShall I create a procurement plan based on these projections?",
    ],
    general: [
      "I've analyzed your inventory data and found some interesting insights:\n\n{insights}\n\nWould you like me to provide specific recommendations for any category?",
      "After reviewing your inventory metrics, here are some key observations:\n\n{insights}\n\nWhich area would you like me to explore further?",
      "Based on your current inventory data, I've identified these notable patterns:\n\n{insights}\n\nIs there a particular aspect you'd like me to analyze in more detail?",
    ],
  }

  private static readonly RECOMMENDATIONS = [
    "1. Implement a just-in-time (JIT) inventory system for high-volume items",
    "2. Consider reducing stock levels for USB-C Hubs (currently overstocked)",
    "3. Set up automatic reorder points for frequently purchased items",
    "4. Review your Ergonomic Chairs inventory - sales have slowed in the past month",
  ]

  private static readonly ANALYSIS = [
    "• Electronics category has shown 15% growth compared to Q2",
    "• Furniture sales have decreased by 8%",
    "• Accessories remain steady with 2% growth",
  ]

  private static readonly INSIGHTS = [
    "• Laptops and monitors are your top performers",
    "• Office desk sales typically increase in September-October",
    "• Consider running a promotion on furniture items to boost sales",
  ]

  private static readonly FORECAST = [
    "• Electronics: Expected 12% increase (seasonal trend)",
    "• Furniture: Expected 5% increase (back-to-office trend)",
    "• Accessories: Expected 8% increase (follows electronics trend)",
  ]

  private static readonly GENERAL_INSIGHTS = [
    "• You currently have 8 items that are low in stock or out of stock",
    "• Your electronics category has the highest value at $14,249.87",
    "• Your inventory turnover rate is 4.2, which is good for your industry",
  ]

  public static async generateResponse(query: string, options: SimulatedResponseOptions = {}): Promise<string> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }

    // Simulate network delay
    if (opts.delay) {
      await new Promise((resolve) => setTimeout(resolve, opts.delay * (opts.variability ? 0.5 + Math.random() : 1)))
    }

    // Simulate random errors with standardized error format
    if (opts.errorProbability && Math.random() < opts.errorProbability) {
      const error = new Error("Simulated AI response error")
      ;(error as any).errorType = "simulated_failure"
      ;(error as any).retryable = true
      ;(error as any).status = 503
      throw error
    }

    // Generate appropriate response based on query
    const userQuery = query.toLowerCase()
    let responseTemplate: string
    let templateData: Record<string, string> = {}

    if (userQuery.includes("low stock") || userQuery.includes("running low")) {
      const lowStockItems = SAMPLE_INVENTORY.filter((item) => item.status === "Low Stock" || item.quantity <= 3)
        .map((item) => `• ${item.name}: ${item.quantity} units remaining`)
        .join("\n")

      responseTemplate = this.getRandomTemplate("lowStock")
      templateData = { items: lowStockItems }
    } else if (userQuery.includes("restock")) {
      const restockItems = [
        "• Wireless Mouse (Priority: High)",
        "• Office Desk (Priority: Medium)",
        "• Desk Lamp (Priority: High - currently out of stock)",
      ].join("\n")

      responseTemplate = this.getRandomTemplate("restock")
      templateData = { items: restockItems }
    } else if (userQuery.includes("optimize") || userQuery.includes("turnover")) {
      responseTemplate = this.getRandomTemplate("optimize")
      templateData = { recommendations: this.RECOMMENDATIONS.join("\n") }
    } else if (userQuery.includes("analyze") || userQuery.includes("trends")) {
      responseTemplate = this.getRandomTemplate("analyze")
      templateData = {
        analysis: this.ANALYSIS.join("\n"),
        insights: this.INSIGHTS.join("\n"),
      }
    } else if (userQuery.includes("predict") || userQuery.includes("demand")) {
      responseTemplate = this.getRandomTemplate("predict")
      templateData = { forecast: this.FORECAST.join("\n") }
    } else {
      responseTemplate = this.getRandomTemplate("general")
      templateData = { insights: this.GENERAL_INSIGHTS.join("\n") }
    }

    // Replace template variables with actual data
    return this.formatTemplate(responseTemplate, templateData)
  }

  private static getRandomTemplate(type: keyof typeof AIResponseSimulator.RESPONSE_TEMPLATES): string {
    const templates = this.RESPONSE_TEMPLATES[type]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  private static formatTemplate(template: string, data: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(`{${key}}`, value)
    }
    return result
  }
}
