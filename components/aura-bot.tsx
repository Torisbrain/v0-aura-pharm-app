\"use client\"

import { useState, useRef, useEffect } from \"react\"
import { MessageCircle, X, Send, Loader2, Bot, User } from \"lucide-react\"

interface Message { role: \"user\" | \"assistant\"; content: string }

const SUGGESTIONS = [
  \"What are side effects of Amoxicillin?\",
  \"Can I take Paracetamol with Ibuprofen?\",
  \"How do I verify a NAFDAC number?\",
  \"Malaria treatment options in Nigeria\",
]

export function AuraBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: \"assistant\", content: \"Hi! I'm AuraBot 👋 Your AI pharmacy assistant. Ask me about medications, drug interactions, NAFDAC registration, or pharmacy operations.\" }
  ])
  const [input, setInput] = useState(\"\")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: \"smooth\" }) }, [messages, loading])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])

  const send = async (text: string) => {
    const userMsg = text.trim()
    if (!userMsg || loading) return
    const newMessages: Message[] = [...messages, { role: \"user\", content: userMsg }]
    setMessages(newMessages)
    setInput(\"\")
    setLoading(true)
    try {
      const res = await fetch(\"/api/chat\", {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: \"assistant\", content: data.message || \"Sorry, something went wrong.\" }])
    } catch {
      setMessages([...newMessages, { role: \"assistant\", content: \"Sorry, I'm having trouble connecting. Please try again.\" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className=\"fixed bottom-24 right-4 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:right-6\">
          <div className=\"flex items-center justify-between bg-green-600 px-4 py-3 text-white\">
            <div className=\"flex items-center gap-2\">
              <div className=\"flex h-8 w-8 items-center justify-center rounded-full bg-white/20\">
                <Bot className=\"h-4 w-4\" />
              </div>
              <div>
                <p className=\"text-sm font-semibold\">AuraBot</p>
                <p className=\"text-xs text-green-100\">AI Pharmacy Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className=\"rounded-full p-1 hover:bg-white/20\">
              <X className=\"h-4 w-4\" />
            </button>
          </div>
          <div className=\"flex-1 overflow-y-auto p-4 space-y-3\">
            {messages.map((msg, i) => (
              <div key={i} className={\"flex gap-2 \" + (msg.role === \"user\" ? \"flex-row-reverse\" : \"flex-row\")}>
                <div className={\"flex h-7 w-7 shrink-0 items-center justify-center rounded-full \" + (msg.role === \"user\" ? \"bg-green-600\" : \"bg-muted\")}>
                  {msg.role === \"user\" ? <User className=\"h-3.5 w-3.5 text-white\" /> : <Bot className=\"h-3.5 w-3.5 text-muted-foreground\" />}
                </div>
                <div className={\"max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap \" + (msg.role === \"user\" ? \"bg-green-600 text-white rounded-tr-sm\" : \"bg-muted text-foreground rounded-tl-sm\")}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className=\"flex gap-2\">
                <div className=\"flex h-7 w-7 items-center justify-center rounded-full bg-muted\">
                  <Bot className=\"h-3.5 w-3.5 text-muted-foreground\" />
                </div>
                <div className=\"flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-3 py-2\">
                  <span className=\"h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]\" />
                  <span className=\"h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]\" />
                  <span className=\"h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]\" />
                </div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className=\"mt-2 space-y-1.5\">
                <p className=\"text-xs text-muted-foreground\">Try asking:</p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className=\"block w-full rounded-lg border border-border bg-background px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted transition-colors\">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input) }} className=\"flex gap-2 border-t border-border p-3\">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder=\"Ask about any medication...\" className=\"flex-1 rounded-full border border-input bg-muted px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500\" disabled={loading} />
            <button type=\"submit\" disabled={loading || !input.trim()} className=\"flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 disabled:opacity-50\">
              {loading ? <Loader2 className=\"h-4 w-4 animate-spin\" /> : <Send className=\"h-4 w-4\" />}
            </button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} className=\"fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all hover:bg-green-700 hover:scale-105 sm:right-6\" aria-label=\"Open AuraBot\">
        {open ? <X className=\"h-6 w-6\" /> : <MessageCircle className=\"h-6 w-6\" />}
      </button>
    </>
  )
}
