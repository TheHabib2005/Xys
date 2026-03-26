export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'date' | 'checkbox' | 'select' | 'textarea' | 'richtext' | 'tel';
  placeholder?: string;
  default?: string | boolean;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { label: string; value: string }[];
  ui?: {
    grid?: number; // 1-12 col span
    hidden?: boolean;
  };
  condition?: {
    field: string;
    value: string | boolean;
  };
}

export interface SectionDef {
  id: string;
  title: string;
  description?: string;
  type: 'object' | 'array';
  icon?: string;
  fields: FieldDef[];
  itemLabel?: string; // for array: "Experience", "Education" etc.
  maxItems?: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  color: string;
  sections: SectionDef[];
  htmlLayout: string; // Handlebars-like template for preview
}

// ─── Professional Template ──────────────────────────────────────────
export const professionalTemplate: ResumeTemplate = {
  id: 'professional',
  name: 'Professional',
  description: 'Clean, corporate-ready resume for experienced professionals',
  color: '#1a1a2e',
  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your basic contact details',
      type: 'object',
      icon: 'User',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true, default: '', ui: { grid: 6 } },
        { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true, default: '', ui: { grid: 6 } },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: true, default: '', ui: { grid: 6 } },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 123-4567', default: '', ui: { grid: 6 } },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY', default: '', ui: { grid: 6 } },
        { name: 'website', label: 'Website', type: 'url', placeholder: 'https://johndoe.com', default: '', ui: { grid: 6 } },
        { name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/johndoe', default: '', ui: { grid: 6 } },
        { name: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Senior Software Engineer', required: true, default: '', ui: { grid: 6 } },
      ],
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      description: 'A brief overview of your career and goals',
      type: 'object',
      icon: 'FileText',
      fields: [
        { name: 'summary', label: 'Summary', type: 'richtext', placeholder: 'Write a compelling summary...', required: true, default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'experience',
      title: 'Work Experience',
      description: 'Your professional work history',
      type: 'array',
      icon: 'Briefcase',
      itemLabel: 'Position',
      maxItems: 10,
      fields: [
        { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc.', required: true, default: '', ui: { grid: 6 } },
        { name: 'position', label: 'Position', type: 'text', placeholder: 'Software Engineer', required: true, default: '', ui: { grid: 6 } },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true, default: '', ui: { grid: 4 } },
        { name: 'endDate', label: 'End Date', type: 'date', default: '', ui: { grid: 4 } },
        { name: 'current', label: 'Currently working here', type: 'checkbox', default: false, ui: { grid: 4 } },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA', default: '', ui: { grid: 6 } },
        { name: 'type', label: 'Employment Type', type: 'select', default: 'full-time', options: [
          { label: 'Full-time', value: 'full-time' },
          { label: 'Part-time', value: 'part-time' },
          { label: 'Contract', value: 'contract' },
          { label: 'Freelance', value: 'freelance' },
        ], ui: { grid: 6 } },
        { name: 'description', label: 'Description', type: 'richtext', placeholder: 'Describe your responsibilities and achievements...', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Your academic background',
      type: 'array',
      icon: 'GraduationCap',
      itemLabel: 'Degree',
      maxItems: 5,
      fields: [
        { name: 'institution', label: 'Institution', type: 'text', placeholder: 'MIT', required: true, default: '', ui: { grid: 6 } },
        { name: 'degree', label: 'Degree', type: 'text', placeholder: 'B.S. Computer Science', required: true, default: '', ui: { grid: 6 } },
        { name: 'startDate', label: 'Start Date', type: 'date', default: '', ui: { grid: 6 } },
        { name: 'endDate', label: 'End Date', type: 'date', default: '', ui: { grid: 6 } },
        { name: 'gpa', label: 'GPA', type: 'text', placeholder: '3.8 / 4.0', default: '', ui: { grid: 6 } },
        { name: 'description', label: 'Description', type: 'richtext', placeholder: 'Notable achievements, coursework...', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'Your technical and soft skills',
      type: 'object',
      icon: 'Zap',
      fields: [
        { name: 'technical', label: 'Technical Skills', type: 'textarea', placeholder: 'JavaScript, TypeScript, React, Node.js...', default: '', ui: { grid: 12 } },
        { name: 'soft', label: 'Soft Skills', type: 'textarea', placeholder: 'Leadership, Communication, Problem Solving...', default: '', ui: { grid: 12 } },
        { name: 'languages', label: 'Languages', type: 'textarea', placeholder: 'English (Native), Spanish (Fluent)...', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Notable projects you have worked on',
      type: 'array',
      icon: 'FolderOpen',
      itemLabel: 'Project',
      maxItems: 8,
      fields: [
        { name: 'name', label: 'Project Name', type: 'text', placeholder: 'My Awesome Project', required: true, default: '', ui: { grid: 6 } },
        { name: 'url', label: 'Project URL', type: 'url', placeholder: 'https://github.com/...', default: '', ui: { grid: 6 } },
        { name: 'description', label: 'Description', type: 'richtext', placeholder: 'What did you build and why?', default: '', ui: { grid: 12 } },
      ],
    },
  ],
  htmlLayout: `
    <div style="font-family: 'Inter', sans-serif; max-width: 100%; padding: 40px; color: #1a1a2e;">
      <header style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1a1a2e; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">{{personal.firstName}} {{personal.lastName}}</h1>
        <p style="font-size: 16px; color: #555; margin: 4px 0 12px;">{{personal.jobTitle}}</p>
        <p style="font-size: 12px; color: #777;">{{personal.email}} · {{personal.phone}} · {{personal.location}}</p>
      </header>
      {{#if summary.summary}}<section style="margin-bottom: 20px;"><h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px;">Summary</h2><div style="font-size: 13px; line-height: 1.6; color: #333;">{{{summary.summary}}}</div></section>{{/if}}
      {{#if experience.length}}<section style="margin-bottom: 20px;"><h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px;">Experience</h2>{{#each experience}}<div style="margin-bottom: 14px;"><div style="display: flex; justify-content: space-between;"><strong style="font-size: 14px;">{{this.position}}</strong><span style="font-size: 12px; color: #777;">{{this.startDate}} — {{this.endDate}}</span></div><p style="font-size: 13px; color: #555; margin: 2px 0;">{{this.company}} · {{this.location}}</p><div style="font-size: 12px; line-height: 1.5; color: #444;">{{{this.description}}}</div></div>{{/each}}</section>{{/if}}
      {{#if education.length}}<section style="margin-bottom: 20px;"><h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px;">Education</h2>{{#each education}}<div style="margin-bottom: 10px;"><strong style="font-size: 14px;">{{this.degree}}</strong><p style="font-size: 13px; color: #555; margin: 2px 0;">{{this.institution}} {{#if this.gpa}}· GPA: {{this.gpa}}{{/if}}</p></div>{{/each}}</section>{{/if}}
      {{#if skills.technical}}<section style="margin-bottom: 20px;"><h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px;">Skills</h2><p style="font-size: 12px; line-height: 1.6;">{{skills.technical}}</p></section>{{/if}}
    </div>
  `,
};

// ─── Minimal Template ──────────────────────────────────────────
export const minimalTemplate: ResumeTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Ultra-clean, whitespace-focused design for creatives',
  color: '#0f172a',
  sections: [
    {
      id: 'personal',
      title: 'About You',
      description: 'Basic information',
      type: 'object',
      icon: 'User',
      fields: [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Smith', required: true, default: '', ui: { grid: 12 } },
        { name: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Designer & Developer', required: true, default: '', ui: { grid: 12 } },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com', required: true, default: '', ui: { grid: 6 } },
        { name: 'portfolio', label: 'Portfolio', type: 'url', placeholder: 'https://janesmith.design', default: '', ui: { grid: 6 } },
      ],
    },
    {
      id: 'bio',
      title: 'Bio',
      description: 'Tell your story',
      type: 'object',
      icon: 'PenLine',
      fields: [
        { name: 'bio', label: 'Bio', type: 'richtext', placeholder: 'Write about yourself...', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Where you have worked',
      type: 'array',
      icon: 'Briefcase',
      itemLabel: 'Role',
      fields: [
        { name: 'role', label: 'Role', type: 'text', required: true, default: '', ui: { grid: 6 } },
        { name: 'company', label: 'Company', type: 'text', required: true, default: '', ui: { grid: 6 } },
        { name: 'period', label: 'Period', type: 'text', placeholder: '2020 — Present', default: '', ui: { grid: 12 } },
        { name: 'highlights', label: 'Highlights', type: 'richtext', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'What you are good at',
      type: 'object',
      icon: 'Sparkles',
      fields: [
        { name: 'skills', label: 'Skills', type: 'textarea', placeholder: 'Figma, React, TypeScript...', default: '', ui: { grid: 12 } },
      ],
    },
  ],
  htmlLayout: `
    <div style="font-family: 'DM Sans', sans-serif; padding: 48px; color: #0f172a; max-width: 100%;">
      <header style="margin-bottom: 36px;">
        <h1 style="font-size: 32px; font-weight: 800; margin: 0;">{{personal.fullName}}</h1>
        <p style="font-size: 18px; color: #64748b; margin: 4px 0 16px; font-weight: 300;">{{personal.tagline}}</p>
        <p style="font-size: 12px; color: #94a3b8;">{{personal.email}} {{#if personal.portfolio}}· {{personal.portfolio}}{{/if}}</p>
      </header>
      {{#if bio.bio}}<section style="margin-bottom: 28px;"><div style="font-size: 14px; line-height: 1.8; color: #334155;">{{{bio.bio}}}</div></section>{{/if}}
      {{#if experience.length}}<section style="margin-bottom: 28px;"><h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; margin-bottom: 16px;">Experience</h2>{{#each experience}}<div style="margin-bottom: 16px;"><div style="font-size: 15px; font-weight: 600;">{{this.role}} <span style="font-weight: 400; color: #64748b;">at {{this.company}}</span></div><p style="font-size: 12px; color: #94a3b8; margin: 2px 0;">{{this.period}}</p><div style="font-size: 13px; color: #475569; line-height: 1.6;">{{{this.highlights}}}</div></div>{{/each}}</section>{{/if}}
      {{#if skills.skills}}<section><h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; margin-bottom: 8px;">Skills</h2><p style="font-size: 13px; color: #475569; line-height: 1.8;">{{skills.skills}}</p></section>{{/if}}
    </div>
  `,
};

// ─── Creative Template ──────────────────────────────────────────
export const creativeTemplate: ResumeTemplate = {
  id: 'creative',
  name: 'Creative',
  description: 'Bold, colorful layout for designers and artists',
  color: '#7c3aed',
  sections: [
    {
      id: 'personal',
      title: 'Profile',
      description: 'Who are you?',
      type: 'object',
      icon: 'Palette',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, default: '', ui: { grid: 12 } },
        { name: 'title', label: 'Creative Title', type: 'text', placeholder: 'UI/UX Wizard ✨', required: true, default: '', ui: { grid: 12 } },
        { name: 'email', label: 'Email', type: 'email', required: true, default: '', ui: { grid: 6 } },
        { name: 'phone', label: 'Phone', type: 'tel', default: '', ui: { grid: 6 } },
        { name: 'website', label: 'Website', type: 'url', default: '', ui: { grid: 6 } },
        { name: 'dribbble', label: 'Dribbble / Behance', type: 'url', default: '', ui: { grid: 6 } },
      ],
    },
    {
      id: 'about',
      title: 'About Me',
      description: 'Your creative story',
      type: 'object',
      icon: 'Heart',
      fields: [
        { name: 'about', label: 'About', type: 'richtext', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Creative journey',
      type: 'array',
      icon: 'Rocket',
      itemLabel: 'Role',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, default: '', ui: { grid: 6 } },
        { name: 'company', label: 'Company', type: 'text', required: true, default: '', ui: { grid: 6 } },
        { name: 'startDate', label: 'From', type: 'date', default: '', ui: { grid: 6 } },
        { name: 'endDate', label: 'To', type: 'date', default: '', ui: { grid: 6 } },
        { name: 'description', label: 'What you did', type: 'richtext', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'projects',
      title: 'Portfolio',
      description: 'Showcase your best work',
      type: 'array',
      icon: 'Image',
      itemLabel: 'Project',
      maxItems: 6,
      fields: [
        { name: 'name', label: 'Project Name', type: 'text', required: true, default: '', ui: { grid: 6 } },
        { name: 'url', label: 'Live URL', type: 'url', default: '', ui: { grid: 6 } },
        { name: 'role', label: 'Your Role', type: 'text', default: '', ui: { grid: 6 } },
        { name: 'tools', label: 'Tools Used', type: 'text', placeholder: 'Figma, After Effects...', default: '', ui: { grid: 6 } },
        { name: 'description', label: 'Description', type: 'richtext', default: '', ui: { grid: 12 } },
      ],
    },
    {
      id: 'skills',
      title: 'Superpowers',
      description: 'Your toolkit',
      type: 'object',
      icon: 'Sparkles',
      fields: [
        { name: 'design', label: 'Design Skills', type: 'textarea', default: '', ui: { grid: 12 } },
        { name: 'technical', label: 'Technical Skills', type: 'textarea', default: '', ui: { grid: 12 } },
      ],
    },
  ],
  htmlLayout: `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1e1b4b; max-width: 100%;">
      <header style="margin-bottom: 28px; border-left: 4px solid #7c3aed; padding-left: 20px;">
        <h1 style="font-size: 30px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #7c3aed, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{personal.name}}</h1>
        <p style="font-size: 16px; color: #7c3aed; margin: 4px 0 12px; font-weight: 500;">{{personal.title}}</p>
        <p style="font-size: 12px; color: #6b7280;">{{personal.email}} · {{personal.phone}}</p>
      </header>
      {{#if about.about}}<section style="margin-bottom: 24px;"><div style="font-size: 14px; line-height: 1.7; color: #374151;">{{{about.about}}}</div></section>{{/if}}
      {{#if experience.length}}<section style="margin-bottom: 24px;"><h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #7c3aed; margin-bottom: 12px; font-weight: 700;">Experience</h2>{{#each experience}}<div style="margin-bottom: 14px; padding-left: 16px; border-left: 2px solid #e9d5ff;"><strong style="font-size: 14px;">{{this.title}}</strong><span style="color: #6b7280;"> · {{this.company}}</span><div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.5;">{{{this.description}}}</div></div>{{/each}}</section>{{/if}}
      {{#if projects.length}}<section style="margin-bottom: 24px;"><h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #7c3aed; margin-bottom: 12px; font-weight: 700;">Portfolio</h2>{{#each projects}}<div style="margin-bottom: 12px;"><strong style="font-size: 14px;">{{this.name}}</strong> {{#if this.role}}<span style="color: #6b7280; font-size: 12px;">— {{this.role}}</span>{{/if}}<div style="font-size: 12px; color: #475569; margin-top: 2px;">{{{this.description}}}</div></div>{{/each}}</section>{{/if}}
    </div>
  `,
};

export const allTemplates: ResumeTemplate[] = [professionalTemplate, minimalTemplate, creativeTemplate];

export const getTemplateById = (id: string): ResumeTemplate => {
  return allTemplates.find(t => t.id === id) || professionalTemplate;
};
