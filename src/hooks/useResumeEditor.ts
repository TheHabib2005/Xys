import { useState, useCallback, useEffect, useRef } from 'react';
import type { ResumeData, StyleSettings, SectionType, Section, SaveStatus } from '@/interfaces/custom-resume-builder';
import { fetchResume, saveResume } from '@/lib/mockApi';

const sectionDefaults: Record<SectionType, { title: string; content: string }> = {
  summary: { title: 'Professional Summary', content: '<p>Write your professional summary here...</p>' },
  experience: { title: 'Work Experience', content: '<p><strong>Job Title</strong> — Company</p><ul><li>Accomplishment</li></ul>' },
  education: { title: 'Education', content: '<p><strong>Degree</strong> — Institution</p><p>Year</p>' },
  skills: { title: 'Skills', content: '<p>List your skills here...</p>' },
  projects: { title: 'Projects', content: '<p><strong>Project Name</strong></p><p>Description of your project.</p>' },
  certifications: { title: 'Certifications', content: '<p><strong>Certification Name</strong> — Issuer, Year</p>' },
  languages: { title: 'Languages', content: '<p>English (Native), Spanish (Conversational)</p>' },
  contacts: { title: 'Contacts', content: '<p>Add contact details here...</p>' },
  website: { title: 'Website & Links', content: '<p>https://yourwebsite.com</p>' },
  hobbies: { title: 'Hobbies', content: '<p>Reading, Travel, Photography</p>' },
  organization: { title: 'Organization Experience', content: '<p><strong>Role</strong> — Organization</p>' },
};

const defaultStyles: StyleSettings = {
  fontFamily: 'Geist',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#1B1B1B',
  letterSpacing: -1.5,
  headingColor: '#1B1B1B',
  accentColor: '#3b82f6',
};

export function useResumeEditor() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [styles, setStylesState] = useState<StyleSettings>(defaultStyles);
  const [selectedSectionId, setSelectedSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dataRef = useRef(data);
  const stylesRef = useRef(styles);

  dataRef.current = data;
  stylesRef.current = styles;

  // Load
  useEffect(() => {
    fetchResume().then(({ data: d, styles: s }) => {
      setData(d);
      setStylesState(s);
      setLoading(false);
      setSaveStatus('saved');
    });
  }, []);

  // Autosave
  const triggerSave = useCallback(() => {
    if (!dataRef.current) return;
    setSaveStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await saveResume(dataRef.current!, stylesRef.current);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('offline');
      }
    }, 1200);
  }, []);

  const updateData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      return next;
    });
    triggerSave();
  }, [triggerSave]);

  const updateName = useCallback((name: string) => updateData((d) => ({ ...d, name })), [updateData]);
  const updateTitle = useCallback((title: string) => updateData((d) => ({ ...d, title })), [updateData]);
  const updateContact = useCallback((key: string, value: string) => updateData((d) => ({ ...d, contacts: { ...d.contacts, [key]: value } })), [updateData]);

  const updateSectionContent = useCallback((id: string, html: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, content: html } : s)),
    }));
  }, [updateData]);

  const updateSectionTitle = useCallback((id: string, title: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, title } : s)),
    }));
  }, [updateData]);

  const addSection = useCallback((type: SectionType) => {
    const def = sectionDefaults[type] || { title: type, content: '<p></p>' };
    updateData((d) => ({
      ...d,
      sections: [...d.sections, { id: `sec-${Date.now()}`, type, title: def.title, position: d.sections.length, content: def.content }],
    }));
  }, [updateData]);

  const removeSection = useCallback((id: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, position: i })),
    }));
    setSelectedSection((prev) => (prev === id ? null : prev));
  }, [updateData]);

  const reorderSections = useCallback((ids: string[]) => {
    updateData((d) => ({
      ...d,
      sections: ids.map((id, i) => {
        const sec = d.sections.find((x) => x.id === id)!;
        return { ...sec, position: i };
      }),
    }));
  }, [updateData]);

  const setStyles = useCallback((partial: Partial<StyleSettings>) => {
    setStylesState((prev) => ({ ...prev, ...partial }));
    triggerSave();
  }, [triggerSave]);

  const resetStyles = useCallback(() => {
    setStylesState(defaultStyles);
    triggerSave();
  }, [triggerSave]);

  return {
    data,
    styles,
    selectedSectionId,
    saveStatus,
    zoom,
    loading,
    setSelectedSection,
    setSaveStatus,
    setZoom,
    updateName,
    updateTitle,
    updateContact,
    updateSectionContent,
    updateSectionTitle,
    addSection,
    removeSection,
    reorderSections,
    setStyles,
    resetStyles,
  };
}
