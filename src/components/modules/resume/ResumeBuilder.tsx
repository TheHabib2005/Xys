'use client';

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Download, Wand2, Loader2, User, FileText, 
  Briefcase, GraduationCap, Zap, Eye, Plus, Trash2, Phone, Globe, 
  Linkedin, MapPin, Save, CloudCheck, AlertCircle, Sparkles, MoreVertical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- Types ---
type ResumeFormData = {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string; website: string; title: string; };
  summary: string;
  experience: Array<{ id: string; title: string; company: string; location: string; start: string; end: string; current: boolean; bullets: string; }>;
  education: Array<{ id: string; degree: string; institution: string; year: string; gpa: string; }>;
  skills: string[];
};

const defaultResumeForm: ResumeFormData = {
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "", title: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

const StepWrapper = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
    {children}
  </motion.div>
);

export default function ResumeBuilderPageForm({ id }: { id: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ResumeFormData>(defaultResumeForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // --- API Data ---
  const { data, isFetching: isApiLoading } = useApiQuery(
    ["template", id],
    `/template/templateDetails/${id}`,
    "axios",
    { staleTime: 1000 * 60 * 5 }
  );
  const template = data?.data;

  // --- Persistence Logic (Auto-save simulation) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData !== defaultResumeForm) {
        setIsSaving(true);
        // Here you would call: axios.patch(`/resumes/${id}`, formData)
        setTimeout(() => setIsSaving(false), 800);
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [formData]);

  const dynamicSteps = useMemo(() => {
    if (!template?.sections) return [];
    const steps: any[] = [];
    const personalFields = ["name", "title", "email", "phone", "location", "linkedin", "website"];
    if (template.sections.some((s: string) => personalFields.includes(s))) {
      steps.push({ id: "personal", label: "Basics", icon: <User className="h-4 w-4" />, desc: "How recruiters contact you" });
    }
    if (template.sections.includes("summary")) steps.push({ id: "summary", label: "Summary", icon: <FileText className="h-4 w-4" />, desc: "Your elevator pitch" });
    if (template.sections.includes("experience")) steps.push({ id: "experience", label: "Work", icon: <Briefcase className="h-4 w-4" />, desc: "Your professional history" });
    if (template.sections.includes("education")) steps.push({ id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" />, desc: "Your academic background" });
    if (template.sections.includes("skills")) steps.push({ id: "skills", label: "Skills", icon: <Zap className="h-4 w-4" />, desc: "Technical & soft skills" });
    steps.push({ id: "preview", label: "Finish", icon: <Eye className="h-4 w-4" />, desc: "Review and download" });
    return steps;
  }, [template]);

  const activeStep = dynamicSteps[currentStep];

  // --- Handlers ---
  const addExperience = () => {
    setFormData({ ...formData, experience: [{ id: crypto.randomUUID(), title: "", company: "", location: "", start: "", end: "", current: false, bullets: "" }, ...formData.experience] });
  };

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 2000));
    setDownloading(false);
  };

  if (isApiLoading || !template) return <SkeletonBuilder />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black flex flex-col font-sans">
      {/* SaaS Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-6 w-[1px] bg-border hidden sm:block" />
            <div>
              <h1 className="text-sm font-semibold truncate max-w-[150px]">{template.name}</h1>
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="text-[10px] flex items-center gap-1 text-muted-foreground animate-pulse"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>
                ) : (
                  <span className="text-[10px] flex items-center gap-1 text-emerald-500 font-medium"><CloudCheck className="h-3 w-3" /> Saved to cloud</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex rounded-full bg-background shadow-sm border-primary/20 hover:border-primary/50">
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" /> AI Optimizer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Analyze with Blitz AI</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFormData(defaultResumeForm)} className="text-destructive">Reset All Data</DropdownMenuItem>
                <DropdownMenuItem>Import JSON</DropdownMenuItem>
                <DropdownMenuItem>Toggle Theme</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="w-full bg-secondary/30 h-[3px]">
          <motion.div className="bg-primary h-full" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / dynamicSteps.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-4 md:p-8">
        {/* Input Side */}
        <div className="space-y-10 pb-20">
          {/* Mobile Stepper */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:hidden">
            {dynamicSteps.map((s, i) => (
              <Badge key={s.id} variant={i === currentStep ? "default" : "secondary"} className="whitespace-nowrap cursor-pointer px-3 py-1" onClick={() => setCurrentStep(i)}>
                {s.label}
              </Badge>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <div key={activeStep?.id}>
              {activeStep?.id === "personal" && (
                <StepWrapper title="Personal Details" description={activeStep.desc}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-card border rounded-2xl shadow-sm">
                    <div className="space-y-2 col-span-full md:col-span-1">
                      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                      <Input className="h-11 rounded-xl" placeholder="John Doe" value={formData.personalInfo.fullName} onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, fullName: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email</label>
                      <Input className="h-11 rounded-xl" placeholder="john@example.com" value={formData.personalInfo.email} onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, email: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Job Title</label>
                      <Input className="h-11 rounded-xl" placeholder="Full Stack Developer" value={formData.personalInfo.title} onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, title: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Phone</label>
                      <Input className="h-11 rounded-xl" placeholder="+1 234 567 890" value={formData.personalInfo.phone} onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, phone: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Location</label>
                      <Input className="h-11 rounded-xl" placeholder="New York, USA" value={formData.personalInfo.location} onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, location: e.target.value}})} />
                    </div>
                  </div>
                </StepWrapper>
              )}

              {activeStep?.id === "experience" && (
                <StepWrapper title="Work Experience" description={activeStep.desc}>
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      <motion.div key={exp.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border rounded-2xl bg-card shadow-sm hover:border-primary/30 transition-colors relative group">
                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setFormData({...formData, experience: formData.experience.filter(e => e.id !== exp.id)})}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Company Name" className="font-semibold" value={exp.company} onChange={(e) => {
                            const newExp = [...formData.experience]; newExp[index].company = e.target.value; setFormData({...formData, experience: newExp});
                          }} />
                          <Input placeholder="Role / Position" value={exp.title} onChange={(e) => {
                            const newExp = [...formData.experience]; newExp[index].title = e.target.value; setFormData({...formData, experience: newExp});
                          }} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <Input placeholder="Start Date" value={exp.start} onChange={(e) => {
                            const newExp = [...formData.experience]; newExp[index].start = e.target.value; setFormData({...formData, experience: newExp});
                          }} />
                          <Input placeholder="End Date" disabled={exp.current} value={exp.end} onChange={(e) => {
                            const newExp = [...formData.experience]; newExp[index].end = e.target.value; setFormData({...formData, experience: newExp});
                          }} />
                        </div>
                        <Textarea className="mt-4 min-h-[120px] bg-muted/30" placeholder="List your key impacts... (Use bullet points)" value={exp.bullets} onChange={(e) => {
                          const newExp = [...formData.experience]; newExp[index].bullets = e.target.value; setFormData({...formData, experience: newExp});
                        }} />
                      </motion.div>
                    ))}
                    <Button variant="outline" className="w-full h-14 border-dashed rounded-2xl hover:bg-primary/5 hover:text-primary transition-all" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" /> Add Work Experience
                    </Button>
                  </div>
                </StepWrapper>
              )}

              {/* ... Other steps logic (Education/Skills) would follow similar enhanced pattern ... */}
              
              {activeStep?.id === "skills" && (
                <StepWrapper title="Skills & Competencies">
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Add skill (e.g. React, Python, Leadership)" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                             setFormData({...formData, skills: [...formData.skills, skillInput.trim()]});
                             setSkillInput("");
                          }
                        }
                      }} />
                      <Button onClick={() => {
                        if (skillInput.trim()) {
                          setFormData({...formData, skills: [...formData.skills, skillInput.trim()]});
                          setSkillInput("");
                        }
                      }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((s, i) => (
                        <Badge key={i} className="px-3 py-1 bg-secondary text-secondary-foreground hover:bg-destructive hover:text-white transition-all cursor-pointer group" onClick={() => setFormData({...formData, skills: formData.skills.filter(sk => sk !== s)})}>
                          {s} <Trash2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </StepWrapper>
              )}
              
              {activeStep?.id === "preview" && (
                <StepWrapper title="Review & Export" description="Almost there! Check if everything looks perfect.">
                  <div className="p-12 bg-white rounded-2xl border shadow-xl text-center space-y-6">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Your Resume is Ready</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">Download your resume in high-quality PDF format compatible with ATS systems.</p>
                    <Button className="w-full h-12 rounded-xl text-lg shadow-lg shadow-primary/25" onClick={handleDownload} disabled={downloading}>
                      {downloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-5 w-5" />} Download PDF
                    </Button>
                  </div>
                </StepWrapper>
              )}
            </div>
          </AnimatePresence>

          {/* Persistent Navigation */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t lg:relative lg:bg-transparent lg:border-0 lg:p-0">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Button variant="ghost" disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="rounded-xl h-11 px-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              {currentStep < dynamicSteps.length - 1 && (
                <Button onClick={() => setCurrentStep(s => s + 1)} className="rounded-xl h-11 px-8 shadow-md">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Floating Mini Preview (Desktop) */}
        <aside className="hidden lg:block sticky top-24 self-start h-[calc(100vh-120px)] overflow-hidden rounded-2xl border bg-white shadow-2xl group">
          <div className="absolute inset-0 bg-muted/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 h-full flex flex-col scale-[0.85] origin-top">
             <div className="border-b-4 border-primary pb-4 mb-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">{formData.personalInfo.fullName || "Your Name"}</h2>
                <p className="text-primary font-bold text-sm tracking-widest uppercase">{formData.personalInfo.title || "Target Role"}</p>
             </div>
             <div className="space-y-4 flex-1">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-3/4 bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded" />
                <div className="mt-6 space-y-2">
                   <div className="h-3 w-20 bg-primary/20 rounded" />
                   <div className="h-2 w-full bg-muted rounded" />
                   <div className="h-2 w-full bg-muted rounded" />
                </div>
             </div>
             <div className="pt-4 border-t text-[8px] text-muted-foreground uppercase flex justify-between">
                <span>Real-time Preview</span>
                <span>{template.name}</span>
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function SkeletonBuilder() {
  return (
    <div className="min-h-screen p-8 space-y-8 animate-pulse">
      <div className="h-16 w-full bg-muted rounded-2xl" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          <div className="h-12 w-48 bg-muted rounded-lg" />
          <div className="h-64 w-full bg-muted rounded-2xl" />
        </div>
        <div className="h-full w-full bg-muted rounded-2xl hidden lg:block" />
      </div>
    </div>
  );
}