'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Headphones, X, Send, ShieldCheck, ArrowRight } from '@/components/common/Icons';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
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
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 sm:bottom-20 md:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 md:w-auto md:h-auto p-0 md:px-4 md:py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-xl shadow-[#0066FF]/35 flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer border-2 border-white"
          aria-label="Open SafeShip Customer Support"
        >
          <div className="w-6 h-6 rounded-full md:bg-white/20 flex items-center justify-center">
            <Headphones className="w-5 h-5 md:w-3.5 md:h-3.5 text-white" />
          </div>
          <span className="hidden md:inline text-xs font-bold tracking-tight">Support Desk</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0066FF] absolute top-1 right-1 md:static" />
        </button>
      )}

      {/* Slide-over Support Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-h-[540px] h-[520px] bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
          
          {/* Drawer Header */}
          <div className="bg-[#0066FF] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>SafeShip Customer Support</span>
                  <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-medium">Live CS</span>
                </h3>
                <p className="text-[10px] text-blue-100 font-medium">
                  24/7 Priority Support &bull; Open-Box &bull; Swaps
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0066FF] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#0F172A] border border-[#E2E8F0] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#94A3B8] px-1 mt-0.5">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#0066FF] font-semibold p-2">
                <Headphones className="w-3.5 h-3.5 animate-pulse" />
                <span>SafeShip Support is typing...</span>
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
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0066FF] text-[10px] font-bold border border-[#BFDBFE] transition cursor-pointer shrink-0"
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
              className="w-8 h-8 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
