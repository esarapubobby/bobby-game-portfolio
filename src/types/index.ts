export type ProjectStatus = 'Completed' | 'In Development' | 'Published' | 'Prototype';

export interface ProjectMedia {
  id: string;
  projectId: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
  coverImage: string;
  screenshots: string[];
  gameplayVideoUrl?: string; // YouTube or direct video embed
  demoUrl?: string;
  googlePlayUrl?: string;
  itchUrl?: string;
  githubUrl?: string;
  technologies: string[];
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategory {
  id: string;
  name: string; // e.g. "Game Development", "Programming", "Tools", "Core Concepts"
  description?: string;
  skills: SkillItem[];
  sortOrder: number;
}

export interface SkillItem {
  id: string;
  name: string;
  iconName?: string;
  highlight?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
  sortOrder: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  location: string;
  details?: string;
  sortOrder: number;
}

export interface SiteSettings {
  id?: string;
  heroName: string;
  heroTitle: string;
  heroQuote: string;
  heroAvailabilityText: string;
  aboutBioP1: string;
  aboutBioP2: string;
  aboutLocation: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  itchUrl?: string;
  resumeUrl: string;
  accentColor: 'lime' | 'emerald' | 'cyan' | 'amber' | 'violet';
  showAvailability: boolean;
  footerText: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  createdAt?: string;
}
