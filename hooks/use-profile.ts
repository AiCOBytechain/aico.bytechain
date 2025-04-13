"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type ProfileData,
  getProfileData,
  saveProfileData,
  saveProfileAvatar,
  deleteProfileAvatar,
  validateProfileData,
} from "@/utils/profile-service"
import { toast } from "@/components/ui/use-toast"

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Load profile data on mount
  useEffect(() => {
    try {
      const profileData = getProfileData()
      setProfile(profileData)
      setErrors([])
    } catch (error) {
      console.error("Error loading profile:", error)
      setErrors(["Failed to load profile data"])
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update profile data
  const updateProfile = useCallback(
    async (data: Partial<ProfileData>) => {
      if (!profile) return false

      // Validate data
      const validationErrors = validateProfileData(data)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        validationErrors.forEach((error) => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          })
        })
        return false
      }

      setIsSaving(true)
      setErrors([])

      try {
        const success = await saveProfileData(data)

        if (success) {
          // Update local state
          setProfile((prev) => (prev ? { ...prev, ...data } : null))
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          })
          return true
        } else {
          throw new Error("Failed to save profile data")
        }
      } catch (error) {
        console.error("Error updating profile:", error)
        setErrors(["Failed to save profile data"])
        toast({
          title: "Error",
          description: "Failed to save profile data. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [profile],
  )

  // Update avatar
  const updateAvatar = useCallback(
    async (avatarData: string) => {
      if (!profile) return false

      setIsSaving(true)
      setErrors([])

      try {
        const success = await saveProfileAvatar(avatarData)

        if (success) {
          // Update local state
          setProfile((prev) => (prev ? { ...prev, avatar: avatarData } : null))
          toast({
            title: "Avatar Updated",
            description: "Your profile picture has been successfully updated.",
          })
          return true
        } else {
          throw new Error("Failed to save avatar")
        }
      } catch (error) {
        console.error("Error updating avatar:", error)
        setErrors(["Failed to save profile picture"])
        toast({
          title: "Error",
          description: "Failed to save profile picture. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [profile],
  )

  // Remove avatar
  const removeAvatar = useCallback(async () => {
    if (!profile) return false

    setIsSaving(true)
    setErrors([])

    try {
      const success = await deleteProfileAvatar()

      if (success) {
        // Update local state
        setProfile((prev) => (prev ? { ...prev, avatar: undefined } : null))
        toast({
          title: "Avatar Removed",
          description: "Your profile picture has been removed.",
        })
        return true
      } else {
        throw new Error("Failed to remove avatar")
      }
    } catch (error) {
      console.error("Error removing avatar:", error)
      setErrors(["Failed to remove profile picture"])
      toast({
        title: "Error",
        description: "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }, [profile])

  return {
    profile,
    isLoading,
    isSaving,
    errors,
    updateProfile,
    updateAvatar,
    removeAvatar,
  }
}
