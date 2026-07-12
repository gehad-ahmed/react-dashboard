const BASE = "http://localhost:3001";

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
  const res = await request(`${BASE}/${resource}`);
  return (await res.json()) as T[];
}

export async function getOne<T>(resource: string, id: string): Promise<T> {
  const res = await request(`${BASE}/${resource}/${id}`);
  return (await res.json()) as T;
}

export async function create<T>(
  resource: string,
  body: Partial<T> | Omit<T, "id">
): Promise<T> {
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
  const res = await request(`${BASE}/${resource}/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

export async function remove(resource: string, id: string): Promise<void> {
  await request(`${BASE}/${resource}/${id}`, { method: "DELETE" });
}
