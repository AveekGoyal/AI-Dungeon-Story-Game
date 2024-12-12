"use client"

import { AuthNavbar } from "@/components/layout/auth-navbar"

export default function NewGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar />
      {children}
    </div>
  )
}
