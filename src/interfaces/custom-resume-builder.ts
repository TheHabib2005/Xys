export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'contacts'
  | 'website'
  | 'hobbies'
  | 'organization';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  position: number;
  content: string;
  settings?: Record<string, unknown>;
}

export interface ResumeData {
  id: string;
  name: string;
  title: string;
  contacts: Record<string, string>;
  sections: Section[];
}

export interface StyleSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  letterSpacing: number;
  headingColor: string;
  accentColor: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'idle';
