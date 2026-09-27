import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'server-only';

/**
 * Server-side Razorpay SDK instance.
 * Credentials are read strictly from process.env on the server.
 * KEY_SECRET is NEVER exposed to client-side bundles.
 */

function getRazorpayCredentials() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured.');
  }

  return { key_id, key_secret };
}

export function getRazorpayClient(): Razorpay {
  const { key_id, key_secret } = getRazorpayCredentials();

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verify payment signature using HMAC SHA-256
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  razorpaySignature: string
): boolean {
  const { key_secret } = getRazorpayCredentials();

  if (!orderId || !paymentId || !razorpaySignature) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(payload)
    .digest('hex');

  // Use crypto.timingSafeEqual to prevent timing attacks
  try {
    const a = Buffer.from(generatedSignature);
    const b = Buffer.from(razorpaySignature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return generatedSignature === razorpaySignature;
  }
}
