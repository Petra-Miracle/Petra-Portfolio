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

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  order: number;
}

export interface CertificateInput {
  title: string;
  issuer: string;
  year?: number | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order?: number;
}

export interface GalleryItem {
  id: string;
  caption: string;
  imageUrl: string;
  year: number | null;
  order: number;
}

export interface GalleryItemInput {
  caption: string;
  imageUrl: string;
  year?: number | null;
  order?: number;
}

export interface AdminUser {
  id: string;
  email: string;
}

export interface SiteSettings {
  cvUrl: string | null;
}
