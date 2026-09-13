import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Server-side Razorpay SDK instance.
 * Credentials are read strictly from process.env on the server.
 * KEY_SECRET is NEVER exposed to client-side bundles.
 */

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing in environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)');
  }

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
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) {
    throw new Error('RAZORPAY_KEY_SECRET missing for signature verification');
  }

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
