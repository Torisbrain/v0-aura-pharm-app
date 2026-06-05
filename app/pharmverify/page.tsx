"use client"
import { PharmVerifyDemo } from "@/components/pharmverify-demo"
import { Header } from "@/components/header"
import { AuraBot } from "@/components/aura-bot"

export default function PharmVerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <PharmVerifyDemo />
      </main>
      <AuraBot />
    </div>
  )
}
