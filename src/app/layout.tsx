import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

// Import client component dynamically
const ClientLayout = dynamic(() => import('@/components/layout/client-layout'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'AI Dungeon Story Game',
  description: 'An interactive story-driven game powered by AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ai-dungeon-story.vercel.app'),
  keywords: ['AI', 'Game', 'Story', 'Adventure', 'Interactive Fiction'],
  authors: [{ name: 'AI Dungeon Story Game Team' }],
  openGraph: {
    title: 'AI Dungeon Story Game',
    description: 'Embark on a unique journey where every choice shapes your story',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-black text-white antialiased flex flex-col"
      )}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
