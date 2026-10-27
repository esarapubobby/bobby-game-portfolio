import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Project,
  SkillCategory,
  ExperienceItem,
  EducationItem,
  SiteSettings,
  ContactMessage,
} from '../types';
import {
  initialProjects,
  initialSkillCategories,
  initialExperience,
  initialEducation,
  initialSiteSettings,
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PortfolioContextType {
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  settings: SiteSettings;
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
  isSupabaseConnected: boolean;
  refreshData: () => Promise<void>;

  // Project Actions
  saveProject: (project: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  duplicateProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleProjectFeatured: (id: string) => Promise<void>;
  toggleProjectPublished: (id: string) => Promise<void>;
  reorderProjects: (orderedIds: string[]) => Promise<void>;

  // Content Actions
  saveSkillCategory: (category: SkillCategory) => Promise<{ success: boolean; error?: string }>;
  deleteSkillCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
  saveSkill: (categoryId: string, skillName: string, highlight?: boolean) => Promise<void>;
  deleteSkill: (categoryId: string, skillId: string) => Promise<void>;

  saveExperience: (item: ExperienceItem) => Promise<{ success: boolean; error?: string }>;
  deleteExperience: (id: string) => Promise<{ success: boolean; error?: string }>;

  saveEducation: (item: EducationItem) => Promise<{ success: boolean; error?: string }>;
  deleteEducation: (id: string) => Promise<{ success: boolean; error?: string }>;

  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;

  // Contact Actions
  submitMessage: (data: { name: string; email: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'bobby_portfolio_projects',
  SKILLS: 'bobby_portfolio_skills',
  EXPERIENCE: 'bobby_portfolio_experience',
  EDUCATION: 'bobby_portfolio_education',
  SETTINGS: 'bobby_portfolio_settings',
  MESSAGES: 'bobby_portfolio_messages',
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [skills, setSkills] = useState<SkillCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return saved ? JSON.parse(saved) : initialSkillCategories;
  });

  const [experience, setExperience] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
    return saved ? JSON.parse(saved) : initialExperience;
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EDUCATION);
    return saved ? JSON.parse(saved) : initialEducation;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Apply theme accent color
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.accentColor || 'lime');
  }, [settings.accentColor]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experience));
  }, [experience]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Fetch data from Supabase if configured
  const refreshData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch projects
      const { data: dbProjects, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projErr) throw projErr;

      if (dbProjects && dbProjects.length > 0) {
        const mapped: Project[] = dbProjects.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          shortDescription: p.short_description,
          detailedDescription: p.detailed_description,
          coverImage: p.cover_image,
          screenshots: p.screenshots || [],
          gameplayVideoUrl: p.gameplay_video_url,
          demoUrl: p.demo_url,
          googlePlayUrl: p.google_play_url,
          itchUrl: p.itch_url,
          githubUrl: p.github_url,
          technologies: p.technologies || [],
          status: p.status,
          featured: p.featured,
          published: p.published,
          sortOrder: p.sort_order,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        setProjects(mapped);
      }

      // Fetch settings
      const { data: dbSettings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (dbSettings) {
        setSettings({
          id: dbSettings.id,
          heroName: dbSettings.hero_name || initialSiteSettings.heroName,
          heroTitle: dbSettings.hero_title || initialSiteSettings.heroTitle,
          heroQuote: dbSettings.hero_quote || initialSiteSettings.heroQuote,
          heroAvailabilityText: dbSettings.hero_availability_text || initialSiteSettings.heroAvailabilityText,
          aboutBioP1: dbSettings.about_bio_p1 || initialSiteSettings.aboutBioP1,
          aboutBioP2: dbSettings.about_bio_p2 || initialSiteSettings.aboutBioP2,
          aboutLocation: dbSettings.about_location || initialSiteSettings.aboutLocation,
          contactEmail: dbSettings.contact_email || initialSiteSettings.contactEmail,
          githubUrl: dbSettings.github_url || initialSiteSettings.githubUrl,
          linkedinUrl: dbSettings.linkedin_url || initialSiteSettings.linkedinUrl,
          itchUrl: dbSettings.itch_url || initialSiteSettings.itchUrl,
          resumeUrl: dbSettings.resume_url || initialSiteSettings.resumeUrl,
          accentColor: (dbSettings.accent_color as any) || initialSiteSettings.accentColor,
          showAvailability: dbSettings.show_availability ?? true,
          footerText: dbSettings.footer_text || initialSiteSettings.footerText,
        });
      }

      // Fetch contact messages (Admin role will succeed via RLS)
      const { data: dbMessages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbMessages) {
        setMessages(
          dbMessages.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            message: m.message,
            read: m.read,
            createdAt: m.created_at,
          }))
        );
      }
    } catch (err: any) {
      console.warn('Supabase sync warning:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Project Actions
  const saveProject = async (projectData: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
      const isNew = !projectData.id || !projects.some((p) => p.id === projectData.id);
      const projectId =
        projectData.id ||
        projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
        `proj-${Date.now()}`;

      const updatedProject: Project = {
        id: projectId,
        title: projectData.title || 'Untitled Project',
        category: projectData.category || 'Game Development',
        shortDescription: projectData.shortDescription || '',
        detailedDescription: projectData.detailedDescription || '',
        coverImage:
          projectData.coverImage ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        screenshots: projectData.screenshots || [],
        gameplayVideoUrl: projectData.gameplayVideoUrl || '',
        demoUrl: projectData.demoUrl || '',
        googlePlayUrl: projectData.googlePlayUrl || '',
        itchUrl: projectData.itchUrl || '',
        githubUrl: projectData.githubUrl || '',
        technologies: projectData.technologies || ['Unity', 'C#'],
        status: projectData.status || 'In Development',
        featured: projectData.featured ?? false,
        published: projectData.published ?? true,
        sortOrder: projectData.sortOrder ?? (isNew ? projects.length + 1 : 1),
        updatedAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const { error: dbErr } = await supabase.from('projects').upsert({
          id: updatedProject.id,
          title: updatedProject.title,
          category: updatedProject.category,
          short_description: updatedProject.shortDescription,
          detailed_description: updatedProject.detailedDescription,
          cover_image: updatedProject.coverImage,
          screenshots: updatedProject.screenshots,
          gameplay_video_url: updatedProject.gameplayVideoUrl,
          demo_url: updatedProject.demoUrl,
          google_play_url: updatedProject.googlePlayUrl,
          itch_url: updatedProject.itchUrl,
          github_url: updatedProject.githubUrl,
          technologies: updatedProject.technologies,
          status: updatedProject.status,
          featured: updatedProject.featured,
          published: updatedProject.published,
          sort_order: updatedProject.sortOrder,
          updated_at: new Date().toISOString(),
        });

        if (dbErr) throw dbErr;
      }

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === projectId);
        if (exists) {
          return prev.map((p) => (p.id === projectId ? updatedProject : p));
        } else {
          return [...prev, updatedProject].sort((a, b) => a.sortOrder - b.sortOrder);
        }
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save project' };
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured) {
        const { error: dbErr } = await supabase.from('projects').delete().eq('id', id);
        if (dbErr) throw dbErr;
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete project' };
    }
  };

  const duplicateProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const existing = projects.find((p) => p.id === id);
    if (!existing) return { success: false, error: 'Project not found' };

    const clone: Project = {
      ...existing,
      id: `${existing.id}-copy-${Date.now().toString().slice(-4)}`,
      title: `${existing.title} (Copy)`,
      published: false,
      sortOrder: projects.length + 1,
      createdAt: new Date().toISOString(),
    };

    return saveProject(clone);
  };

  const toggleProjectFeatured = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    await saveProject({ ...target, featured: !target.featured });
  };

  const toggleProjectPublished = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    await saveProject({ ...target, published: !target.published });
  };

  const reorderProjects = async (orderedIds: string[]) => {
    const updated = [...projects];
    orderedIds.forEach((id, index) => {
      const item = updated.find((p) => p.id === id);
      if (item) item.sortOrder = index + 1;
    });
    updated.sort((a, b) => a.sortOrder - b.sortOrder);
    setProjects(updated);

    if (isSupabaseConfigured) {
      for (const item of updated) {
        await supabase.from('projects').update({ sort_order: item.sortOrder }).eq('id', item.id);
      }
    }
  };

  // Skills Actions
  const saveSkillCategory = async (category: SkillCategory): Promise<{ success: boolean; error?: string }> => {
    setSkills((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      if (exists) {
        return prev.map((c) => (c.id === category.id ? category : c));
      }
      return [...prev, category];
    });
    return { success: true };
  };

  const deleteSkillCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setSkills((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  const saveSkill = async (categoryId: string, skillName: string, highlight: boolean = false) => {
    const newId = `sk-${Date.now()}`;
    setSkills((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: [...cat.skills, { id: newId, name: skillName.trim(), highlight }],
          };
        }
        return cat;
      })
    );
  };

  const deleteSkill = async (categoryId: string, skillId: string) => {
    setSkills((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.id !== skillId),
          };
        }
        return cat;
      })
    );
  };

  // Experience Actions
  const saveExperience = async (item: ExperienceItem): Promise<{ success: boolean; error?: string }> => {
    setExperience((prev) => {
      const exists = prev.some((e) => e.id === item.id);
      if (exists) {
        return prev.map((e) => (e.id === item.id ? item : e));
      }
      return [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    return { success: true };
  };

  const deleteExperience = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
    return { success: true };
  };

  // Education Actions
  const saveEducation = async (item: EducationItem): Promise<{ success: boolean; error?: string }> => {
    setEducation((prev) => {
      const exists = prev.some((e) => e.id === item.id);
      if (exists) {
        return prev.map((e) => (e.id === item.id ? item : e));
      }
      return [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    return { success: true };
  };

  const deleteEducation = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
    return { success: true };
  };

  // Settings Actions
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);

      if (isSupabaseConfigured) {
        const { error: dbErr } = await supabase.from('site_settings').upsert({
          id: 'current',
          hero_name: merged.heroName,
          hero_title: merged.heroTitle,
          hero_quote: merged.heroQuote,
          hero_availability_text: merged.heroAvailabilityText,
          about_bio_p1: merged.aboutBioP1,
          about_bio_p2: merged.aboutBioP2,
          about_location: merged.aboutLocation,
          contact_email: merged.contactEmail,
          github_url: merged.githubUrl,
          linkedin_url: merged.linkedinUrl,
          itch_url: merged.itchUrl,
          resume_url: merged.resumeUrl,
          accent_color: merged.accentColor,
          show_availability: merged.showAvailability,
          footer_text: merged.footerText,
          updated_at: new Date().toISOString(),
        });
        if (dbErr) throw dbErr;
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update settings' };
    }
  };

  // Contact Form Submission
  const submitMessage = async (data: { name: string; email: string; message: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!data.name || data.name.trim().length < 2) {
        return { success: false, error: 'Please enter your full name.' };
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!data.message || data.message.trim().length < 5) {
        return { success: false, error: 'Please enter a message of at least 5 characters.' };
      }

      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const { error: dbErr } = await supabase.from('contact_messages').insert({
          name: newMsg.name,
          email: newMsg.email,
          message: newMsg.message,
        });
        if (dbErr) throw dbErr;
      }

      setMessages((prev) => [newMsg, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send message.' };
    }
  };

  const markMessageRead = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').delete().eq('id', id);
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        skills,
        experience,
        education,
        settings,
        messages,
        loading,
        error,
        isSupabaseConnected: isSupabaseConfigured,
        refreshData,
        saveProject,
        deleteProject,
        duplicateProject,
        toggleProjectFeatured,
        toggleProjectPublished,
        reorderProjects,
        saveSkillCategory,
        deleteSkillCategory,
        saveSkill,
        deleteSkill,
        saveExperience,
        deleteExperience,
        saveEducation,
        deleteEducation,
        updateSettings,
        submitMessage,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
