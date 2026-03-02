const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface ListResponse<T> {
  data: T[];
  meta: ListMeta;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, json?.error?.message ?? "Request failed");
  }

  return json as T;
}

// Single-item requests — unwraps { data: T }
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const json = await fetchJson<{ data: T }>(path, init);
  return json.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  // Paginated list — returns { data: T[], meta }
  list: <T>(path: string) => fetchJson<ListResponse<T>>(path),
};
