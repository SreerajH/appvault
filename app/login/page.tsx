'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/layout/auth-shell'
import { toast } from '@/hooks/use-toast'
import { loginSchema, type LoginInput } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const fillDemo = () => {
    setValue('email', 'demo@appvault.com')
    setValue('password', 'demo1234')
  }

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      toast({ title: 'Login failed', description: 'Invalid email or password', variant: 'destructive' })
    } else {
      toast({ title: 'Welcome back!', variant: 'success' })
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back."
      sub="Pick up where you left off — your reviews are waiting."
      footer={
        <>
          New to AppVault?{' '}
          <Link href="/register" className="font-semibold text-signal-ink hover:text-ink">Create an account</Link>
        </>
      }
    >
      {/* Demo account ticket */}
      <div className="mb-7 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-ink/25 bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Demo account</p>
          <p className="mt-0.5 truncate font-mono text-[13px] text-ink">demo@appvault.com · demo1234</p>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={fillDemo} className="shrink-0">Use it</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-[#9A1D14]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-11"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[#9A1D14]">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
              Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
