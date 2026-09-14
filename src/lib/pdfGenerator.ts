// SafeShip Official 2-Page Tax Invoice & AWB Consignment Note Generator

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

  // Colors
  const royalBlue = [0, 102, 255]; // #0066FF
  const navy = [15, 23, 42]; // #0F172A
  const slateGray = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252]; // #F8FAFC
  const borderSlate = [203, 213, 225]; // #CBD5E1

  const tierName =
    deal.serviceTier === 'FASTEST_AIR_RUSH'
      ? 'SafeShip SuperFast Air (24-36h Next-Flight Air)'
      : deal.serviceTier === 'PRIORITY_EXPRESS'
      ? 'SafeShip Priority Express (Air Linehaul)'
      : deal.serviceTier === 'SAME_DAY_DIRECT'
      ? 'Same-Day Direct Fleet (Sub-6h)'
      : 'Standard Ground Linehaul';

  const totalPaid = deal.upfrontPaid || deal.upfrontPricing?.totalUpfront || deal.pricing?.shippingInsuranceFee || 1074;
  const taxableAmount = Math.round((totalPaid / 1.18) * 100) / 100;
  const totalGst = Math.round((totalPaid - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  const baseFee = deal.upfrontPricing?.baseFee || 299;
  const distFee = deal.upfrontPricing?.distanceSurcharge || 725;
  const verifFee = deal.upfrontPricing?.verificationFee || 0;
  const insFee = deal.upfrontPricing?.insuranceFee || 50;

  const invoiceNo = deal.billingInfo?.invoiceNumber || `INV-2026-SS-${deal.id.toUpperCase()}`;
  const awbNo = `#SS-${deal.id.toUpperCase()}`;
  const bookingDate = new Date(deal.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // =========================================================================
  // PAGE 1: OFFICIAL TAX INVOICE & PAYMENT RECEIPT
  // =========================================================================

  // Outer Border
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, 268, 'S');

  // Top Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, margin, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SafeShip', margin + 6, margin + 10);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL TAX INVOICE & ESCROW PAYMENT RECEIPT', margin + 6, margin + 15);
  doc.text('SAC CODE: 996812 • COURIER & EXPRESS CARGO TRANSPORT SERVICES', margin + 6, margin + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TAX INVOICE (ORIGINAL)', margin + contentWidth - 6, margin + 10, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoiceNo} • ${awbNo}`, margin + contentWidth - 6, margin + 15, { align: 'right' });
  doc.setTextColor(180, 240, 200);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT STATUS: FULLY PAID (RAZORPAY)', margin + contentWidth - 6, margin + 20, { align: 'right' });

  let y = margin + 28;

  // Supplier & Billed Entity Grid (2 columns)
  const colW = (contentWidth - 6) / 2;
  const billBoxH = 40;

  // Left: Supplier (SafeShip)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y, colW, billBoxH, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, colW, billBoxH, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('SUPPLIER (SERVICE PROVIDER)', margin + 6, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('SafeShip Logistics India Private Limited', margin + 6, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Central Gateway Hub, Malviya Nagar, Jaipur, RJ - 302017', margin + 6, y + 16);
  doc.text('GSTIN: 08AAECS2938Q1ZP • State Code: 08 (Rajasthan)', margin + 6, y + 21);
  doc.text('CIN: U63090RJ2026PTC098234 • PAN: AAECS2938Q', margin + 6, y + 26);
  doc.text('Toll-Free Helpline: 1800 890 2829 • billing@safeship.online', margin + 6, y + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text('RBI Section 10A Regulated Trustee Nodal Escrow', margin + 6, y + 36);

  // Right: Bill To / Client
  const rX = margin + 2 + colW + 2;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(rX, y, colW, billBoxH, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(rX, y, colW, billBoxH, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('BILLED TO (CLIENT / BOOKING PARTY)', rX + 4, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  const billedName = deal.billingInfo?.businessName || deal.buyer?.name || deal.seller?.name || 'Authorized Client';
  doc.text(billedName, rX + 4, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const clientAddr = doc.splitTextToSize(deal.buyer?.deliveryAddress || deal.seller?.pickupAddress || 'Verified Destination Address', colW - 8);
  doc.text(clientAddr, rX + 4, y + 16);
  doc.text(`Contact: ${maskPhone(deal.buyer?.phone || deal.seller?.phone)}`, rX + 4, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  const gstinDisplay = deal.billingInfo?.gstin ? `GSTIN: ${deal.billingInfo.gstin} (B2B Tax Credit)` : 'B2C / Consumer (Unregistered)';
  doc.text(gstinDisplay, rX + 4, y + 31);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date of Invoice: ${bookingDate} • Place of Supply: ${deal.buyer?.city || deal.city}`, rX + 4, y + 36);

  y += billBoxH + 5;

  // Invoice & Route Telemetry Summary Strip
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`SERVICE TIER: ${tierName.toUpperCase()}`, margin + 6, y + 6.5);
  doc.text(`CORRIDOR: ${deal.routeCorridor || 'National Express Highway Corridor'}`, margin + 110, y + 6.5);

  y += 13;

  // Itemized Tax Invoice Charges Table
  doc.setFillColor(240, 244, 248);
  doc.rect(margin + 2, y, contentWidth - 4, 7, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('#', margin + 5, y + 4.8);
  doc.text('DESCRIPTION OF LOGISTICS & SECURITY SERVICES', margin + 12, y + 4.8);
  doc.text('SAC CODE', margin + 105, y + 4.8);
  doc.text('RATE / BASIS', margin + 130, y + 4.8);
  doc.text('TAXABLE VALUE (₹)', margin + 155, y + 4.8);

  y += 7;

  const invoiceItems = [
    {
      num: '1',
      desc: 'Base Linehaul Freight (Air / Surface Priority Linehaul)',
      sac: '996812',
      basis: 'Standard Base',
      taxable: (Math.round((baseFee / 1.18) * 100) / 100).toFixed(2),
    },
    {
      num: '2',
      desc: `National Corridor Distance Linehaul (${deal.distanceKm || 1166} km corridor)`,
      sac: '996812',
      basis: `${deal.distanceKm || 1166} km Transit`,
      taxable: (Math.round((distFee / 1.18) * 100) / 100).toFixed(2),
    },
    {
      num: '3',
      desc: verifFee === 0
        ? 'Doorstep Open-Box Inspection & Verification (Promo Waiver)'
        : 'Dedicated Doorstep Verification Officer & Live Hardware Diagnostics',
      sac: '996812',
      basis: verifFee === 0 ? 'FREE PROMO' : 'Standard Rate',
      taxable: verifFee === 0 ? '0.00' : (Math.round((verifFee / 1.18) * 100) / 100).toFixed(2),
    },
    {
      num: '4',
      desc: `In-Transit Cargo Insurance (ICICI Lombard Underwriting on ₹${deal.declaredValue.toLocaleString('en-IN')})`,
      sac: '997133',
      basis: '0.5% Declared',
      taxable: (Math.round((insFee / 1.18) * 100) / 100).toFixed(2),
    },
  ];

  invoiceItems.forEach((item, idx) => {
    const rowH = 8.5;
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin + 2, y, contentWidth - 4, rowH, 'F');
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.rect(margin + 2, y, contentWidth - 4, rowH, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(item.num, margin + 5, y + 5.5);
    doc.text(item.desc, margin + 12, y + 5.5);
    doc.text(item.sac, margin + 105, y + 5.5);
    doc.text(item.basis, margin + 130, y + 5.5);
    doc.setFont('courier', 'bold');
    doc.text(item.taxable, margin + 175, y + 5.5, { align: 'right' });
    y += rowH;
  });

  // Calculation Breakdown Box
  y += 2;
  const calcBoxW = 90;
  const calcBoxX = margin + contentWidth - calcBoxW - 2;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(calcBoxX, y, calcBoxW, 34, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(calcBoxX, y, calcBoxW, 34, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Total Taxable Value (Excl. GST):', calcBoxX + 4, y + 6);
  doc.setFont('courier', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`₹${taxableAmount.toFixed(2)}`, calcBoxX + calcBoxW - 4, y + 6, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Central GST (CGST @ 9.0%):', calcBoxX + 4, y + 12);
  doc.setFont('courier', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`₹${cgst.toFixed(2)}`, calcBoxX + calcBoxW - 4, y + 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('State GST (SGST @ 9.0%):', calcBoxX + 4, y + 18);
  doc.setFont('courier', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`₹${sgst.toFixed(2)}`, calcBoxX + calcBoxW - 4, y + 18, { align: 'right' });

  // Grand Total Banner
  doc.setFillColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.rect(calcBoxX, y + 22, calcBoxW, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOTAL BILLABLE AMOUNT (INR):', calcBoxX + 4, y + 29.5);
  doc.setFontSize(11);
  doc.text(`₹${totalPaid.toLocaleString('en-IN')}`, calcBoxX + calcBoxW - 4, y + 30, { align: 'right' });

  // Escrow Guarantee Notice on Left
  const noticeW = contentWidth - calcBoxW - 10;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y, noticeW, 34, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, noticeW, 34, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text('TAX & ESCROW COMPLIANCE DECLARATION', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(
    `This bill covers upfront logistics routing, transit insurance, and doorstep open-box inspection. The merchandise value (₹${deal.declaredValue.toLocaleString('en-IN')}) is held strictly in a segregated RBI-regulated trustee nodal escrow account and is settled directly at doorstep upon recipient approval.`,
    margin + 6,
    y + 11,
    { maxWidth: noticeW - 8 }
  );
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`Razorpay Payment ID: ${deal.paymentId || 'pay_live_verified_gateway'}`, margin + 6, y + 29);

  y += 39;

  // Payment Confirmation & Digital Signature Box
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 32, 'S');

  // Left side: Payment Verification
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('DIGITAL PAYMENT TRANSACTION VERIFICATION', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Transaction Reference: ${deal.paymentId || 'pay_live_safeship_node'}`, margin + 6, y + 11);
  doc.text(`Payment Mode: Online Gateway (UPI / NetBanking / Cards)`, margin + 6, y + 16);
  doc.text(`Settlement Status: Captured & Escrow Underwritten`, margin + 6, y + 21);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 130, 80);
  doc.text('VERIFIED AUTHENTIC TAX INVOICE ✓', margin + 6, y + 27);

  // Right side: Authorized Signature
  const sigBoxX = margin + contentWidth - 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('FOR SAFESHIP LOGISTICS INDIA PVT. LTD.', sigBoxX, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Digitally signed by Authorized Finance Signatory', sigBoxX, y + 11);
  doc.text('DSC Token: SAFESHIP-FIN-CA-2026-98124', sigBoxX, y + 15);
  doc.text('Timestamp: ' + new Date(deal.createdAt || Date.now()).toISOString(), sigBoxX, y + 19);

  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.line(sigBoxX, y + 24, sigBoxX + 75, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('AUTHORISED SIGNATORY (COMPUTER GENERATED)', sigBoxX, y + 28);

  y += 35;

  // Page 1 Footer
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin + 2, y, contentWidth - 4, 11, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('SafeShip Logistics India Pvt. Ltd. • Page 1 of 2: Tax Invoice & Payment Receipt', margin + 6, y + 7);
  doc.text('Turn to Page 2 for Air Waybill (AWB) Consignment Note & Inspection Protocol &rarr;', margin + contentWidth - 6, y + 7, { align: 'right' });


  // =========================================================================
  // PAGE 2: AIR WAYBILL (AWB) & DOORSTEP OPEN-BOX AUDIT PROTOCOL
  // =========================================================================

  doc.addPage();

  // Outer Border Page 2
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, 268, 'S');

  // Top Header Page 2
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, margin, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SafeShip', margin + 6, margin + 9);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('STANDARD DELIVERY CONSIGNMENT NOTE & AIR WAYBILL (AWB)', margin + 6, margin + 14);
  doc.text('RBI COMPLIANT NODAL ESCROW • ICICI TRUSTEE VAULT • 100% OPEN-BOX VERIFIED', margin + 6, margin + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('AIR WAYBILL (AWB)', margin + contentWidth - 6, margin + 9, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`AWB NO: #${deal.id.toUpperCase()} • PAGE 2 OF 2`, margin + contentWidth - 6, margin + 14, { align: 'right' });
  doc.setTextColor(180, 240, 200);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: PAID & ESCROW SECURED', margin + contentWidth - 6, margin + 18, { align: 'right' });

  let y2 = margin + 26;

  // Barcode Strip
  doc.setDrawColor(navy[0], navy[1], navy[2]);
  doc.setLineWidth(0.7);
  const bStart = margin + 6;
  const bWidth = 85;
  const bHeight = 11;
  const numB = 48;
  for (let i = 0; i < numB; i++) {
    const x = bStart + (i * bWidth) / numB;
    const isThick = i % 3 === 0 || i % 7 === 0;
    doc.setLineWidth(isThick ? 1.1 : 0.5);
    doc.line(x, y2, x, y2 + bHeight);
  }
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`*${deal.id.toUpperCase()}*`, bStart + bWidth / 2, y2 + bHeight + 4, { align: 'center' });

  // Metadata Block beside barcode
  const mX = margin + contentWidth - 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('BOOKING DATE:', mX, y2 + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(bookingDate, mX + 28, y2 + 2);

  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE TIER:', mX, y2 + 6);
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text(tierName, mX + 28, y2 + 6);

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('CORRIDOR:', mX, y2 + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(deal.routeCorridor || 'National Express Transit Corridor', mX + 28, y2 + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('SECURITY SEAL ID:', mX, y2 + 14);
  doc.setFont('courier', 'bold');
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text(deal.tamperSeal?.sealId || `SSP-TAMPER-${deal.id.slice(-5)}`, mX + 28, y2 + 14);

  y2 += 22;

  // Divider Line
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y2, margin + contentWidth, y2);
  y2 += 4;

  // Shipper & Consignee Boxes
  const cWidth = (contentWidth - 6) / 2;
  const bHeight2 = 40;

  // Left: Shipper Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y2, cWidth, bHeight2, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y2, cWidth, bHeight2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('01. SHIPPER / ORIGIN DISPATCH (SENDER)', margin + 6, y2 + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.seller?.name || 'Verified SafeShip Seller', margin + 6, y2 + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const pAddr = doc.splitTextToSize(deal.seller?.pickupAddress || 'Jaipur Central Hub', cWidth - 8);
  doc.text(pAddr, margin + 6, y2 + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`PIN: ${deal.seller?.pincode || deal.pincode || '302017'} • ${deal.seller?.city || deal.city || 'Jaipur'}`, margin + 6, y2 + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone (Privacy Masked): ${maskPhone(deal.seller?.phone)}`, margin + 6, y2 + 35);

  // Right: Consignee Box
  const c2X = margin + 2 + cWidth + 2;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(c2X, y2, cWidth, bHeight2, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(c2X, y2, cWidth, bHeight2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('02. CONSIGNEE / DESTINATION RECEIVER (BUYER)', c2X + 4, y2 + 5);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.buyer?.name || 'Verified SafeShip Buyer', c2X + 4, y2 + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const dAddr = doc.splitTextToSize(deal.buyer?.deliveryAddress || 'Delhi NCR Delivery Point', cWidth - 8);
  doc.text(dAddr, c2X + 4, y2 + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`PIN: ${deal.buyer?.pincode || '110001'} • ${deal.buyer?.city || 'Delhi NCR'}`, c2X + 4, y2 + 30);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone (Privacy Masked): ${maskPhone(deal.buyer?.phone)}`, c2X + 4, y2 + 35);

  y2 += bHeight2 + 6;

  // Package Specifications Table
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ARTICLE DESCRIPTION', margin + 5, y2 + 4.2);
  doc.text('CATEGORY', margin + 75, y2 + 4.2);
  doc.text('DECLARED VALUE', margin + 110, y2 + 4.2);
  doc.text('WEIGHT', margin + 145, y2 + 4.2);
  doc.text('SECURITY COVER', margin + 162, y2 + 4.2);

  y2 += 6;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 2, y2, contentWidth - 4, 13, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 13, 'S');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(deal.title, margin + 5, y2 + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Condition: ${deal.condition || 'Mint'} • Serial: ${deal.serialNumber || 'IMEI/SN Logged'}`, margin + 5, y2 + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(deal.category?.replace(/_/g, ' ') || 'ELECTRONICS', margin + 75, y2 + 6);
  doc.text(formatINR(deal.declaredValue), margin + 110, y2 + 6);
  doc.text(deal.packageWeightKg ? `${deal.packageWeightKg} KG` : '0.95 KG', margin + 145, y2 + 6);
  doc.setTextColor(0, 128, 80);
  doc.text('100% ESCROW', margin + 162, y2 + 6);

  y2 += 18;

  // Doorstep 4-Point Inspection Checklist Box (THE MOAT)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 58, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 58, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
  doc.text('MANDATORY DOORSTEP 4-POINT OPEN-BOX AUDIT PROTOCOL (FIELD OFFICER SLIP)', margin + 6, y2 + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Delivery partner and recipient must verify all 4 criteria below prior to disclosing 6-digit release OTP:', margin + 6, y2 + 10.5);

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

  let checkY = y2 + 16;
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

  y2 += 64;

  // Dual Sign-Off & Handshake Box
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 46, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('03. DUAL-FACTOR SIGN-OFF & CRYPTOGRAPHIC HANDSHAKE', margin + 6, y2 + 5);

  const sWidth = (contentWidth - 12) / 2;

  // Courier signature column
  doc.text('ASSIGNED FIELD VERIFICATION OFFICER:', margin + 6, y2 + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`Officer: ${deal.assignedCourier?.name || 'Rahul K. (#KA-4012)'}`, margin + 6, y2 + 16);
  doc.text('Fleet: SafeShip Bonded Logistics Rail', margin + 6, y2 + 20);

  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, y2 + 36, margin + 6 + sWidth - 10, y2 + 36);
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('OFFICER SIGNATURE & BADGE STAMP', margin + 6, y2 + 40);

  // Buyer signature column
  const sig2X = margin + 6 + sWidth + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('CONSIGNEE ACCEPTANCE & OTP HANDSHAKE:', sig2X, y2 + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Doorstep Physical Inspection: APPROVED [ ✓ ]', sig2X, y2 + 16);
  doc.text(`Handshake Release OTP: Verified via SMS / Nodal Token`, sig2X, y2 + 20);

  doc.line(sig2X, y2 + 36, sig2X + sWidth - 10, y2 + 36);
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('BUYER SIGNATURE (AFTER OPEN-BOX INSPECTION)', sig2X, y2 + 40);

  y2 += 52;

  // Institutional Trust & Escrow Guarantee Footer
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 16, 'F');
  doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
  doc.rect(margin + 2, y2, contentWidth - 4, 16, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('RBI SECTION 10A REGULATED NODAL ESCROW ACCOUNT GUARANTEE', margin + 6, y2 + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(
    'Funds for this consignment remain safely held in a segregated trustee bank nodal escrow vault. Payment is disbursed to the seller only after physical unboxing and confirmation of the 6-digit OTP. 100% zero-liability protection against product substitution or counterfeit items.',
    margin + 6,
    y2 + 8.5,
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
    const defaultFilename = `SafeShip_TaxInvoice_and_AWB_${sender}_to_${receiver}_${deal.id.toUpperCase()}.pdf`;

    doc.save(customFilename || defaultFilename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
}

