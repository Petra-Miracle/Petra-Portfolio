import type { Project, ProjectType, Technology } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function get<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`GET ${path} failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchTechnologies(): Promise<Technology[]> {
  try {
    const data = await get<Technology[]>("/api/technologies");
    return Array.isArray(data)
      ? data.sort(
          (a, b) => a.order - b.order || a.name.localeCompare(b.name),
        )
      : [];
  } catch {
    return [];
  }
}

export async function fetchProjects(
  type?: ProjectType,
): Promise<Project[]> {
  try {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    const data = await get<Project[]>(`/api/projects${query}`);
    return Array.isArray(data)
      ? data.sort(
          (a, b) =>
            a.order - b.order || (b.year ?? 0) - (a.year ?? 0),
        )
      : [];
  } catch {
    return [];
  }
}

export async function fetchAllProjects(): Promise<{
  projects: Project[];
  competitions: Project[];
}> {
  const [projects, competitions] = await Promise.all([
    fetchProjects("PROJECT"),
    fetchProjects("COMPETITION"),
  ]);
  return { projects, competitions };
}
