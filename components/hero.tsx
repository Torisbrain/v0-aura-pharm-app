"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users, Star } from "lucide-react"

export function Hero() {
  const openDemo = () => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:py-24">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-green-100/60 blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5">
              <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
              <span className="text-sm font-medium text-amber-700">Trusted by 500+ pharmacies</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] md:text-6xl">
              The Smart Way to{" "}
              <span className="relative">
                <span className="relative z-10 text-green-600">Run Your Pharmacy</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8.5C60 3 150 1 298 8.5" stroke="#86efac" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
              {" "}in West Africa
            </h1>

            <p className="mb-8 text-xl text-gray-500 leading-relaxed max-w-lg">
              AI-powered inventory, real-time drug verification, interaction checks, and telemedicine — built specifically for Nigerian pharmacies.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white px-8 h-13 text-base rounded-xl shadow-lg shadow-green-200" onClick={openDemo}>
                Explore Features <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-13 text-base px-8 rounded-xl border-2" onClick={openDemo}>
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: Shield, bg: "bg-green-100", color: "text-green-600", label: "NAFDAC Verified" },
                { icon: Zap, bg: "bg-blue-100", color: "text-blue-600", label: "Works on 2G/3G" },
                { icon: Users, bg: "bg-purple-100", color: "text-purple-600", label: "50,000+ Patients" },
              ].map(({ icon: Icon, bg, color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bg}`}><Icon className={`h-4 w-4 ${color}`} /></div>
                  <span className="text-sm text-gray-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Animated SVG illustration */}
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 520 480" className="w-full max-w-lg drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0fdf4" />
                  <stop offset="100%" stopColor="#dcfce7" />
                </linearGradient>
                <linearGradient id="counterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="shelfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="100%" stopColor="#713f12" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <clipPath id="phoneScreen">
                  <rect x="268" y="198" width="64" height="104" rx="3" />
                </clipPath>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Background room */}
              <rect width="520" height="480" rx="24" fill="url(#bgGrad)" />
              <rect x="0" y="360" width="520" height="120" rx="0" fill="#bbf7d0" opacity="0.4"/>

              {/* Floor */}
              <ellipse cx="260" cy="440" rx="200" ry="18" fill="#86efac" opacity="0.3" />

              {/* Back wall shelf */}
              <rect x="30" y="60" width="200" height="280" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>

              {/* Shelf boards */}
              {[130, 195, 260, 320].map((y, i) => (
                <rect key={i} x="30" y={y} width="200" height="8" rx="2" fill="url(#shelfGrad)" opacity="0.7" />
              ))}

              {/* Medicine boxes on shelves — row 1 */}
              {[
                { x: 40, y: 95, w: 28, h: 32, color: "#ef4444" },
                { x: 74, y: 98, w: 22, h: 28, color: "#3b82f6" },
                { x: 102, y: 93, w: 30, h: 34, color: "#f59e0b" },
                { x: 138, y: 96, w: 25, h: 30, color: "#8b5cf6" },
                { x: 169, y: 100, w: 20, h: 26, color: "#06b6d4" },
                { x: 195, y: 94, w: 28, h: 32, color: "#ec4899" },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.color} opacity="0.85" />
                  <rect x={b.x+2} y={b.y+4} width={b.w-4} height="6" rx="1" fill="white" opacity="0.4" />
                  {/* Barcode lines */}
                  {[0,2,4,6,8].map(l => <rect key={l} x={b.x+4+l} y={b.y+14} width="1.5" height={b.h-20} fill="white" opacity="0.5" />)}
                </g>
              ))}

              {/* Medicine boxes row 2 */}
              {[
                { x: 40, y: 145, w: 35, h: 40, color: "#16a34a" },
                { x: 81, y: 148, w: 28, h: 36, color: "#dc2626" },
                { x: 115, y: 145, w: 32, h: 42, color: "#2563eb" },
                { x: 153, y: 149, w: 24, h: 34, color: "#d97706" },
                { x: 183, y: 146, w: 38, h: 38, color: "#7c3aed" },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.color} opacity="0.85" />
                  <rect x={b.x+2} y={b.y+5} width={b.w-4} height="7" rx="1" fill="white" opacity="0.4" />
                </g>
              ))}

              {/* Pill bottles row 3 */}
              {[50, 90, 130, 165, 200].map((x, i) => (
                <g key={i}>
                  <rect x={x} y="210" width="18" height="36" rx="5" fill={["#0ea5e9","#f43f5e","#a855f7","#14b8a6","#f97316"][i]} opacity="0.9"/>
                  <rect x={x} y="208" width="18" height="10" rx="4" fill={["#0284c7","#e11d48","#9333ea","#0d9488","#ea580c"][i]}/>
                </g>
              ))}

              {/* Pharmacy counter */}
              <rect x="60" y="300" width="380" height="120" rx="12" fill="url(#counterGrad)" />
              <rect x="60" y="298" width="380" height="18" rx="8" fill="#15803d" />
              <rect x="70" y="310" width="360" height="100" rx="8" fill="#166534" opacity="0.3" />

              {/* Counter top surface */}
              <rect x="55" y="295" width="390" height="15" rx="6" fill="#4ade80" opacity="0.4" />

              {/* Computer on counter */}
              <rect x="80" y="240" width="90" height="58" rx="6" fill="#1e293b" />
              <rect x="83" y="243" width="84" height="50" rx="4" fill="#0f172a" />
              <rect x="83" y="243" width="84" height="50" rx="4" fill="#1d4ed8" opacity="0.3" />
              {/* Screen content lines */}
              {[250,258,266,274].map((y,i) => <rect key={i} x="89" y={y} width={[60,45,55,30][i]} height="4" rx="2" fill="#93c5fd" opacity="0.7"/>)}
              <rect x="108" y="292" width="46" height="6" rx="3" fill="#334155" />

              {/* PHARMACIST */}
              {/* Body — white coat */}
              <rect x="280" y="210" width="90" height="120" rx="20" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
              {/* Coat lapels */}
              <path d="M310 210 L325 240 L340 210" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
              {/* Green scrubs underneath */}
              <rect x="295" y="215" width="60" height="100" rx="15" fill="#dcfce7" />
              {/* Name badge */}
              <rect x="285" y="235" width="35" height="22" rx="4" fill="#16a34a" />
              <rect x="288" y="239" width="25" height="3" rx="1" fill="white" opacity="0.8"/>
              <rect x="288" y="245" width="20" height="2" rx="1" fill="white" opacity="0.5"/>

              {/* Head */}
              <ellipse cx="325" cy="185" rx="32" ry="36" fill="url(#skinGrad)" />
              {/* Hair */}
              <ellipse cx="325" cy="158" rx="32" ry="18" fill="#1c1917" />
              <rect x="293" y="158" width="64" height="16" fill="#1c1917" />
              {/* Face features */}
              <ellipse cx="314" cy="183" rx="5" ry="6" fill="white" />
              <ellipse cx="336" cy="183" rx="5" ry="6" fill="white" />
              <circle cx="315" cy="184" r="3" fill="#1c1917" />
              <circle cx="337" cy="184" r="3" fill="#1c1917" />
              {/* Smile */}
              <path d="M314 196 Q325 204 336 196" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Glasses */}
              <rect x="307" y="178" width="14" height="10" rx="4" fill="none" stroke="#374151" strokeWidth="1.5"/>
              <rect x="328" y="178" width="14" height="10" rx="4" fill="none" stroke="#374151" strokeWidth="1.5"/>
              <line x1="321" y1="182" x2="328" y2="182" stroke="#374151" strokeWidth="1.5"/>

              {/* RIGHT ARM — holding phone out to scan */}
              <path d="M365 240 Q400 230 390 270 Q385 290 370 285" fill="url(#skinGrad)" stroke="#b45309" strokeWidth="1"/>
              <ellipse cx="385" cy="255" rx="18" ry="12" fill="url(#skinGrad)" />

              {/* Phone */}
              <rect x="262" y="190" width="72" height="116" rx="10" fill="url(#phoneGrad)" />
              <rect x="265" y="193" width="66" height="110" rx="8" fill="#1e293b" />
              {/* Phone screen — camera viewfinder */}
              <rect x="268" y="196" width="64" height="104" rx="6" fill="#0f172a" />
              {/* Camera viewfinder UI */}
              <rect x="272" y="200" width="56" height="96" rx="4" fill="#0a0a0a" />
              {/* Corner brackets */}
              <path d="M278 210 L278 204 L284 204" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M322 204 L328 204 L328 210" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M278 286 L278 292 L284 292" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M322 292 L328 292 L328 286" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

              {/* Drug box being scanned */}
              <rect x="170" y="248" width="88" height="56" rx="6" fill="#dc2626" />
              <rect x="173" y="252" width="82" height="14" rx="2" fill="#fca5a5" opacity="0.5"/>
              <text x="214" y="262" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">AMOXICILLIN</text>
              <text x="214" y="271" textAnchor="middle" fill="#fca5a5" fontSize="6">500mg Capsules</text>
              {/* Barcode on box */}
              {[180,183,187,190,193,197,200,203,207,210,213,217,220,223,227,230,233,237,240,243,247,250].map((x, i) => (
                <rect key={i} x={x} y="275" width={i % 3 === 0 ? 2 : 1} height="22" fill="white" opacity="0.9"/>
              ))}
              <text x="214" y="303" textAnchor="middle" fill="white" fontSize="5">A4930010</text>

              {/* SCAN BEAM — animated */}
              <rect x="170" y="244" width="88" height="4" rx="2" fill="#22c55e" opacity="0.9" filter="url(#glow)">
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,52; 0,0" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1.8s" repeatCount="indefinite" />
              </rect>

              {/* Scan beam reflection on phone screen */}
              <rect x="272" y="238" width="56" height="3" rx="1" fill="#22c55e" opacity="0.7" filter="url(#glow)">
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,40; 0,0" dur="1.8s" repeatCount="indefinite" />
              </rect>

              {/* SUCCESS CHECKMARK — pulses after scan */}
              <circle cx="400" cy="220" r="18" fill="#16a34a">
                <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <path d="M391 220 L397 226 L410 213" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Floating verified badge */}
              <rect x="390" y="190" width="90" height="22" rx="11" fill="#16a34a" filter="url(#glow)">
                <animate attributeName="y" values="190;184;190" dur="3s" repeatCount="indefinite" />
              </rect>
              <text x="435" y="205" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">✓ NAFDAC VERIFIED</text>

              {/* Floating LIVE badge */}
              <rect x="30" y="380" width="70" height="26" rx="13" fill="#16a34a">
                <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
              </rect>
              <circle cx="45" cy="393" r="4" fill="white">
                <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
              </circle>
              <text x="68" y="397" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">LIVE</text>

              {/* Floating accuracy stat */}
              <rect x="420" y="370" width="80" height="52" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5">
                <animate attributeName="y" values="370;362;370" dur="4s" repeatCount="indefinite" />
              </rect>
              <text x="460" y="392" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="bold">98%</text>
              <text x="460" y="408" textAnchor="middle" fill="#6b7280" fontSize="7">Accuracy Rate</text>

              {/* Particles around scan */}
              {[0,1,2,3].map(i => (
                <circle key={i} cx={185 + i*22} cy="248" r="3" fill="#22c55e" opacity="0">
                  <animate attributeName="cy" values="248;220;248" dur={`${1.5+i*0.3}s`} repeatCount="indefinite" begin={`${i*0.4}s`}/>
                  <animate attributeName="opacity" values="0;1;0" dur={`${1.5+i*0.3}s`} repeatCount="indefinite" begin={`${i*0.4}s`}/>
                </circle>
              ))}
            </svg>

            {/* Floating cards outside SVG */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-3 animate-bounce [animation-duration:3s]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">NAFDAC Database</p>
                <p className="font-bold text-gray-900 text-sm">9,058 Drugs Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
