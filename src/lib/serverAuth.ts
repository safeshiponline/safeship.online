import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  salt?: string;
  avatarUrl?: string;
  provider: 'google' | 'credentials';
  createdAt: string;
  kycVerified: boolean;
  memberCode: string;
}

export interface AuthSessionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  provider: 'google' | 'credentials';
  createdAt: string;
  kycVerified: boolean;
  memberCode: string;
}

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.RAZORPAY_KEY_SECRET || 'safeship_auth_jwt_supersecret_2026';
const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// In-memory cache to guarantee ultra-fast response and serverless tolerance
let usersCache: Record<string, ServerUser> | null = null;

/**
 * Generate a random 16-byte hex salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Cryptographically hash password using PBKDF2 with SHA-512 (OWASP recommended)
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Verify password against stored hash & salt using constant-time comparison
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = hashPassword(password, salt);
    const a = Buffer.from(testHash, 'hex');
    const b = Buffer.from(hash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Create a signed, tamper-proof session JWT token using HMAC-SHA256
 */
export function createSessionToken(user: ServerUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      provider: user.provider,
      memberCode: user.memberCode,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30-day session
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode session JWT token
 */
export function verifySessionToken(token: string): AuthSessionData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const expectedSig = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    const user = findUserById(decoded.sub);
    if (user) {
      return sanitizeUser(user);
    }

    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(decoded.name)}&backgroundColor=0066FF&textColor=FFFFFF`,
      provider: decoded.provider || 'credentials',
      createdAt: new Date(decoded.iat * 1000).toISOString(),
      kycVerified: true,
      memberCode: decoded.memberCode || `USR-${decoded.sub.slice(-4).toUpperCase()}`
    };
  } catch (e) {
    return null;
  }
}

/**
 * Remove sensitive credentials before returning to clients
 */
export function sanitizeUser(user: ServerUser): AuthSessionData {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl:
      user.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=0066FF&textColor=FFFFFF`,
    provider: user.provider,
    createdAt: user.createdAt,
    kycVerified: user.kycVerified,
    memberCode: user.memberCode
  };
}

/**
 * Load users from disk / memory
 */
function loadUsers(): Record<string, ServerUser> {
  if (usersCache) return usersCache;

  let loaded: Record<string, ServerUser> = {};

  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
      loaded = JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read users.json, initializing defaults:', e);
  }

  // Pre-seed demo / founder account if empty
  const defaultEmail = 'aman.sharma@gmail.com';
  if (!loaded[defaultEmail]) {
    const salt = generateSalt();
    const hash = hashPassword('Password123!', salt);
    loaded[defaultEmail] = {
      id: 'usr_founder_01',
      name: 'Aman Sharma',
      email: defaultEmail,
      phone: '+91 98290 12345',
      passwordHash: hash,
      salt: salt,
      provider: 'credentials',
      createdAt: '2026-01-15T10:00:00.000Z',
      kycVerified: true,
      memberCode: 'USR-8901'
    };
  }

  const demoEmail = 'user.safeship@gmail.com';
  if (!loaded[demoEmail]) {
    const salt = generateSalt();
    const hash = hashPassword('SafeShip2026!', salt);
    loaded[demoEmail] = {
      id: 'usr_trader_02',
      name: 'SafeShip Trader',
      email: demoEmail,
      phone: '+91 98290 55555',
      passwordHash: hash,
      salt: salt,
      provider: 'credentials',
      createdAt: '2026-02-01T12:00:00.000Z',
      kycVerified: true,
      memberCode: 'USR-2940'
    };
  }

  usersCache = loaded;
  return usersCache;
}

/**
 * Persist users to disk and memory
 */
function persistUsers(users: Record<string, ServerUser>) {
  usersCache = users;
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write users.json to disk (filesystem may be read-only):', e);
  }
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): ServerUser | null {
  const users = loadUsers();
  const normalized = email.toLowerCase().trim();
  return users[normalized] || null;
}

/**
 * Find user by ID
 */
export function findUserById(id: string): ServerUser | null {
  const users = loadUsers();
  for (const user of Object.values(users)) {
    if (user.id === id) return user;
  }
  return null;
}

/**
 * Register a new user with credentials
 */
export function registerUserServer(params: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  provider?: 'credentials' | 'google';
}): ServerUser {
  const users = loadUsers();
  const normalizedEmail = params.email.toLowerCase().trim();

  if (users[normalizedEmail]) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  let passwordHash: string | undefined;
  let salt: string | undefined;

  if (params.password) {
    salt = generateSalt();
    passwordHash = hashPassword(params.password, salt);
  }

  const memberCode = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser: ServerUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: params.name.trim(),
    email: normalizedEmail,
    phone: params.phone?.trim(),
    passwordHash,
    salt,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(params.name)}&backgroundColor=0066FF&textColor=FFFFFF`,
    provider: params.provider || 'credentials',
    createdAt: new Date().toISOString(),
    kycVerified: true,
    memberCode
  };

  users[normalizedEmail] = newUser;
  persistUsers(users);
  return newUser;
}

/**
 * Upsert or sign in a Google authenticated user
 */
export function authenticateGoogleUser(email: string, name?: string): ServerUser {
  const users = loadUsers();
  const normalizedEmail = email.toLowerCase().trim();

  let existing = users[normalizedEmail];
  if (existing) {
    if (name && (!existing.name || existing.name === existing.email)) {
      existing.name = name;
      persistUsers(users);
    }
    return existing;
  }

  // Register brand-new Google user
  const effectiveName = name?.trim() || normalizedEmail.split('@')[0];
  const memberCode = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser: ServerUser = {
    id: `usr_g_${Date.now().toString(36)}`,
    name: effectiveName,
    email: normalizedEmail,
    provider: 'google',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(effectiveName)}&backgroundColor=0066FF&textColor=FFFFFF`,
    createdAt: new Date().toISOString(),
    kycVerified: true,
    memberCode
  };

  users[normalizedEmail] = newUser;
  persistUsers(users);
  return newUser;
}
