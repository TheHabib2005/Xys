import React from 'react';
import { Section, generateMockData } from '@/interfaces/templateEditor';
import { SchemaEditor } from './SchemaEditor';
import ResumePreview from './ResumePreview';

import { Sparkles, Code, Eye, Layout, Save, Download, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


// Initial data provided by user
const INITIAL_SCHEMA: Section[] = [
  {
    "ui": {
      "columns": 2,
      "description": "Keep contact concise and scan-friendly."
    },
    "key": "header",
    "type": "object",
    "label": "Header",
    "order": 1,
    "fields": [
      {
        "ui": {
          "grid": "col-span-2"
        },
        "name": "fullName",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Habib Rahman"
      },
      {
        "ui": {
          "grid": "col-span-2"
        },
        "name": "jobTitle",
        "type": "text",
        "label": "Professional Title",
        "required": true,
        "placeholder": "Frontend Developer"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email",
        "required": true,
        "placeholder": "habib@email.com"
      },
      {
        "name": "phone",
        "type": "tel",
        "label": "Phone",
        "required": true,
        "placeholder": "+880 1XXXXXXXXX"
      },
      {
        "name": "location",
        "type": "text",
        "label": "Location",
        "required": true,
        "placeholder": "Dhaka, Bangladesh"
      },
      {
        "name": "linkedin",
        "type": "url",
        "label": "LinkedIn",
        "placeholder": "https://linkedin.com/in/username"
      },
      {
        "name": "github",
        "type": "url",
        "label": "GitHub",
        "placeholder": "https://github.com/username"
      },
      {
        "name": "portfolio",
        "type": "url",
        "label": "Portfolio",
        "placeholder": "https://yourportfolio.com"
      }
    ]
  },
  {
    "ui": {
      "columns": 1,
      "description": "Mention role, years of experience, core skills, and impact."
    },
    "key": "summary",
    "type": "object",
    "label": "Professional Summary",
    "order": 2,
    "fields": [
      {
        "ui": {
          "grid": "col-span-2",
          "rows": 5,
          "showCount": true
        },
        "name": "summary",
        "type": "textarea",
        "label": "Summary",
        "required": true,
        "validation": {
          "maxLength": 700,
          "minLength": 120
        },
        "placeholder": "Results-driven frontend developer with expertise in modern frameworks and UI/UX design."
      }
    ]
  },
  {
    "ui": {
      "columns": 2,
      "description": "Group skills by category."
    },
    "key": "skills",
    "type": "array",
    "label": "Core Skills",
    "order": 3,
    "fields": [
      {
        "name": "category",
        "type": "text",
        "label": "Skill Category",
        "required": true,
        "placeholder": "Frontend, Tools, Testing"
      },
      {
        "ui": {
          "rows": 2,
          "showCount": true
        },
        "name": "items",
        "type": "textarea",
        "label": "Skills",
        "required": true,
        "validation": {
          "maxLength": 300,
          "minLength": 10
        },
        "placeholder": "React, TypeScript, Next.js, TailwindCSS, Redux, Jest"
      }
    ],
    "required": true
  },
  {
    "ui": {
      "columns": 2,
      "description": "Reverse chronological order, quantify impact."
    },
    "key": "experience",
    "type": "array",
    "label": "Work Experience",
    "order": 4,
    "fields": [
      {
        "name": "company",
        "type": "text",
        "label": "Company",
        "required": true,
        "placeholder": "Company Name"
      },
      {
        "name": "role",
        "type": "text",
        "label": "Role",
        "required": true,
        "placeholder": "Frontend Developer"
      },
      {
        "name": "location",
        "type": "text",
        "label": "Location",
        "placeholder": "Dhaka, Bangladesh"
      },
      {
        "name": "startDate",
        "type": "date",
        "label": "Start Date",
        "required": true
      },
      {
        "name": "endDate",
        "type": "date",
        "label": "End Date",
        "placeholder": "Present"
      },
      {
        "ui": {
          "rows": 5,
          "showCount": true
        },
        "name": "description",
        "type": "textarea",
        "label": "Description",
        "required": true,
        "validation": {
          "maxLength": 1200,
          "minLength": 80
        },
        "placeholder": "Describe responsibilities and achievements."
      }
    ],
    "required": true
  },
  {
    "ui": {
      "columns": 2,
      "description": "Highlight impactful projects."
    },
    "key": "projects",
    "type": "array",
    "label": "Projects",
    "order": 5,
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Project Name",
        "required": true,
        "placeholder": "Resume Builder App"
      },
      {
        "name": "link",
        "type": "url",
        "label": "Project Link",
        "placeholder": "https://github.com/username/project"
      },
      {
        "name": "techStack",
        "type": "text",
        "label": "Tech Stack",
        "required": true,
        "placeholder": "React, TypeScript, TailwindCSS, Node.js"
      },
      {
        "ui": {
          "rows": 4,
          "showCount": true
        },
        "name": "description",
        "type": "textarea",
        "label": "Description",
        "required": true,
        "validation": {
          "maxLength": 900,
          "minLength": 60
        },
        "placeholder": "Explain project purpose, your role, and results."
      }
    ],
    "required": false
  },
  {
    "ui": {
      "columns": 2,
      "description": "Keep academic details concise."
    },
    "key": "education",
    "type": "array",
    "label": "Education",
    "order": 6,
    "fields": [
      {
        "name": "institution",
        "type": "text",
        "label": "Institution",
        "required": true,
        "placeholder": "University / College Name"
      },
      {
        "name": "degree",
        "type": "text",
        "label": "Degree",
        "required": true,
        "placeholder": "B.Sc. in Computer Science"
      },
      {
        "name": "field",
        "type": "text",
        "label": "Field of Study",
        "placeholder": "Computer Science and Engineering"
      },
      {
        "name": "startYear",
        "type": "number",
        "label": "Start Year",
        "required": true,
        "placeholder": "2020"
      },
      {
        "name": "endYear",
        "type": "number",
        "label": "End Year",
        "placeholder": "2024"
      },
      {
        "ui": {
          "rows": 3,
          "showCount": true
        },
        "name": "details",
        "type": "textarea",
        "label": "Details",
        "placeholder": "CGPA, honors, coursework, achievements."
      }
    ],
    "required": true
  },
  {
    "ui": {
      "columns": 2,
      "description": "Optional but strong for your profile."
    },
    "key": "certifications",
    "type": "array",
    "label": "Certifications",
    "order": 7,
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Certification Name",
        "required": true,
        "placeholder": "AWS Certified Developer"
      },
      {
        "name": "issuer",
        "type": "text",
        "label": "Issuer",
        "required": true,
        "placeholder": "Amazon Web Services"
      },
      {
        "name": "date",
        "type": "date",
        "label": "Date"
      },
      {
        "name": "link",
        "type": "url",
        "label": "Credential Link",
        "placeholder": "https://credential-url.com"
      }
    ],
    "required": false
  },
  {
    "ui": {
      "columns": 1,
      "description": "Highlight your professional strengths."
    },
    "key": "strengths",
    "type": "array",
    "label": "Strengths",
    "order": 8,
    "fields": [
      {
        "name": "strength",
        "type": "text",
        "label": "Strength",
        "required": true,
        "placeholder": "Problem Solving, Team Leadership, Creativity"
      }
    ],
    "required": false
  },
  {
    "ui": {
      "columns": 2,
      "description": "Include languages and proficiency levels."
    },
    "key": "languages",
    "type": "array",
    "label": "Languages",
    "order": 9,
    "fields": [
      {
        "name": "language",
        "type": "text",
        "label": "Language",
        "required": true,
        "placeholder": "English, Bengali, Spanish"
      },
      {
        "name": "level",
        "type": "text",
        "label": "Proficiency Level",
        "placeholder": "Fluent, Native, Intermediate"
      }
    ],
    "required": false
  },
  {
    "ui": {
      "columns": 1,
      "description": "Add personal interests for a modern touch."
    },
    "key": "hobbies",
    "type": "array",
    "label": "Hobbies & Interests",
    "order": 10,
    "fields": [
      {
        "name": "hobby",
        "type": "text",
        "label": "Hobby",
        "required": true,
        "placeholder": "Reading, Gaming, Hiking"
      }
    ],
    "required": false
  }
]

