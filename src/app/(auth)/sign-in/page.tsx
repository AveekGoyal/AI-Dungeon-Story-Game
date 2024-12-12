"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { medievalSharp } from '@/lib/typography'
import { cn } from '@/lib/utils'

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    console.log('Starting sign-in process...')

    try {
      console.log('Calling signIn with credentials...')
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      console.log('SignIn result:', result)

      if (result?.error) {
        console.log('SignIn error:', result.error)
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
        setLoading(false)
        return
      }

      // If no error, sign in was successful, redirect manually
      console.log('Sign in successful, redirecting to dashboard...')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Sign-in error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] dark:bg-[#111111] flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <h1 className={cn(
            "text-4xl font-bold text-center mb-8 bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text",
            medievalSharp.className
          )}>
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 focus:ring-orange-500/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-orange-500 hover:text-orange-400 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
