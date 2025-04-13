"use client"

import { useProfile } from "@/hooks/use-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function ProfilePreview() {
  const { profile, isLoading } = useProfile()

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Generate a color based on the user's name (for consistent avatar background)
  const getAvatarColor = (name: string) => {
    if (!name) return "hsl(215, 65%, 55%)"

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 65%, 55%)`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-seablue-600" />
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Profile not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Profile Preview</CardTitle>
        <CardDescription>How others see your profile</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6 space-y-4">
        <Avatar className="h-20 w-20">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={`${profile.firstName} ${profile.lastName}`} />
          ) : (
            <AvatarFallback style={{ backgroundColor: getAvatarColor(`${profile.firstName} ${profile.lastName}`) }}>
              {getInitials(`${profile.firstName} ${profile.lastName}`)}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="text-center">
          <h3 className="font-medium text-lg">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          {profile.company && <p className="text-sm">{profile.company}</p>}
        </div>

        <Badge className="bg-seablue-600">{profile.role}</Badge>
      </CardContent>
    </Card>
  )
}
