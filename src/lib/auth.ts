// Lightweight client-side auth backed by localStorage.
// This is a front-end demo layer (no real backend / no hashing) — it mirrors how
// the app already persists small pieces of state (e.g. the active page).

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

const USERS_KEY = "nexus.users";
const SESSION_KEY = "nexus.currentUser";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function signup(name: string, email: string, password: string): AuthUser {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const stored: StoredUser = { name: name.trim(), email: normalizedEmail, password };
  writeUsers([...users, stored]);

  const session: AuthUser = { name: stored.name, email: stored.email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function login(email: string, password: string): AuthUser {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const found = users.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!found) {
    throw new Error("Invalid email or password.");
  }

  const session: AuthUser = { name: found.name, email: found.email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
