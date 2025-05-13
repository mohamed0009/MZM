"use client"

import { ScrollbarPreview } from "@/components/ui/scrollbar-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function UIShowcasePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  
  if (!user) {
    return null
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">UI Components Showcase</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
            <CardDescription>
              This page showcases various UI components used throughout the application.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <ScrollbarPreview />
        
        {/* Additional UI components can be added here */}
      </div>
    </div>
  )
} 