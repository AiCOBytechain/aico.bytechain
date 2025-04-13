// Define profile data structure
export interface ProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  company?: string
  avatar?: string
  role: string
  settings: {
    darkMode: boolean
    notifications: {
      email: boolean
      browser: boolean
      mobile: boolean
    }
    language: string
    theme: string
  }
  lastUpdated: string
}

// Default profile data
const defaultProfile: ProfileData = {
  id: "user-1",
  firstName: "AiCO",
  lastName: "Admin",
  email: "aicobytechain@gmail.com",
  username: "aicoadmin",
  company: "AiCO Inc.",
  role: "Admin",
  settings: {
    darkMode: false,
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
    language: "en-US",
    theme: "seablue",
  },
  lastUpdated: new Date().toISOString(),
}

/**
 * Get profile data from storage or return default
 */
export function getProfileData(): ProfileData {
  if (typeof window === "undefined") {
    return defaultProfile
  }

  try {
    const storedProfile = localStorage.getItem("user_profile")
    if (storedProfile) {
      return JSON.parse(storedProfile)
    }
    return defaultProfile
  } catch (error) {
    console.error("Error retrieving profile data:", error)
    return defaultProfile
  }
}

/**
 * Save profile data to storage
 */
export async function saveProfileData(profileData: Partial<ProfileData>): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  try {
    // Get current profile data and merge with updates
    const currentProfile = getProfileData()
    const updatedProfile = {
      ...currentProfile,
      ...profileData,
      lastUpdated: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile))

    // In a real app, this would also save to a backend API
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return true
  } catch (error) {
    console.error("Error saving profile data:", error)
    return false
  }
}

/**
 * Save profile avatar
 * @param avatarData Base64 or URL of the avatar
 * @returns Promise resolving to success status
 */
export async function saveProfileAvatar(avatarData: string): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  try {
    // Get current profile
    const currentProfile = getProfileData()

    // In a real app, this would upload the image to a storage service
    // and return a URL. Here we're just storing the data directly.

    // Optimize image if it's a data URL (base64)
    let optimizedAvatar = avatarData
    if (avatarData.startsWith("data:image")) {
      optimizedAvatar = await optimizeImageDataUrl(avatarData)
    }

    // Update profile with new avatar
    const updatedProfile = {
      ...currentProfile,
      avatar: optimizedAvatar,
      lastUpdated: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile))

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error("Error saving profile avatar:", error)
    return false
  }
}

/**
 * Delete profile avatar
 */
export async function deleteProfileAvatar(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  try {
    // Get current profile
    const currentProfile = getProfileData()

    // Remove avatar
    const updatedProfile = {
      ...currentProfile,
      avatar: undefined,
      lastUpdated: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile))

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return true
  } catch (error) {
    console.error("Error deleting profile avatar:", error)
    return false
  }
}

/**
 * Optimize image data URL by resizing and compressing
 * In a real app, this would use a proper image processing library
 */
async function optimizeImageDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas")

        // Max dimensions for profile picture
        const MAX_WIDTH = 400
        const MAX_HEIGHT = 400

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw resized image to canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convert to data URL with compression (0.85 quality)
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
        resolve(optimizedDataUrl)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image for optimization"))
      }

      img.src = dataUrl
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Validate profile data
 * @returns Array of validation errors, empty if valid
 */
export function validateProfileData(data: Partial<ProfileData>): string[] {
  const errors: string[] = []

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (data.firstName && data.firstName.trim().length < 1) {
    errors.push("First name cannot be empty")
  }

  if (data.username && data.username.trim().length < 3) {
    errors.push("Username must be at least 3 characters")
  }

  return errors
}
