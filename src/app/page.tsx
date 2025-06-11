// src\app\page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/en')
  // Need to return something even though redirect will prevent it from rendering
  return null
}