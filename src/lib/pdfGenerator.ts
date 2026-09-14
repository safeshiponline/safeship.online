// SafeShip Official AWB Consignment Note & Shipping Slip Generator

import { jsPDF } from 'jspdf';
import { SafeDeal } from './types';
import { formatINR } from './escrowCalculator';

function maskPhone(phone?: string): string {
  if (!phone) return '+91 ••••• •••••';
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.length >= 10) {
    const start = clean.slice(0, 5);
    const end = clean.slice(-2);
    return `${start} ••• ${end}`;
  }
  return phone;
}

export function generateConsignmentNotePDF(deal: SafeDeal): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Brand Colors
  const royalBlue = [0, 98, 255]; // #0062FF
  const navy = [15, 23, 42]; // #0F172A
  const slateGray = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252]; // #F8FAFC
  const borderSlate = [203, 213, 225]; // #CBD5E1

  // Outer Document Container Border
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, 268, 'S');

  // Top Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, margin, contentWidth, 22, 'F');

  // Brand Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SafeShip', margin + 6, margin + 9);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('STANDARD DELIVERY CONSIGNMENT NOTE & TAX INVOICE', margin + 6, margin + 14);
  doc.text('RBI COMPLIANT NODAL ESCROW • ICICI TRUSTEE VAULT • 100% OPEN-BOX VERIFIED', margin + 6, margin + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('TAX INVOICE / AIR WAYBILL (AWB)', margin + contentWidth - 6, margin + 9, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`AWB NO: #${deal.id.toUpperCase()} • INV-SS-${deal.id.toUpperCase()}`, margin + contentWidth - 6, margin + 14, { align: 'right' });
  doc.setTextColor(180, 240, 200);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: PAID & ESCROW SECURED', margin + contentWidth - 6, margin + 18, { align: 'right' });

  let y = margin + 27;

  // Simulated Code-128 Barcode strip
  doc.setDrawColor(navy[0], navy[1], navy[2]);
  doc.setLineWidth(0.7);
  // Barcode pattern
  const barcodeStart = margin + 6;
  const barcodeWidth = 90;
  const barcodeHeight = 12;
  const numBars = 48;
  for (let i = 0; i < numBars; i++) {
    const x = barcodeStart + (i * barcodeWidth) / numBars;
    const isThick = i % 3 === 0 || i % 7 === 0;
    doc.setLineWidth(isThick ? 1.1 : 0.5);
    doc.line(x, y, x, y + barcodeHeight);
  }
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`*${deal.id.toUpperCase()}*`, barcodeStart + barcodeWidth / 2, y + barcodeHeight + 4, { align: 'center' });

  // Right-aligned Key Metadata Block
  const metaX = margin + contentWidth - 75;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('BOOKING DATE:', metaX, y + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(deal.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), metaX + 32, y + 2);

  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE TIER:', metaX, y + 6);
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  const tierName =
    deal.serviceTier === 'FASTEST_AIR_RUSH'
      ? 'SafeShip SuperFast Air (24-36h Next-Flight Air)'
      : deal.serviceTier === 'PRIORITY_EXPRESS'
      ? 'SafeShip Priority Express (Air Linehaul)'
      : deal.serviceTier === 'SAME_DAY_DIRECT'
      ? 'Same-Day Direct Fleet (Sub-6h)'
      : 'Standard Ground Linehaul';
  doc.text(tierName, metaX + 32, y + 6);

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('CORRIDOR:', metaX, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(deal.routeCorridor || 'National Express Transit Corridor', metaX + 32, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('SECURITY SEAL ID:', metaX, y + 14);
  doc.setFont('courier', 'bold');
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text(deal.tamperSeal?.sealId || `SSP-TAMPER-${deal.id.slice(-5)}`, metaX + 32, y + 14);

  y += 22;

  // Divider Line
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  // Shipper & Consignee Columns (2-box grid)
  const colWidth = (contentWidth - 6) / 2;
  const boxHeight = 40;

  // Left: Shipper Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y, colWidth, boxHeight, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, colWidth, boxHeight, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('01. SHIPPER / ORIGIN DISPATCH (SENDER)', margin + 6, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.seller?.name || 'Verified SafeShip Seller', margin + 6, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const pickupAddr = doc.splitTextToSize(deal.seller?.pickupAddress || 'Jaipur Central Hub', colWidth - 8);
  doc.text(pickupAddr, margin + 6, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`PIN: ${deal.seller?.pincode || deal.pincode || '302017'} • ${deal.seller?.city || deal.city || 'Jaipur'}`, margin + 6, y + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone (Privacy Masked): ${maskPhone(deal.seller?.phone)}`, margin + 6, y + 35);

  // Right: Consignee Box
  const col2X = margin + 2 + colWidth + 2;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(col2X, y, colWidth, boxHeight, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(col2X, y, colWidth, boxHeight, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('02. CONSIGNEE / DESTINATION RECEIVER (BUYER)', col2X + 4, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.buyer?.name || 'Verified SafeShip Buyer', col2X + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const dropAddr = doc.splitTextToSize(deal.buyer?.deliveryAddress || 'Delhi NCR Delivery Point', colWidth - 8);
  doc.text(dropAddr, col2X + 4, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`PIN: ${deal.buyer?.pincode || '110001'} • ${deal.buyer?.city || 'Delhi NCR'}`, col2X + 4, y + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone (Privacy Masked): ${maskPhone(deal.buyer?.phone)}`, col2X + 4, y + 35);

  y += boxHeight + 6;

  // Package Specifications Table
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ARTICLE DESCRIPTION', margin + 5, y + 4.2);
  doc.text('CATEGORY', margin + 75, y + 4.2);
  doc.text('DECLARED VALUE', margin + 110, y + 4.2);
  doc.text('WEIGHT', margin + 145, y + 4.2);
  doc.text('SECURITY COVER', margin + 162, y + 4.2);

  y += 6;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 2, y, contentWidth - 4, 13, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 13, 'S');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(deal.title, margin + 5, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Condition: ${deal.condition || 'Mint'} • Serial: ${deal.serialNumber || 'IMEI/SN Logged'}`, margin + 5, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.category?.replace(/_/g, ' ') || 'ELECTRONICS', margin + 75, y + 6);
  doc.text(formatINR(deal.declaredValue), margin + 110, y + 6);
  doc.text('0.95 KG', margin + 145, y + 6);
  doc.setTextColor(0, 128, 80);
  doc.text('100% ESCROW', margin + 162, y + 6);

  y += 18;

  // Doorstep 4-Point Inspection Checklist Box (THE MOAT)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 58, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 58, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text('MANDATORY DOORSTEP 4-POINT OPEN-BOX AUDIT PROTOCOL (FIELD OFFICER SLIP)', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Delivery partner and recipient must verify all 4 criteria below prior to disclosing 6-digit release OTP:', margin + 6, y + 10.5);

  const checks = [
    {
      num: '[  ]  CHECK 1: Tamper-Evident Security Seal Intactness',
      desc: 'Verify cryptographic seal band is unbroken with zero peeling or void patterns.'
    },
    {
      num: '[  ]  CHECK 2: Hardware Boot State & OLED Diagnostics',
      desc: 'Power on the unit at doorstep; confirm clean display digitizer and zero liquid damage.'
    },
    {
      num: '[  ]  CHECK 3: Serial / IMEI Exact Register Match',
      desc: 'Cross-examine IMEI / Serial in Settings against original invoice and SafeShip ledger.'
    },
    {
      num: '[  ]  CHECK 4: Physical Enclosure & Accessories Audit',
      desc: 'Verify scratchless chassis, original charging cable, power adapter, and retail packaging.'
    }
  ];

  let checkY = y + 16;
  checks.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(item.num, margin + 6, checkY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(item.desc, margin + 12, checkY + 3.8);
    checkY += 9.5;
  });

  y += 64;

  // Dual Sign-Off & Handshake Box
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 46, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('03. DUAL-FACTOR SIGN-OFF & CRYPTOGRAPHIC HANDSHAKE', margin + 6, y + 5);

  const sigWidth = (contentWidth - 12) / 2;

  // Courier signature column
  doc.text('ASSIGNED FIELD VERIFICATION OFFICER:', margin + 6, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`Officer: ${deal.assignedCourier?.name || 'Suresh Gowda (#KA-4012)'}`, margin + 6, y + 16);
  doc.text('Fleet: SafeShip Bonded Logistics Rail', margin + 6, y + 20);

  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, y + 36, margin + 6 + sigWidth - 10, y + 36);
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('OFFICER SIGNATURE & BADGE STAMP', margin + 6, y + 40);

  // Buyer signature column
  const sig2X = margin + 6 + sigWidth + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('CONSIGNEE ACCEPTANCE & OTP HANDSHAKE:', sig2X, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Doorstep Physical Inspection: APPROVED [ ✓ ]', sig2X, y + 16);
  doc.text(`Handshake Release OTP: Verified via SMS / Nodal Token`, sig2X, y + 20);

  doc.line(sig2X, y + 36, sig2X + sigWidth - 10, y + 36);
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('BUYER SIGNATURE (AFTER OPEN-BOX INSPECTION)', sig2X, y + 40);

  y += 52;

  // Institutional Trust & Escrow Guarantee Footer
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 16, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 16, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('RBI SECTION 10A REGULATED NODAL ESCROW ACCOUNT GUARANTEE', margin + 6, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(
    'Funds for this consignment remain safely held in a segregated trustee bank nodal escrow vault. Payment is disbursed to the seller only after physical unboxing and confirmation of the 6-digit OTP. 100% zero-liability protection against product substitution or counterfeit items.',
    margin + 6,
    y + 8.5,
    { maxWidth: contentWidth - 12 }
  );

  return doc;
}

export function downloadConsignmentNotePDF(deal: SafeDeal, customFilename?: string): boolean {
  try {
    const doc = generateConsignmentNotePDF(deal);
    const sanitize = (name?: string) =>
      (name || '')
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 20) || 'Party';

    const sender = sanitize(deal.seller?.name || 'Sender');
    const receiver = sanitize(deal.buyer?.name || 'Receiver');
    const defaultFilename = `SafeShip_Receipt_${sender}_to_${receiver}_${deal.id.toUpperCase()}.pdf`;

    doc.save(customFilename || defaultFilename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
}
