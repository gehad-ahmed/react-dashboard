const BASE = "http://localhost:3001";

// In production (e.g. GitHub Pages) there is no json-server backend running, so
// the app runs against an in-memory store seeded from a bundled db.json. This
// keeps the deployed demo fully interactive — create / edit / delete all work for
// the session and reset on refresh. During local development it talks to the real
// json-server on :3001 exactly as before.
const DEMO = import.meta.env.PROD;

type Row = Record<string, unknown>;
type Store = Record<string, Row[]>;

let store: Store | null = null;
let storePromise: Promise<Store> | null = null;

async function demoData(): Promise<Store> {
  if (store) return store;
  if (!storePromise) {
    storePromise = fetch(`${import.meta.env.BASE_URL}db.json`)
      .then((r) => r.json())
      // clone so in-session edits never mutate the seed data
      .then((data: Store) => (store = JSON.parse(JSON.stringify(data)) as Store));
  }
  return storePromise;
}

function newId(): string {
  return Math.random().toString(36).slice(2, 8);
}

// Low-level fetch wrapper: turns network failures and non-2xx responses into
// Error objects with a *useful* message (status + body), instead of a silent throw.
async function request(url: string, init?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Cannot reach the server at ${url}. Make sure json-server is running (npm run server on :3001). [${reason}]`
    );
  }
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      /* ignore body read errors */
    }
    throw new Error(
      `${init?.method ?? "GET"} ${url} failed: ${res.status} ${res.statusText}${
        body ? ` — ${body.slice(0, 200)}` : ""
      }`
    );
  }
  return res;
}

const jsonHeaders = { "Content-Type": "application/json" };

export async function getAll<T>(resource: string): Promise<T[]> {
  if (DEMO) {
    const db = await demoData();
    return (db[resource] ?? []) as T[];
  }
  const res = await request(`${BASE}/${resource}`);
  return (await res.json()) as T[];
}

export async function getOne<T>(resource: string, id: string): Promise<T> {
  if (DEMO) {
    const db = await demoData();
    const found = (db[resource] ?? []).find((r) => String(r.id) === String(id));
    if (!found) throw new Error(`${resource}/${id} not found`);
    return found as T;
  }
  const res = await request(`${BASE}/${resource}/${id}`);
  return (await res.json()) as T;
}

export async function create<T>(
  resource: string,
  body: Partial<T> | Omit<T, "id">
): Promise<T> {
  if (DEMO) {
    const db = await demoData();
    const row: Row = { ...(body as Row) };
    if (row.id == null) row.id = newId();
    (db[resource] ??= []).push(row);
    return row as T;
  }
  const res = await request(`${BASE}/${resource}`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

// Full-object replacement via PUT (matches the app's edit forms, which always
// carry every field). PUT is the most broadly-supported write verb in json-server.
export async function update<T>(
  resource: string,
  id: string,
  body: Partial<T>
): Promise<T> {
  if (DEMO) {
    const db = await demoData();
    const list = (db[resource] ??= []);
    const idx = list.findIndex((r) => String(r.id) === String(id));
    const existing = idx >= 0 ? list[idx] : undefined;
    const merged: Row = { ...existing, ...(body as Row), id };
    if (idx >= 0) list[idx] = merged;
    else list.push(merged);
    return merged as T;
  }
  const res = await request(`${BASE}/${resource}/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export async function remove(resource: string, id: string): Promise<void> {
  if (DEMO) {
    const db = await demoData();
    if (db[resource]) db[resource] = db[resource].filter((r) => String(r.id) !== String(id));
    return;
  }
  await request(`${BASE}/${resource}/${id}`, { method: "DELETE" });
}
