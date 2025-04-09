"use client"

import Link from "next/link"

interface LogoProps {
  asLink?: boolean
  href?: string
}

export function Logo({ asLink = true, href = "/dashboard" }: LogoProps) {
  const logoContent = (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-seablue-600 text-white font-bold text-lg">
        A
      </div>
      <span className="font-bold text-xl text-seablue-900 dark:text-white">AiCO</span>
    </>
  )

  if (asLink) {
    return (
      <Link href={href} className="flex items-center gap-2">
        {logoContent}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{logoContent}</div>
}

