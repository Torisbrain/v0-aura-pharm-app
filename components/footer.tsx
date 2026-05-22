"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* CTA Section */}
      <section id="contact" className="border-b border-background/10 px-4 py-16">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-background/80">
            Join pharmacies across Nigeria and West Africa using AuraBridge Health
            to verify drugs, prevent counterfeits, and deliver better patient care.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background/20 text-background hover:bg-background/10 hover:text-background"
              onClick={() => window.open("mailto:victoriarobintoris32@gmail.com", "_blank")}
            >
              Contact Us
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
                Empowering pharmacies to deliver better patient care and
                protect patients from counterfeit drugs.
              </p>
              <div className="space-y-2 text-sm text-background/70">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:victoriarobintoris32@gmail.com"
                    className="hover:text-background transition-colors"
                  >
                    victoriarobintoris32@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a
                    href="tel:+2348159642714"
                    className="hover:text-background transition-colors"
                  >
                    +234 815 964 2714
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Port Harcourt, Rivers State, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link href="#features" className="hover:text-background transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pharmverify" className="hover:text-background transition-colors">
                    PharmVerify
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-background transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="https://pharm-assist-tool.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    PharmVerify NG (Patient App)
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link href="#" className="hover:text-background transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/victoria-robin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Torisbrain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-background transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-background transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-4 font-semibold">Stay Updated</h3>
              <p className="mb-4 text-sm text-background/70">
                Get updates on PharmVerify NG and AuraBridge Health — Nigeria&apos;s
                leading AI pharmacy intelligence platform.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="border-background/20 bg-background/10 text-background placeholder:text-background/50"
                />
                <Button variant="secondary" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-xs text-background/50">
                Built by Victoria Robin · 
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
            <p className="text-sm text-background/70">
              &copy; {new Date().getFullYear()} AuraBridge Health by Victoria Robin. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-background/70">
              <Link href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-background transition-colors">
                Terms of Service
              </Link>
              <a
                href="https://pharm-assist-tool.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background transition-colors"
              >
                PharmVerify NG
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
