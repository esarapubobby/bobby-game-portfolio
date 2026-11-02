import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  settings: SiteSettings;
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
  isFirebaseConnected: boolean;
  isSupabaseConnected: boolean; // Alias for backward compatibility
  refreshData: () => Promise<void>;
  seedFirestoreIfEmpty: () => Promise<{ success: boolean; error?: string }>;

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

const cleanUnsplashUrls = (list: Project[]): Project[] => {
  return list.map((p) => {
    const isUnsplash = (url?: string) => Boolean(url && url.includes('images.unsplash.com'));
    return {
      ...p,
      coverImage: isUnsplash(p.coverImage) ? '' : (p.coverImage || ''),
      screenshots: (p.screenshots || []).filter((s) => !isUnsplash(s)),
    };
  });
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return cleanUnsplashUrls(parsed);
      } catch (e) {}
    }
    return cleanUnsplashUrls(initialProjects);
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.accentColor) {
          document.documentElement.setAttribute('data-theme', parsed.accentColor);
        }
        return {
          ...initialSiteSettings,
          ...parsed,
          linkedinUrl: parsed.linkedinUrl || 'https://www.linkedin.com/in/bobby-esarapu-68543230/',
          profileImageUrl: parsed.profileImageUrl || '',
          formsubmitToken: parsed.formsubmitToken || initialSiteSettings.formsubmitToken || '91b06bfc469fb65130a07c9b51d2d99',
          emailjsServiceId: parsed.emailjsServiceId || '',
          emailjsTemplateId: parsed.emailjsTemplateId || '',
          emailjsPublicKey: parsed.emailjsPublicKey || '',
        };
      } catch (e) {}
    }
    return initialSiteSettings;
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

  // Fetch data from Cloud Firestore
  const refreshData = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch site settings
      try {
        const settingsDocRef = doc(db, 'site_settings', 'current');
        const settingsSnap = await getDoc(settingsDocRef);
        if (settingsSnap.exists()) {
          const dbData = settingsSnap.data() as Partial<SiteSettings>;
          const mergedSettings: SiteSettings = {
            ...initialSiteSettings,
            ...dbData,
            id: 'current',
            linkedinUrl: dbData.linkedinUrl || initialSiteSettings.linkedinUrl || 'https://www.linkedin.com/in/bobby-esarapu-68543230/',
            profileImageUrl: dbData.profileImageUrl || '',
            formsubmitToken: dbData.formsubmitToken || initialSiteSettings.formsubmitToken || '91b06bfc469fb65130a07c9b51d2d99',
            emailjsServiceId: dbData.emailjsServiceId || '',
            emailjsTemplateId: dbData.emailjsTemplateId || '',
            emailjsPublicKey: dbData.emailjsPublicKey || '',
          };
          setSettings(mergedSettings);
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mergedSettings));
          if (mergedSettings.accentColor) {
            document.documentElement.setAttribute('data-theme', mergedSettings.accentColor);
          }
        }
      } catch (e) {
        console.warn('Firestore settings fetch notice:', e);
      }

      // 2. Fetch projects
      try {
        // When admin: fetch all projects (published + drafts)
        // When public visitor: query only published projects so Firestore Security Rules allow read
        const projectsRef = collection(db, 'projects');
        const projQuery = isAdmin
          ? query(projectsRef)
          : query(projectsRef, where('published', '==', true));

        const projectsSnap = await getDocs(projQuery);
        if (!projectsSnap.empty) {
          const loadedProjects: Project[] = [];
          projectsSnap.forEach((docSnap) => {
            const data = docSnap.data() as Project;
            loadedProjects.push({
              ...data,
              id: docSnap.id,
            });
          });

          const sorted = cleanUnsplashUrls(
            loadedProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          );
          setProjects(sorted);
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Firestore projects fetch notice:', e);
      }

      // 3. Fetch skills
      try {
        const skillsRef = collection(db, 'skills');
        const skillsSnap = await getDocs(skillsRef);
        if (!skillsSnap.empty) {
          const loadedSkills: SkillCategory[] = [];
          skillsSnap.forEach((docSnap) => {
            const data = docSnap.data() as SkillCategory;
            loadedSkills.push({
              ...data,
              id: docSnap.id,
            });
          });
          const sorted = loadedSkills.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          setSkills(sorted);
          localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Firestore skills fetch notice:', e);
      }

      // 4. Fetch experience
      try {
        const expRef = collection(db, 'experience');
        const expSnap = await getDocs(expRef);
        if (!expSnap.empty) {
          const loadedExp: ExperienceItem[] = [];
          expSnap.forEach((docSnap) => {
            const data = docSnap.data() as ExperienceItem;
            loadedExp.push({
              ...data,
              id: docSnap.id,
            });
          });
          const sorted = loadedExp.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          setExperience(sorted);
          localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Firestore experience fetch notice:', e);
      }

      // 5. Fetch education
      try {
        const eduRef = collection(db, 'education');
        const eduSnap = await getDocs(eduRef);
        if (!eduSnap.empty) {
          const loadedEdu: EducationItem[] = [];
          eduSnap.forEach((docSnap) => {
            const data = docSnap.data() as EducationItem;
            loadedEdu.push({
              ...data,
              id: docSnap.id,
            });
          });
          const sorted = loadedEdu.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          setEducation(sorted);
          localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Firestore education fetch notice:', e);
      }

      // 6. Fetch contact messages (only accessible when admin)
      if (isAdmin) {
        try {
          const msgRef = collection(db, 'contact_messages');
          const msgSnap = await getDocs(msgRef);
          if (!msgSnap.empty) {
            const loadedMsgs: ContactMessage[] = [];
            msgSnap.forEach((docSnap) => {
              const data = docSnap.data() as ContactMessage;
              loadedMsgs.push({
                ...data,
                id: docSnap.id,
              });
            });
            const sorted = loadedMsgs.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setMessages(sorted);
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(sorted));
          }
        } catch (e) {
          console.warn('Firestore messages fetch notice:', e);
        }
      }
    } catch (err: any) {
      console.warn('Firestore sync warning:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Seed initial data into Firestore if database is empty
  const seedFirestoreIfEmpty = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured) {
      return { success: false, error: 'Firebase is not configured.' };
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);

      // 1. Seed Site Settings
      const settingsRef = doc(db, 'site_settings', 'current');
      batch.set(settingsRef, initialSiteSettings, { merge: true });

      // 2. Seed Projects
      for (const proj of cleanUnsplashUrls(initialProjects)) {
        const projRef = doc(db, 'projects', proj.id);
        batch.set(projRef, proj, { merge: true });
      }

      // 3. Seed Skills
      for (const cat of initialSkillCategories) {
        const catRef = doc(db, 'skills', cat.id);
        batch.set(catRef, cat, { merge: true });
      }

      // 4. Seed Experience
      for (const exp of initialExperience) {
        const expRef = doc(db, 'experience', exp.id);
        batch.set(expRef, exp, { merge: true });
      }

      // 5. Seed Education
      for (const edu of initialEducation) {
        const eduRef = doc(db, 'education', edu.id);
        batch.set(eduRef, edu, { merge: true });
      }

      await batch.commit();
      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to seed Firestore data.' };
    } finally {
      setLoading(false);
    }
  };

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
        coverImage: projectData.coverImage || '',
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

      if (isFirebaseConfigured) {
        const docRef = doc(db, 'projects', updatedProject.id);
        await setDoc(docRef, updatedProject, { merge: true });
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
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'projects', id));
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
      updatedAt: new Date().toISOString(),
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

    if (isFirebaseConfigured) {
      try {
        const batch = writeBatch(db);
        for (const item of updated) {
          const itemRef = doc(db, 'projects', item.id);
          batch.update(itemRef, { sortOrder: item.sortOrder });
        }
        await batch.commit();
      } catch (err) {
        console.warn('Batch project reorder error:', err);
      }
    }
  };

  // Skills Actions
  const saveSkillCategory = async (category: SkillCategory): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'skills', category.id), category, { merge: true });
      }

      setSkills((prev) => {
        const exists = prev.some((c) => c.id === category.id);
        if (exists) {
          return prev.map((c) => (c.id === category.id ? category : c));
        }
        return [...prev, category];
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save skill category' };
    }
  };

  const deleteSkillCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'skills', id));
      }
      setSkills((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete category' };
    }
  };

  const saveSkill = async (categoryId: string, skillName: string, highlight: boolean = false) => {
    const newId = `sk-${Date.now()}`;
    const category = skills.find((c) => c.id === categoryId);
    if (!category) return;

    const updatedCategory: SkillCategory = {
      ...category,
      skills: [...category.skills, { id: newId, name: skillName.trim(), highlight }],
    };

    await saveSkillCategory(updatedCategory);
  };

  const deleteSkill = async (categoryId: string, skillId: string) => {
    const category = skills.find((c) => c.id === categoryId);
    if (!category) return;

    const updatedCategory: SkillCategory = {
      ...category,
      skills: category.skills.filter((s) => s.id !== skillId),
    };

    await saveSkillCategory(updatedCategory);
  };

  // Experience Actions
  const saveExperience = async (item: ExperienceItem): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'experience', item.id), item, { merge: true });
      }

      setExperience((prev) => {
        const exists = prev.some((e) => e.id === item.id);
        if (exists) {
          return prev.map((e) => (e.id === item.id ? item : e));
        }
        return [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder);
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save experience' };
    }
  };

  const deleteExperience = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'experience', id));
      }
      setExperience((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete experience' };
    }
  };

  // Education Actions
  const saveEducation = async (item: EducationItem): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'education', item.id), item, { merge: true });
      }

      setEducation((prev) => {
        const exists = prev.some((e) => e.id === item.id);
        if (exists) {
          return prev.map((e) => (e.id === item.id ? item : e));
        }
        return [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder);
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save education' };
    }
  };

  const deleteEducation = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'education', id));
      }
      setEducation((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete education' };
    }
  };

  // Settings Actions
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      const merged: SiteSettings = { ...settings, ...newSettings, id: 'current' };
      setSettings(merged);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      if (merged.accentColor) {
        document.documentElement.setAttribute('data-theme', merged.accentColor);
      }

      if (isFirebaseConfigured) {
        const settingsRef = doc(db, 'site_settings', 'current');
        await setDoc(settingsRef, {
          ...merged,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update settings' };
    }
  };

  // Contact Form Submission (Note: Production inquiries are delivered directly via EmailJS to esarapubobby@gmail.com)
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

      // Explicitly decoupled from Firestore and localStorage per direct EmailJS delivery requirement
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to process message.' };
    }
  };

  const markMessageRead = async (id: string) => {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'contact_messages', id), { read: true });
      } catch (err) {
        console.warn('Mark message read error:', err);
      }
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = async (id: string) => {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'contact_messages', id));
      } catch (err) {
        console.warn('Delete message error:', err);
      }
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
        isFirebaseConnected: isFirebaseConfigured,
        isSupabaseConnected: isFirebaseConfigured,
        refreshData,
        seedFirestoreIfEmpty,
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
