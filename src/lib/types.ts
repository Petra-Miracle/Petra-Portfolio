export type TechnologyCategory = "GENERAL" | "AI";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  icon: string | null;
  order: number;
}

export interface TechnologyInput {
  name: string;
  category: TechnologyCategory;
  icon?: string | null;
  order?: number;
}

export type ProjectType = "PROJECT" | "COMPETITION";

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  result: string | null;
  year: number | null;
  order: number;
}

export interface ProjectInput {
  title: string;
  description: string;
  type: ProjectType;
  techStack: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  imageUrl?: string | null;
  result?: string | null;
  year?: number | null;
  order?: number;
}

export interface AdminUser {
  id: string;
  email: string;
}
