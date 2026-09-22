/**
 * Cashfree Payments PG v3 Server Client for SafeShip India
 * API Documentation: https://docs.cashfree.com/reference/pg-new-apis-endpoint
 */

const CASHFREE_API_VERSION = '2023-08-01';

export function getCashfreeBaseUrl(): string {
  const env = process.env.CASHFREE_ENV || 'production';
  return env === 'sandbox'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';
}

export function getCashfreeHeaders(): Record<string, string> {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials missing: CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set in environment variables.');
  }

  return {
    'Content-Type': 'application/json',
    'x-client-id': appId,
    'x-client-secret': secretKey,
    'x-api-version': CASHFREE_API_VERSION,
  };
}

export interface CreateCashfreeOrderParams {
  orderId?: string;
  orderAmount: number;
  orderCurrency?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone: string;
  returnUrl?: string;
  orderNote?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED';
  payment_session_id: string;
  order_expiry_time?: string;
}

/**
 * Create a new Payment Order on Cashfree and receive payment_session_id
 */
export async function createCashfreeOrder(params: CreateCashfreeOrderParams): Promise<CashfreeOrderResponse> {
  const baseUrl = getCashfreeBaseUrl();
  const headers = getCashfreeHeaders();

  // Generate safe order ID if not provided (alphanumeric, max 45 chars)
  const orderId = params.orderId || `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanPhone = params.customerPhone.replace(/\D/g, '').slice(-10);

  const payload = {
    order_id: orderId,
    order_amount: Number(params.orderAmount.toFixed(2)),
    order_currency: params.orderCurrency || 'INR',
    customer_details: {
      customer_id: params.customerId || `cust_${cleanPhone}`,
      customer_name: params.customerName || 'SafeShip Customer',
      customer_email: params.customerEmail || 'support@safeship.online',
      customer_phone: cleanPhone.length === 10 ? cleanPhone : '9999999999',
    },
    order_meta: {
      return_url: params.returnUrl || `https://safeship.online/checkout?order_id={order_id}`,
    },
    order_note: params.orderNote || 'SafeShip Open-Box Escrow Payment',
  };

  const res = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.message || data.error || 'Failed to create Cashfree order';
    throw new Error(`Cashfree Error (${res.status}): ${errorMsg}`);
  }

  return data as CashfreeOrderResponse;
}

/**
 * Fetch Order details from Cashfree to check real-time status
 */
export async function getCashfreeOrder(orderId: string): Promise<any> {
  const baseUrl = getCashfreeBaseUrl();
  const headers = getCashfreeHeaders();

  const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch Cashfree order ${orderId}`);
  }

  return data;
}

/**
 * Fetch payment attempts for an Order (UPI, Cards, NetBanking details)
 */
export async function getCashfreeOrderPayments(orderId: string): Promise<any[]> {
  const baseUrl = getCashfreeBaseUrl();
  const headers = getCashfreeHeaders();

  const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch payments for order ${orderId}`);
  }

  return Array.isArray(data) ? data : [];
}
