import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PharmVerifyDemo } from "@/components/pharmverify-demo"
import { Stats } from "@/components/stats"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { NearbyPharmacies } from "@/components/nearby-pharmacies"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <PharmVerifyDemo />
        <Stats />
        <Pricing />
        <NearbyPharmacies />
</main>
      <Footer />
    </div>
  )
}
