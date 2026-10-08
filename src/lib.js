export function randomId(prefix = 'id') {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

export function toBase64(bytes) {
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(bin);
}

export function fromBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return bytes;
}

export async function hashPassword(password, saltBytes = crypto.getRandomValues(new Uint8Array(16))) {
  const saltHex = Array.from(saltBytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hashBuffer = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBytes,
    iterations: 120000,
    hash: 'SHA-256'
  }, keyMaterial, 256);
  const hashBytes = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashBytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return { saltHex, hashHex };
}

export async function verifyPassword(password, saltHex, storedHashHex) {
  const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map((pair) => Number.parseInt(pair, 16)));
  const { hashHex } = await hashPassword(password, saltBytes);
  return hashHex === storedHashHex;
}

export function sanitizeUsername(value = '') {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '').slice(0, 32);
}

export function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

export function normalizeDisplayName(value = '') {
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 48) || 'User';
}

export function createBearerToken(userId) {
  return `linkchat_${userId}_${randomId('tok')}`;
}

export function buildResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  });
}

export function parseJsonBody(request) {
  return request.json().catch(() => ({}));
}