export default function App() {
  const [schema, setSchema] = React.useState<Section[]>(INITIAL_SCHEMA);
  const [view, setView] = React.useState<'editor' | 'preview' | 'json'>('editor');
  const [isSplitView, setIsSplitView] = React.useState(true);
  const [mockData, setMockData] = React.useState<any>(generateMockData(INITIAL_SCHEMA));

  const handleSchemaChange = (newSchema: Section[]) => {
    setSchema(newSchema);
    setMockData(generateMockData(newSchema));
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schema, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume_template_schema.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
         

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => { setView('editor'); setIsSplitView(false); }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'editor' && !isSplitView ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Layout className="h-3.5 w-3.5" /> Full Editor
              </button>
              <button
                onClick={() => { setView('editor'); setIsSplitView(true); }}
                className={cn(
                  "hidden lg:flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'editor' && isSplitView ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Layout className="h-3.5 w-3.5" /> Split View
              </button>
              <button
                onClick={() => { setView('preview'); setIsSplitView(false); }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'preview' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                onClick={() => { setView('json'); setIsSplitView(false); }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'json' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <FileJson className="h-3.5 w-3.5" /> Schema
              </button>
            </div>

            <Button onClick={exportJSON} variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {view === 'editor' && isSplitView ? (
            <motion.div
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                <SchemaEditor schema={schema} onSchemaChange={handleSchemaChange} />
              </div>
              <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tight">Live Preview</h2>
                    <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase text-indigo-600">
                      <Sparkles className="h-3 w-3" /> Mock Data
                    </div>
                  </div>
                  <div className="scale-[0.8] origin-top">
                    <ResumePreview data={mockData} schema={schema} />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : view === 'editor' ? (
            <motion.div
              key="full-editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
              <SchemaEditor schema={schema} onSchemaChange={handleSchemaChange} />
            </motion.div>
          ) : view === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex w-full max-w-[800px] items-center justify-between rounded-2xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-100">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Live Template Preview</h2>
                  <p className="text-xs font-medium opacity-80">Renders your schema with dynamic mock data.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase">
                  <Sparkles className="h-3 w-3" /> Mock Data Enabled
                </div>
              </div>
              <div className="w-full">
                <ResumePreview data={mockData} schema={schema} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Schema Blueprint</h2>
                  <p className="text-sm font-medium text-slate-500">The machine-readable definition of your template.</p>
                </div>
                <Button onClick={exportJSON} variant="outline" className="gap-2">
                  <FileJson className="h-4 w-4" /> Copy JSON
                </Button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 shadow-2xl">
                <pre className="max-h-[70vh] overflow-auto text-xs font-mono leading-relaxed text-indigo-300 scrollbar-thin scrollbar-thumb-slate-700">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center gap-3">
            <div className="h-3 w-3 rounded-full bg-indigo-600" />
            <div className="h-3 w-3 rounded-full bg-indigo-400" />
            <div className="h-3 w-3 rounded-full bg-indigo-200" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
            Resume Template Architect Pro
          </p>
          <p className="mt-3 text-xs font-medium text-slate-400">
            Design dynamic schemas and HTML templates for modern resume builders.
          </p>
        </div>
      </footer>
    </div>
  );
}
