import { SafeDeal } from './types';

export type EmailEvent =
  | 'WELCOME'
  | 'BOOKING_CONFIRMED'
  | 'COURIER_ASSIGNED'
  | 'PICKUP_VERIFIED'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'DISPUTED';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://safeship.online';

function getBaseEmailLayout(title: string, preheader: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; margin-top: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0066FF 0%, #0047BA 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .content { padding: 32px 24px; }
    .card { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin: 20px 0; }
    .code-box { background: #ECFDF5; border: 2px dashed #10B981; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
    .code-text { font-family: monospace; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #065F46; }
    .btn { display: inline-block; background-color: #0066FF; color: #FFFFFF !important; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; margin-top: 16px; text-align: center; }
    .footer { background-color: #F1F5F9; padding: 24px; text-align: center; font-size: 11px; color: #64748B; line-height: 1.6; border-top: 1px solid #E2E8F0; }
    .badge { display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.2); color: #FFFFFF; }
    .highlight-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    .highlight-table td { padding: 8px 0; border-bottom: 1px solid #E2E8F0; }
    .highlight-table td.label { color: #64748B; width: 40%; }
    .highlight-table td.val { font-weight: 600; color: #0F172A; text-align: right; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="container">
    <div class="header">
      <div class="badge">Open-Box Doorstep Verification Active</div>
      <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">SafeShip India</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">India's Safest Verified Shipping &amp; Escrow Platform</p>
    </div>

    <div class="content">
      ${contentHtml}
    </div>

    <div class="footer">
      <p style="margin: 0 0 8px 0;"><strong>SafeShip Logistics &amp; Security Services Private Limited</strong></p>
      <p style="margin: 0 0 8px 0;">
        All consignments protected under RBI Section 10A nodal escrow governance &bull; ₹10,00,000 Transit cargo insurance underwritten by ICICI Lombard General Insurance Co. Ltd.
      </p>
      <p style="margin: 0;">
        Need assistance? 24/7 Custody Helpdesk: <strong>080-4719-2300</strong> &bull; Email: <a href="mailto:support@safeship.online" style="color: #0066FF; text-decoration: none;">support@safeship.online</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates an email for the seller when a booking is confirmed.
 */
export function renderBookingConfirmedSellerEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const slotText = deal.pickupSlot === 'MORNING_10_1' ? 'Morning 10:00 AM – 01:00 PM' : 'Afternoon 02:00 PM – 05:00 PM';
  const upfrontAmt = deal.upfrontPaid || deal.upfrontPricing?.totalUpfront || 0;

  const subject = `Booking Confirmed: Consignment #${deal.id} (${deal.title}) Queued for Pickup`;
  const preheader = `Your pickup is scheduled for ${slotText}. Bonded officer Rahul K. assigned.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 0;">
      Consignment Booked &amp; Pickup Queued
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello <strong>${deal.seller.name}</strong>, your SafeShip delivery request for <strong>"${deal.title}"</strong> has been confirmed and locked into our logistics dispatch queue.
    </p>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Consignment Details</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Consignment ID</td>
          <td class="val">#${deal.id}</td>
        </tr>
        <tr>
          <td class="label">Item &amp; Declared Value</td>
          <td class="val">${deal.title} (₹${deal.declaredValue.toLocaleString('en-IN')})</td>
        </tr>
        <tr>
          <td class="label">Pickup Window</td>
          <td class="val" style="color: #0066FF;">${slotText}</td>
        </tr>
        <tr>
          <td class="label">Pickup Address</td>
          <td class="val">${deal.seller.pickupAddress} (${deal.city || deal.pincode})</td>
        </tr>
        <tr>
          <td class="label">Delivery Destination</td>
          <td class="val">${deal.buyer.name} &bull; ${deal.buyer.city || deal.buyer.pincode}</td>
        </tr>
        <tr>
          <td class="label">Upfront Fee Paid</td>
          <td class="val" style="color: #10B981;">₹${upfrontAmt} Secured</td>
        </tr>
      </table>
    </div>

    <div style="background: #EFF6FF; border-left: 4px solid #0066FF; padding: 14px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #1E40AF; line-height: 1.5;">
      <strong>Pickup Preparation Checklist:</strong><br>
      1. Keep the device powered on (at least 30% battery) for the quick physical audit.<br>
      2. SafeShip Field Officer <strong>Rahul K.</strong> will arrive with tamper-evident security bag <strong>SSP-TAMPER-SAFE</strong>.<br>
      3. Share your 4-digit pickup code only after the officer verifies condition and seals the parcel.
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">View Live Tracking &amp; Custody Telemetry &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email for the buyer when a booking is confirmed.
 */
export function renderBookingConfirmedBuyerEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const subject = `Order #${deal.id} Confirmed: 10-Minute Doorstep Open-Box Inspection Active`;
  const preheader = `You pay ₹0 product cost upfront. Inspect item condition before paying.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 0;">
      Your Shipment is Scheduled &bull; 100% Escrow Protected
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello <strong>${deal.buyer.name}</strong>, seller <strong>${deal.seller.name}</strong> has dispatched your order for <strong>"${deal.title}"</strong> via SafeShip Open-Box Verified Delivery.
    </p>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Protection Summary</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Order ID</td>
          <td class="val">#${deal.id}</td>
        </tr>
        <tr>
          <td class="label">Product</td>
          <td class="val">${deal.title}</td>
        </tr>
        <tr>
          <td class="label">Amount Payable upon Unboxing</td>
          <td class="val" style="color: #0066FF; font-size: 16px;">₹${deal.declaredValue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Estimated Delivery</td>
          <td class="val">${deal.estimatedDeliveryDate || '2-3 Business Days'}</td>
        </tr>
        <tr>
          <td class="label">Doorstep Inspection Window</td>
          <td class="val" style="color: #10B981;">10 Minutes (Guaranteed)</td>
        </tr>
      </table>
    </div>

    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; color: #166534; line-height: 1.5;">
      <strong>The SafeShip "Verify Then Pay" Promise:</strong><br>
      You do not pay the seller before opening the box. The courier will unbox the device in front of you. You test the hardware, screen, and serial number for 10 minutes. If satisfied, pay securely via dynamic UPI QR code or enter your Delivery PIN. If unsatisfied, reject instantly for <strong>₹0 product charge</strong>.
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">Track Consignment Live &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email when the courier officer is dispatched for pickup (includes Seller 4-digit code).
 */
export function renderCourierDispatchedEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const courierName = deal.assignedCourier?.name || 'Rahul K.';
  const vehicle = deal.assignedCourier?.vehicleModel || 'Bajaj Pulsar 150';
  const plate = deal.assignedCourier?.plateNumber || 'KA 03 HY 4012';
  const pickupCode = deal.sellerPickupCode || '8492';

  const subject = `Field Officer Dispatched for Pickup: Consignment #${deal.id} (Code: ${pickupCode})`;
  const preheader = `Field Officer ${courierName} is en route. Your 4-digit pickup verification code is ${pickupCode}.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 0;">
      Field Custody Officer En Route
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      SafeShip Bonded Field Officer <strong>${courierName}</strong> (${vehicle}, <strong>${plate}</strong>) has been dispatched to your pickup address.
    </p>

    <div class="code-box">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #065F46; margin-bottom: 4px;">
        1. Your 4-Digit Seller Pickup Verification Code
      </div>
      <div class="code-text">${pickupCode}</div>
      <div style="font-size: 12px; color: #047857; margin-top: 6px;">
        Share this code with officer <strong>${courierName}</strong> ONLY after the physical audit is complete and the item is sealed into tamper bag.
      </div>
    </div>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Pickup Overview</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Assigned Officer</td>
          <td class="val">${courierName} (${vehicle})</td>
        </tr>
        <tr>
          <td class="label">Pickup Location</td>
          <td class="val">${deal.seller.pickupAddress}</td>
        </tr>
        <tr>
          <td class="label">Declared Item</td>
          <td class="val">${deal.title}</td>
        </tr>
        <tr>
          <td class="label">Security Bag</td>
          <td class="val" style="color: #0066FF;">SSP-${deal.id}-TAMPER-SAFE</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">View Live Courier Location on Map &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email when pickup is verified & tamper bag sealed.
 */
export function renderPickupVerifiedEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const sealId = deal.tamperSeal?.sealId || `SSP-${deal.id}-TAMPER-SAFE`;
  const insurancePolicy = deal.insurancePolicyNumber || 'POL-ICICI-LOMBARD-2026';

  const subject = `Pickup Verified & Sealed in Security Bag #${sealId}: Consignment #${deal.id}`;
  const preheader = `Condition verified, barcode sealed, and ICICI Lombard transit insurance activated.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 0;">
      Hardware Inspected &amp; Chain-of-Custody Sealed
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      SafeShip field officers have physically inspected <strong>"${deal.title}"</strong>, matched cosmetic parameters, and sealed the consignment inside heavy-gauge tamper-proof pouch <strong>${sealId}</strong>.
    </p>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Custody &amp; Transit Status</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Security Tamper Seal</td>
          <td class="val" style="color: #0066FF; font-family: monospace;">${sealId}</td>
        </tr>
        <tr>
          <td class="label">Transit Insurance</td>
          <td class="val" style="color: #10B981;">₹${deal.declaredValue.toLocaleString('en-IN')} (ICICI Lombard Active)</td>
        </tr>
        <tr>
          <td class="label">Policy Number</td>
          <td class="val" style="font-family: monospace;">${insurancePolicy}</td>
        </tr>
        <tr>
          <td class="label">Corridor Telemetry</td>
          <td class="val">${deal.routeCorridor || 'National Express Highway Transit'}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">Monitor Linehaul Transit Corridor &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email when the shipment is out for delivery (includes Buyer 6-digit release PIN).
 */
export function renderOutForDeliveryBuyerEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const releasePin = deal.buyerReleasePin || '482910';

  const subject = `Out for Delivery: Order #${deal.id} — Your 6-Digit Delivery PIN is ${releasePin}`;
  const preheader = `Your parcel is arriving today. Take 10 minutes to unbox and test before releasing payment.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 0;">
      Your Shipment is Out for Doorstep Delivery Today
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello <strong>${deal.buyer.name}</strong>, SafeShip custody officer is delivering <strong>"${deal.title}"</strong> to your address today.
    </p>

    <div class="code-box">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #065F46; margin-bottom: 4px;">
        2. Your 6-Digit Buyer Delivery Release PIN
      </div>
      <div class="code-text">${releasePin}</div>
      <div style="font-size: 12px; color: #047857; margin-top: 6px;">
        Give this PIN to the delivery officer strictly <strong>AFTER</strong> you unbox, power on, and inspect your item.
      </div>
    </div>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Delivery Details</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Delivery Address</td>
          <td class="val">${deal.buyer.deliveryAddress}</td>
        </tr>
        <tr>
          <td class="label">Amount Payable</td>
          <td class="val" style="color: #0066FF; font-size: 16px;">₹${deal.declaredValue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Payment Options</td>
          <td class="val">Dynamic UPI QR Code / Doorstep PIN</td>
        </tr>
        <tr>
          <td class="label">Inspection Window</td>
          <td class="val" style="color: #10B981;">10 Minutes at Doorstep</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">Track Courier Live on Map &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email when the delivery is successfully completed & verified.
 */
export function renderCompletedSellerEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const utr = deal.escrowVault?.utrNumber || `UTR-RZP-${Date.now().toString(36).toUpperCase()}`;

  const subject = `Deal #${deal.id} Completed: ₹${deal.declaredValue.toLocaleString('en-IN')} Escrow Payout Released`;
  const preheader = `The buyer inspected and approved "${deal.title}". Funds disbursed to your UPI ID.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #10B981; font-size: 28px; line-height: 56px; margin: 0 auto 12px auto;">✓</div>
      <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0;">
        Doorstep Inspection Approved &bull; Payout Released
      </h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello <strong>${deal.seller.name}</strong>, buyer <strong>${deal.buyer.name}</strong> has completed the 10-minute doorstep unboxing inspection and approved <strong>"${deal.title}"</strong>.
    </p>

    <div class="card" style="background: #F0FDF4; border-color: #BBF7D0;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #166534;">Payout Settlement Summary</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Disbursed Amount</td>
          <td class="val" style="color: #166534; font-size: 18px; font-weight: 900;">₹${deal.declaredValue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Settlement UTR Reference</td>
          <td class="val" style="font-family: monospace;">${utr}</td>
        </tr>
        <tr>
          <td class="label">Target UPI ID</td>
          <td class="val" style="font-family: monospace;">${deal.seller.upiId || 'Direct Bank Settlement'}</td>
        </tr>
        <tr>
          <td class="label">Settlement Timestamp</td>
          <td class="val">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">View Completed Deal &amp; Tax Invoice &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates an email for the buyer when the order is completed.
 */
export function renderCompletedBuyerEmail(deal: SafeDeal): { subject: string; html: string } {
  const trackUrl = `${APP_URL}/in/track/${deal.id}`;
  const invoiceNumber = deal.billingInfo?.invoiceNumber || `INV-2026-SS-${deal.id.toUpperCase()}`;

  const subject = `Delivery Confirmed: Order #${deal.id} (${deal.title}) — Tax Invoice & Receipt`;
  const preheader = `Thank you for using SafeShip Open-Box Delivery. Your official tax invoice is ready.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #10B981; font-size: 28px; line-height: 56px; margin: 0 auto 12px auto;">✓</div>
      <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0;">
        Doorstep Unboxing &amp; Delivery Verified
      </h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Hello <strong>${deal.buyer.name}</strong>, your delivery of <strong>"${deal.title}"</strong> has been successfully verified and completed under the SafeShip custody handshake.
    </p>

    <div class="card">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0F172A;">Transaction Receipt</h3>
      <table class="highlight-table">
        <tr>
          <td class="label">Order ID</td>
          <td class="val">#${deal.id}</td>
        </tr>
        <tr>
          <td class="label">Official Tax Invoice</td>
          <td class="val" style="color: #0066FF; font-family: monospace;">${invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">Merchandise Settled</td>
          <td class="val">₹${deal.declaredValue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td class="label">Delivery Security</td>
          <td class="val" style="color: #10B981;">10-Min Doorstep Audit Passed</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackUrl}" class="btn">Download Tax Invoice &amp; AWB Note &rarr;</a>
    </div>
    `
  );

  return { subject, html };
}

/**
 * Generates a warm welcome email for a new member upon registration.
 */
export function renderWelcomeUserEmail(name: string, email: string): { subject: string; html: string } {
  const newDealUrl = `${APP_URL}/in/deals/new`;
  const openBoxUrl = `${APP_URL}/in/open-box`;
  const firstName = name.trim().split(' ')[0] || 'Friend';

  const subject = `Welcome to SafeShip India, ${firstName}! Flat ₹99 Off Your First Shipment 🎉`;
  const preheader = `Your account is active. Enjoy flat ₹99 off your first order automatically applied + 10-minute doorstep open-box inspection.`;

  const html = getBaseEmailLayout(
    subject,
    preheader,
    `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; padding: 6px 14px; background: #EFF6FF; color: #0066FF; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        ✦ Account Activated &bull; Flat ₹99 First-Order Discount ✦
      </span>
      <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 14px 0 8px 0; letter-spacing: -0.5px;">
        Welcome to SafeShip, ${firstName}!
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; max-width: 480px; margin: 0 auto;">
        You've joined India's #1 verified open-box delivery &amp; escrow platform. Say goodbye to courier fraud, transit damage, and counterfeit electronics.
      </p>
    </div>

    <!-- Automatic First-Order Perk Card -->
    <div class="code-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: 2px dashed #0066FF; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0066FF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
        Automatic First-Order Perk
      </div>
      <div class="code-text" style="color: #0066FF; font-size: 28px; font-weight: 900; letter-spacing: 1px;">
        FLAT ₹99 OFF
      </div>
      <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 600; color: #1E40AF;">
        ✓ Automatically applied to your first consignment checkout &bull; No coupon code needed
      </p>
    </div>

    <!-- 4 SafeShip Core Guarantees -->
    <div class="card" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">
        How SafeShip Protects Every Deal
      </h3>
      
      <div style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 3px;">
          📦 1. 10-Minute Doorstep Open-Box Inspection
        </div>
        <div style="font-size: 12px; color: #64748B; line-height: 1.5;">
          The recipient has 10 minutes to unbox the parcel, test screen integrity, verify IMEI/serial numbers, and confirm authenticity before paying.
        </div>
      </div>

      <div style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 3px;">
          🛡️ 2. RBI Section 10A Nodal Escrow
        </div>
        <div style="font-size: 12px; color: #64748B; line-height: 1.5;">
          Buyer funds remain safely in an ICICI Bank Nodal Escrow vault. Money is released to the seller only after open-box approval.
        </div>
      </div>

      <div style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 3px;">
          🔒 3. Tamper-Evident Security Seals
        </div>
        <div style="font-size: 12px; color: #64748B; line-height: 1.5;">
          Every package is sealed inside an irreversible serial-tracked tamper pouch (SSP-TAMPER-SAFE) with holographic chain of custody.
        </div>
      </div>

      <div>
        <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 3px;">
          🚚 4. ₹10 Lakh Cargo Insurance
        </div>
        <div style="font-size: 12px; color: #64748B; line-height: 1.5;">
          Underwritten by ICICI Lombard General Insurance Co. Ltd. Full replacement coverage during road and air transit.
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="${newDealUrl}" class="btn" style="background-color: #0066FF; color: #FFFFFF; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; display: inline-block;">
        Book Your First Shipment with ₹99 Off &rarr;
      </a>
    </div>

    <div style="text-align: center; margin-bottom: 8px;">
      <a href="${openBoxUrl}" style="color: #0066FF; font-size: 12px; font-weight: 600; text-decoration: none;">
        Learn how 10-Minute Doorstep Unboxing works &rarr;
      </a>
    </div>
    `
  );

  return { subject, html };
}

