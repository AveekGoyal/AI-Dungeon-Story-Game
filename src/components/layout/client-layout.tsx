"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Navbar } from "./navbar"
import { AuthNavbar } from "./auth-navbar"
import Footer from "./footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Don't show any navbar on auth pages
  const isAuthPage = pathname.startsWith('/(auth)')
  const isLandingPage = pathname === '/'
  
  // Wait for session to be checked before rendering
  if (status === "loading") {
    return (
      <main className="flex-1">
        {children}
      </main>
    )
  }

  return (
    <>
      {!isAuthPage && (isLandingPage ? <Navbar /> : session?.user ? <AuthNavbar /> : <Navbar />)}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  )
}
