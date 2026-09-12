# SafeShip India (`safeship-india`) 🇮🇳

> **Zero-Scam Peer-to-Peer Escrow & Doorstep Courier Verification Platform for India.**  
> Built for transactions originating on OLX, Facebook Marketplace, Quikr, and Reddit r/IndianGaming.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Razorpay API](https://img.shields.io/badge/Razorpay-Payment%20Links%20API-0c2340?style=flat-square)](https://razorpay.com/)

---

## ⚡ Problem & SafeShip Solution

| The OLX / Marketplace Problem in India | The SafeShip Solution |
| :--- | :--- |
| **Buyer Risk**: Pays advance via UPI/GPay and seller blocks them without sending the device. | **RBI Nodal Escrow**: Buyer's money is locked in a secure trustee escrow via UPI or Razorpay Payment Links (`https://rzp.io`). |
| **Seller Risk**: Ships product via regular courier; buyer claims box had a brick or soap. | **Doorstep Courier Inspection**: Porter/Shadowfax rider verifies power-on, serial number match, and cosmetic condition at pickup. |
| **Transit Tampering**: Delivery agents swapping electronics inside transit hubs. | **Serialized Tamper-Evident Bag**: Sealed with unique holographic barcode seal (`SSP-BLR-8842-TAMPER-SAFE`). |
| **Unfair Courier Costs**: One party bears ₹200+ delivery charges. | **Automatic 50/50 Split**: SafeShip splits courier fee evenly between buyer and seller down to the exact rupee. |
| **Payout Friction**: Payouts taking days or lost in disputes. | **Dual Milestone Payout**: 30% advance released to seller UPI on pickup; remaining 70% released immediately upon buyer 6-digit OTP handshake. |

---

## 📱 Features

- **Mobile-First Consumer Experience**: Native mobile bottom sheet checkouts, thumb-friendly sticky action bars (`pb-safe`), and zero horizontal overflow.
- **Razorpay Payment Links (`https://rzp.io`)**: Creates live or sandbox payment links with SMS/WhatsApp notifications and automated webhook triggers.
- **Indian Postal PIN Code Intelligence**: Automatic city & state detection from 6-digit Indian PIN codes with support for all Indian states.
- **Interactive Multi-Role Switcher**: Test flows as **Buyer**, **Seller**, **Courier Rider**, or **Escrow Ops Admin** with 1 click.
- **High-Trust Monochrome Aesthetic**: Minimalist Cred/Apple/Stripe typography, hairline borders, and pure white/zinc surfaces.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/safeship-india.git
cd safeship-india
npm install
```

### 2. Configure Environment Variables (Razorpay API)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Razorpay credentials from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys):
```env
RAZORPAY_KEY_ID=rzp_test_YourKeyHere
RAZORPAY_KEY_SECRET=YourSecretHere
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If left empty, SafeShip runs in intelligent sandbox simulation mode).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (Free Domain)

Deploying to Vercel takes under 60 seconds and gives you a free production domain like `https://safeship-india.vercel.app`:

### Option A: Via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete SafeShip India escrow & delivery platform"
   git remote add origin https://github.com/<your-username>/safeship-india.git
   git push -u origin master
   ```
2. Open [vercel.com/new](https://vercel.com/new) and select your `safeship-india` repository.
3. In **Environment Variables**, add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Click **Deploy**. Vercel will build and assign `https://safeship-india.vercel.app`.

### Option B: Via Vercel CLI
```bash
npx vercel
```

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16.3.5 (App Router, Turbopack, Standalone/Node Server)
- **UI & Styling**: React 19, Tailwind CSS v4, Heroicons/Custom SVG primitives
- **Payments**: Razorpay Payment Links API (`/api/razorpay/create-link`), UPI Intent (GPay, PhonePe, Paytm, CRED)
- **Logistics Integration**: Porter / Shadowfax 2-wheeler inspection manifest model
- **Address & Geocoding**: Smart 6-digit Indian PIN Code directory (`src/lib/indianAddresses.ts`)

---

## 📄 License
MIT License. Open for peer-to-peer commerce development.
