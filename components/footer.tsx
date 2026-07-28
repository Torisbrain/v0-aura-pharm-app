'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    alert("Thanks! You've been added to our mailing list.")
    setEmail('')
  }
  return (
    <footer className="bg-foreground text-background">
      {/* CTA Section */}
      <section id="contact" className="border-b border-background/10 px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-background/80">
            Join hundreds of pharmacies across West Africa using AuraBridge Health 
            to improve patient outcomes and streamline operations.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-background/20 text-background hover:bg-background/10 hover:text-background">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="px-4 py-12">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">A</span>
                </div>
                <span className="text-xl font-bold">AuraBridge</span>
              </Link>
              <p className="mb-4 text-sm text-background/70">
                AI pharmacy intelligence built for Nigeria and West Africa. 
                Empowering pharmacies to deliver better patient care.
              </p>
              <div className="space-y-2 text-sm text-background/70">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@aurabridge.health</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+234 800 AURA HEALTH</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Link href="https://www.linkedin.com/company/aurabridge-health" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="https://github.com/Torisbrain/v0-aura-pharm-app" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="https://x.com/AuraBridgeHQ" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter / X</span>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="#features" className="hover:text-background">Features</Link></li>
                <li><Link href="#pharmverify" className="hover:text-background">PharmVerify</Link></li>
                <li><Link href="#pricing" className="hover:text-background">Pricing</Link></li>
                <li><Link href="#" className="hover:text-background">API Documentation</Link></li>
                <li><Link href="#" className="hover:text-background">Integrations</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="#" className="hover:text-background">About Us</Link></li>
                <li><Link href="#" className="hover:text-background">Careers</Link></li>
                <li><Link href="#" className="hover:text-background">Blog</Link></li>
                <li><Link href="#" className="hover:text-background">Press Kit</Link></li>
                <li><Link href="#contact" className="hover:text-background">Contact</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-4 font-semibold">Stay Updated</h3>
              <p className="mb-4 text-sm text-background/70">
                Get the latest updates on pharmacy tech and health innovations in West Africa.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="border-background/20 bg-background/10 text-background placeholder:text-background/50"
                  required
                />
                <Button type="submit" variant="secondary" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
            <p className="text-sm text-background/70">
              &copy; {new Date().getFullYear()} AuraBridge Health. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-background/70">
              <Link href="#" className="hover:text-background">Privacy Policy</Link>
              <Link href="#" className="hover:text-background">Terms of Service</Link>
              <Link href="#" className="hover:text-background">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
