"use client"

import Link from "next/link"

interface LogoProps {
  asLink?: boolean
  href?: string
}

export function Logo({ asLink = true, href = "/dashboard" }: LogoProps) {
  const logoContent = (
    <>
      <img src="/images/aico-logo.png" alt="AiCO" className="h-8 w-8 object-contain" />
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
