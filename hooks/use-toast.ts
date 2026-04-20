'use client'
import * as React from 'react'

type ToastVariant = 'default' | 'destructive' | 'success'

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastOptions {
  id: string
  open: boolean
}

type ToastState = {
  toasts: Toast[]
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(state: ToastState) {
  memoryState = state
  listeners.forEach((listener) => listener(state))
}

function toast(opts: ToastOptions) {
  const id = genId()
  const newToast: Toast = { ...opts, id, open: true }
  dispatch({ toasts: [...memoryState.toasts, newToast] })
  setTimeout(() => {
    dispatch({ toasts: memoryState.toasts.map(t => t.id === id ? { ...t, open: false } : t) })
    setTimeout(() => {
      dispatch({ toasts: memoryState.toasts.filter(t => t.id !== id) })
    }, 300)
  }, opts.duration ?? 3000)
  return id
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])
  return { toasts: state.toasts, toast }
}

export { useToast, toast }
