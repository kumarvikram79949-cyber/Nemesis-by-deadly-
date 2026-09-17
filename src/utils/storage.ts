import { LicenseKey, PaymentRequest, PlanOption, UserSession } from '../types';

export const UPI_ID = 'vikram.09@fam';
export const DEVELOPER_NAME = 'DEADLY';
export const TELEGRAM_USERNAME = '@Deadlypred9';
export const TELEGRAM_LINK = 'https://t.me/Deadlypred9';
export const ADMIN_KEY = 'DEADLY IS KIND';

export const PLANS: PlanOption[] = [
  { id: '1h', label: '1 Hour Trial', durationLabel: '1 Hour', durationMs: 60 * 60 * 1000, price: 49 },
  { id: '1d', label: '1 Day Pass', durationLabel: '1 Day', durationMs: 24 * 60 * 60 * 1000, price: 99 },
  { id: '2d', label: '2 Days Pass', durationLabel: '2 Days', durationMs: 2 * 24 * 60 * 60 * 1000, price: 149 },
  { id: '3d', label: '3 Days VIP', durationLabel: '3 Days', durationMs: 3 * 24 * 60 * 60 * 1000, price: 199 },
  { id: '7d', label: '7 Days Ultra VIP', durationLabel: '7 Days', durationMs: 7 * 24 * 60 * 60 * 1000, price: 399, recommended: true },
  { id: '10d', label: '10 Days Pro', durationLabel: '10 Days', durationMs: 10 * 24 * 60 * 60 * 1000, price: 499 },
  { id: '1m', label: '1 Month Master', durationLabel: '1 Month', durationMs: 30 * 24 * 60 * 60 * 1000, price: 799 },
  { id: 'unlimited', label: 'Lifetime Unlimited', durationLabel: 'Unlimited', durationMs: null, price: 1499 },
];

const INITIAL_KEYS: LicenseKey[] = [
  {
    key: 'DEADLY IS KIND',
    durationLabel: 'Unlimited Admin',
    durationMs: null,
    createdAt: Date.now() - 1000000,
    expiresAt: null,
    assignedTo: 'DEADLY (Owner)',
    status: 'active',
    createdBy: 'SYSTEM',
  },
  {
    key: 'NEMESIS-PREMIUM-LIFETIME',
    durationLabel: 'Unlimited Lifetime',
    durationMs: null,
    createdAt: Date.now() - 500000,
    expiresAt: null,
    status: 'active',
    createdBy: 'DEADLY',
  },
  {
    key: 'DEADLY-PRO-7DAYS',
    durationLabel: '7 Days VIP',
    durationMs: 7 * 24 * 60 * 60 * 1000,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    status: 'active',
    createdBy: 'DEADLY',
  },
  {
    key: 'DEADLY-VIP-DEMO',
    durationLabel: '1 Day Pass',
    durationMs: 24 * 60 * 60 * 1000,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    status: 'active',
    createdBy: 'DEADLY',
  },
];

export function getStoredKeys(): LicenseKey[] {
  try {
    const raw = localStorage.getItem('nemesis_keys');
    if (!raw) {
      localStorage.setItem('nemesis_keys', JSON.stringify(INITIAL_KEYS));
      return INITIAL_KEYS;
    }
    const parsed = JSON.parse(raw);
    // Ensure admin key always exists
    if (!parsed.some((k: LicenseKey) => k.key.trim().toUpperCase() === ADMIN_KEY)) {
      parsed.unshift(INITIAL_KEYS[0]);
      localStorage.setItem('nemesis_keys', JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_KEYS;
  }
}

export function saveStoredKeys(keys: LicenseKey[]): void {
  try {
    localStorage.setItem('nemesis_keys', JSON.stringify(keys));
  } catch {
    // ignore
  }
}

export function generateCryptoKey(prefix = 'DEADLY-NEM'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment1 = '';
  let segment2 = '';
  for (let i = 0; i < 4; i++) {
    segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${segment1}-${segment2}`;
}

export function addLicenseKey(
  durationLabel: string,
  durationMs: number | null,
  assignedTo?: string
): LicenseKey {
  const newKey: LicenseKey = {
    key: generateCryptoKey(),
    durationLabel,
    durationMs,
    createdAt: Date.now(),
    expiresAt: durationMs ? Date.now() + durationMs : null,
    assignedTo,
    status: 'active',
    createdBy: DEVELOPER_NAME,
  };

  const keys = getStoredKeys();
  keys.unshift(newKey);
  saveStoredKeys(keys);
  return newKey;
}

export function revokeLicenseKey(keyString: string): boolean {
  const keys = getStoredKeys();
  const target = keys.find((k) => k.key.toUpperCase() === keyString.toUpperCase());
  if (target && target.key !== ADMIN_KEY) {
    target.status = 'revoked';
    saveStoredKeys(keys);
    return true;
  }
  return false;
}

export function deleteLicenseKey(keyString: string): boolean {
  let keys = getStoredKeys();
  if (keyString.trim().toUpperCase() === ADMIN_KEY.trim().toUpperCase()) return false;
  keys = keys.filter((k) => k.key.trim().toUpperCase() !== keyString.trim().toUpperCase());
  saveStoredKeys(keys);
  return true;
}

export function deletePaymentRequest(requestId: string): boolean {
  let requests = getPaymentRequests();
  requests = requests.filter((r) => r.id !== requestId);
  savePaymentRequests(requests);
  return true;
}

// User Session
export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem('nemesis_session');
    if (!raw) return null;
    const session: UserSession = JSON.parse(raw);
    // Check expiration if not unlimited
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem('nemesis_session');
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem('nemesis_session', JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem('nemesis_session');
  } catch {
    // ignore
  }
}

// Payment Requests
export function getPaymentRequests(): PaymentRequest[] {
  try {
    const raw = localStorage.getItem('nemesis_payments');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePaymentRequests(requests: PaymentRequest[]): void {
  try {
    localStorage.setItem('nemesis_payments', JSON.stringify(requests));
  } catch {
    // ignore
  }
}

export function submitPaymentRequest(
  userName: string,
  plan: PlanOption,
  utr: string,
  telegramHandle?: string
): PaymentRequest {
  const newReq: PaymentRequest = {
    id: 'REQ-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    userName,
    planName: plan.label,
    durationLabel: plan.durationLabel,
    amount: plan.price,
    utr,
    telegramHandle,
    status: 'pending',
    timestamp: Date.now(),
  };

  const requests = getPaymentRequests();
  requests.unshift(newReq);
  savePaymentRequests(requests);
  return newReq;
}
