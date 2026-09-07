import type {
  AdminUser,
  Project,
  ProjectInput,
  Technology,
  TechnologyInput,
} from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "petra_admin_token";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function handleUnauthorized(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("petra:unauthorized"));
  }
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) {
    throw new ApiError("Email atau password salah.", 401);
  }
  if (!res.ok) {
    throw new ApiError("Gagal terhubung ke server.", res.status);
  }
  return (await res.json()) as LoginResponse;
}

interface AuthedRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token: string;
  body?: unknown;
}

async function authedRequest<T>(
  path: string,
  { method = "GET", token, body }: AuthedRequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new ApiError("Sesi berakhir. Silakan login ulang.", 401);
  }
  if (!res.ok) {
    let message = `Request gagal (${res.status}).`;
    try {
      const data = (await res.json()) as {
        error?: string;
        details?: unknown;
      };
      if (data?.error === "Validation error") {
        message = "Data tidak valid, cek kembali form.";
      } else if (data?.error) {
        message = data.error;
      }
    } catch {
      // ignore body parse failures
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function getTechnologies(token: string): Promise<Technology[]> {
  return authedRequest<Technology[]>("/api/technologies", { token });
}

export function createTechnology(
  token: string,
  body: TechnologyInput,
): Promise<Technology> {
  return authedRequest<Technology>("/api/technologies", {
    method: "POST",
    token,
    body,
  });
}

export function updateTechnology(
  token: string,
  id: string,
  body: Partial<TechnologyInput>,
): Promise<Technology> {
  return authedRequest<Technology>(`/api/technologies/${id}`, {
    method: "PUT",
    token,
    body,
  });
}

export function deleteTechnology(token: string, id: string): Promise<void> {
  return authedRequest<void>(`/api/technologies/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getProjects(token: string): Promise<Project[]> {
  return authedRequest<Project[]>("/api/projects", { token });
}

export function createProject(
  token: string,
  body: ProjectInput,
): Promise<Project> {
  return authedRequest<Project>("/api/projects", {
    method: "POST",
    token,
    body,
  });
}

export function updateProject(
  token: string,
  id: string,
  body: Partial<ProjectInput>,
): Promise<Project> {
  return authedRequest<Project>(`/api/projects/${id}`, {
    method: "PUT",
    token,
    body,
  });
}

export function deleteProject(token: string, id: string): Promise<void> {
  return authedRequest<void>(`/api/projects/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function uploadImage(
  token: string,
  file: File,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    // Jangan set Content-Type manual — browser yang set boundary multipart-nya.
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) {
    throw new ApiError("Sesi berakhir. Silakan login ulang.", 401);
  }
  if (!res.ok) {
    let message = "Upload gagal.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore body parse failures
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as { url: string };
}