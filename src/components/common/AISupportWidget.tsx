'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Headphones, X, Send, ShieldCheck, Check, AlertTriangle, FileText, Sparkles, Clock, ArrowRight } from '@/components/common/Icons';
import { analytics } from '@/lib/analytics';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  isAction?: boolean;
  actionType?: 'RAISE_TC';
}

interface TcTicket {
  id: string;
  category: string;
  orderId?: string;
  description: string;
  createdAt: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  slaMinutes: number;
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
  const [activeTab, setActiveTab] = useState<'CHAT' | 'TICKETS'>('CHAT');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hello! Welcome to SafeShip Customer Support. How can we assist with your delivery, doorstep open-box inspection, IMEI verification, or raising a support ticket (TC)?',
      time: 'Just now'
    }
  ]);

  // Customer Service TC (Ticket Case) System State
  const [tickets, setTickets] = useState<TcTicket[]>([]);
  const [tcCategory, setTcCategory] = useState<string>('Doorstep Inspection Dispute');
  const [tcOrderId, setTcOrderId] = useState<string>('');
  const [tcDescription, setTcDescription] = useState<string>('');
  const [ticketCreatedSuccess, setTicketCreatedSuccess] = useState<TcTicket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load tickets on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('safeship_tc_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        // Preseed initial ticket for demo convenience
        const seed: TcTicket[] = [
          {
            id: 'TC-82914',
            category: 'IMEI Verification Confirmation',
            orderId: 'SS48291',
            description: 'Customer requested GSMA CEIR hardware verification confirmation for iPhone 15 Pro.',
            createdAt: 'Today, 11:20 AM',
            status: 'RESOLVED',
            slaMinutes: 15
          }
        ];
        setTickets(seed);
        localStorage.setItem('safeship_tc_tickets', JSON.stringify(seed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const quickPrompts = [
    'How does open-box verification work?',
    'What if the device IMEI does not match?',
    'How does RBI Section 10A escrow protect me?',
    'Raise Support Ticket (TC)'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (query === 'Raise Support Ticket (TC)') {
      setActiveTab('TICKETS');
      setInput('');
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const isDisputeIntent = /dispute|fake|stolen|scam|damage|broken|reject|officer problem|refund/i.test(query);
    analytics.capture('support_chat_query', {
      query_length: query.length,
      is_dispute_intent: isDisputeIntent,
    });

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
      const supportReply = data.reply || 'Thank you for reaching out. SafeShip provides 100% RBI-regulated escrow protection and verified doorstep delivery.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: supportReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAction: isDisputeIntent,
          actionType: isDisputeIntent ? 'RAISE_TC' : undefined
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: 'SafeShip Open-Box Delivery guarantees that merchandise payment is settled via UPI only after you inspect and accept the device at your doorstep. If you experience an issue, you can raise an official Ticket Case (TC) for 15-minute arbitration.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAction: true,
          actionType: 'RAISE_TC'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcDescription.trim()) return;

    const newTicket: TcTicket = {
      id: `TC-${Math.floor(10000 + Math.random() * 90000)}`,
      category: tcCategory,
      orderId: tcOrderId.trim() || undefined,
      description: tcDescription.trim(),
      createdAt: 'Just now',
      status: 'IN_REVIEW',
      slaMinutes: 15
    };

    const nextTickets = [newTicket, ...tickets];
    setTickets(nextTickets);
    try {
      localStorage.setItem('safeship_tc_tickets', JSON.stringify(nextTickets));
    } catch {}

    setTicketCreatedSuccess(newTicket);
    setTcDescription('');
    setTcOrderId('');
  };

  return (
    <>
      {/* Floating Trigger Button (Mobile + Desktop) */}
      {!isOpen && (
        <button
          id="btn-open-support"
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 w-11 h-11 md:w-auto md:h-auto p-0 md:px-4 md:py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-lg shadow-[#0066FF]/30 flex items-center justify-center md:gap-2.5 transition active:scale-95 group cursor-pointer border-2 border-white"
          aria-label="Open SafeShip Customer Support & Ticket Center"
        >
          <Headphones className="w-4.5 h-4.5 text-white" />
          <span className="hidden md:inline text-xs font-bold tracking-tight">Support &amp; TC Desk</span>
        </button>
      )}

      {/* Slide-over Support Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[420px] max-h-[78vh] sm:max-h-[85vh] h-[550px] sm:h-[570px] bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
          
          {/* Drawer Header */}
          <div className="bg-[#0066FF] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                  <span>Customer Support &amp; Help Desk</span>
                </h3>
                <p className="text-[10px] text-blue-100 font-medium">
                  24/7 Live Assistance &bull; 15-Min Ticket SLA
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-close-support"
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
                aria-label="Close Support Desk"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar: Help Chat vs Ticket Center (TC) */}
          <div className="bg-slate-100 p-1 flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('CHAT')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'CHAT'
                  ? 'bg-white text-[#0066FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Customer Support</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TICKETS')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'TICKETS'
                  ? 'bg-white text-[#0066FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ticket Center (TC)</span>
              {tickets.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0066FF] text-[10px] font-bold">
                  {tickets.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: AI SUPPORT CHAT */}
          {activeTab === 'CHAT' && (
            <>
              {/* Institutional Trust Banner */}
              <div className="px-3.5 py-1 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between text-[10px] text-[#0066FF] font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Doorstep Unboxing &bull; 100% Escrow Protection</span>
                </span>
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[9px] font-bold">ONLINE</span>
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

                      {/* Inline Action for Dispute / TC creation */}
                      {m.isAction && m.actionType === 'RAISE_TC' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setTcDescription(m.text);
                              setActiveTab('TICKETS');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#0052FF] text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Create Official Dispute Ticket (TC) &rarr;</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-[#94A3B8] px-1 mt-0.5">{m.time}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#0066FF] font-semibold p-2">
                    <Headphones className="w-3.5 h-3.5 animate-pulse" />
                    <span>Support Desk is typing...</span>
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
                  placeholder="Ask customer support about shipments, inspection, tickets..."
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
            </>
          )}

          {/* TAB 2: TICKET CENTER (TC) */}
          {activeTab === 'TICKETS' && (
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
              
              {/* Ticket Created Confirmation Alert */}
              {ticketCreatedSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Ticket #{ticketCreatedSuccess.id} Generated</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketCreatedSuccess(null)}
                      className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your issue has been assigned to Senior Arbitrator Desk with a <strong>15-minute SLA</strong>. You will receive real-time SMS/WhatsApp updates.
                  </p>
                </div>
              )}

              {/* Raise New TC Form */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0066FF]" />
                    <span>Raise Support Ticket (TC)</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    15-Min SLA
                  </span>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Issue Category:
                    </label>
                    <select
                      value={tcCategory}
                      onChange={(e) => setTcCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-hidden focus:border-[#0066FF]"
                    >
                      <option value="Doorstep Inspection Dispute">Doorstep Inspection Dispute</option>
                      <option value="IMEI / Serial Number Mismatch">IMEI / Serial Number Mismatch</option>
                      <option value="Courier Handshake Delay">Courier Handshake Delay</option>
                      <option value="Escrow Settlement / Refund">Escrow Settlement / Refund</option>
                      <option value="Tamper Bag Seal Breach">Tamper Bag Seal Breach</option>
                      <option value="General Customer Care">General Customer Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Consignment ID (Optional):
                    </label>
                    <input
                      type="text"
                      value={tcOrderId}
                      onChange={(e) => setTcOrderId(e.target.value)}
                      placeholder="e.g. SS48291"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Describe the Issue:
                    </label>
                    <textarea
                      rows={2}
                      value={tcDescription}
                      onChange={(e) => setTcDescription(e.target.value)}
                      placeholder="Explain what happened at doorstep or with transaction..."
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!tcDescription.trim()}
                    className="w-full py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    <span>Submit Ticket to Arbitration Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Existing Active TC Tickets List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
                  <span>Your Support Cases ({tickets.length})</span>
                  <span className="text-[10px] text-slate-500 font-medium">Auto-Synced</span>
                </div>

                {tickets.map((tc) => (
                  <div key={tc.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-900">{tc.id}</span>
                        {tc.orderId && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {tc.orderId}
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tc.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tc.status === 'RESOLVED' ? 'RESOLVED ✓' : 'ACTIVE IN REVIEW'}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-800">
                      {tc.category}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {tc.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA: {tc.slaMinutes} min response</span>
                      </span>
                      <span>{tc.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}
    </>
  );
}
