'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Headphones, X, Send, ShieldCheck, Phone, Check } from '@/components/common/Icons';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

/**
 * Clean, lightweight Markdown parser for AI support responses
 */
function renderFormattedMessage(text: string, isUser: boolean) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-[#0F172A]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        if (trimmed === '---') {
          return <hr key={idx} className="my-1.5 border-slate-200" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-[11px] sm:text-xs text-[#0F172A] mt-2 mb-0.5 tracking-tight">
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.replace(/^[\*\-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 my-0.5">
              <span className="text-[#0066FF] text-[10px] leading-tight select-none mt-0.5">&bull;</span>
              <span className="flex-1 text-[11px] sm:text-xs text-slate-700">
                {parseBold(content)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[11px] sm:text-xs text-slate-700 leading-snug">
            {parseBold(line)}
          </p>
        );
      })}
    </div>
  );
}

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0F172A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function AISupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hello! Welcome to SafeShip Support. How can we assist you with Open-Box deliveries, upfront charges (₹349 1-way / ₹548 2-way swap), or doorstep inspection today?',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How does open-box delivery work?',
    'Why is only delivery charged upfront?',
    'How does 2-Way Item Swap work?',
    'What if I reject the parcel at the door?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await res.json();
      const supportReply = data.reply || 'Thank you for reaching out. We are here to assist with your SafeShip shipment and inspection.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: supportReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: 'SafeShip Open-Box Delivery guarantees that only the delivery fee is charged upfront (₹349 1-way / ₹548 2-way swap). You pay the product price via UPI only after you inspect and accept the device with courier Rahul K. at your doorstep!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Mobile + Desktop) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 md:bottom-6 right-3.5 sm:right-6 z-30 w-11 h-11 md:w-auto md:h-auto p-0 md:px-4 md:py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-xl shadow-[#0066FF]/35 flex items-center justify-center md:gap-2.5 transition active:scale-95 group cursor-pointer border-2 border-white"
          aria-label="Open SafeShip Customer Support"
        >
          <Headphones className="w-5 h-5 text-white" />
          <span className="hidden md:inline text-xs font-bold tracking-tight">Support Desk</span>
        </button>
      )}

      {/* Slide-over Support Drawer */}
      {isOpen && (
        <div className="fixed bottom-3 md:bottom-6 right-2 sm:right-6 z-50 w-[94vw] sm:w-[400px] max-h-[85vh] h-[540px] bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
          
          {/* Drawer Header */}
          <div className="bg-[#0066FF] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>SafeShip Customer Support</span>
                  <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-medium">Live AI &bull; 24/7</span>
                </h3>
                <p className="text-[10px] text-blue-100 font-medium">
                  Open-Box Inspections &bull; Swaps &bull; Doorstep UPI
                </p>
              </div>
            </div>

            {/* Direct Escalation Links & Close Button */}
            <div className="flex items-center gap-1.5">
              <a
                href="tel:18008902829"
                title="Call 1800 890 2829"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
                aria-label="Close Support Desk"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Institutional Trust Banner */}
          <div className="px-3.5 py-1.5 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between text-[10px] text-[#0066FF] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Verification &bull; ₹0 Product Fee Until Approved</span>
            </span>
            <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[9px] font-bold">ACTIVE</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0066FF] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#0F172A] border border-[#E2E8F0] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {renderFormattedMessage(m.text, m.sender === 'user')}
                </div>
                <span className="text-[9px] text-[#94A3B8] px-1 mt-0.5">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#0066FF] font-semibold p-2">
                <Headphones className="w-3.5 h-3.5 animate-pulse" />
                <span>SafeShip Specialist is drafting response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-[#F1F5F9] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] text-[10px] font-bold border border-[#BFDBFE] transition cursor-pointer shrink-0 active:scale-95"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#E2E8F0] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about open-box, swaps, fees..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] outline-hidden focus:border-[#0066FF]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
