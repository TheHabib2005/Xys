'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Search, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Cpu
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock Data ---
const MOCK_RESUMES = [
  { id: "1", name: "Senior Frontend Engineer - Google", date: "2026-03-12", score: 94, status: "AI Optimized" },
  { id: "2", name: "Fullstack Developer - Vercel", date: "2026-03-10", score: 88, status: "Draft" },
  { id: "3", name: "Product Designer - Meta", date: "2026-03-05", score: 91, status: "AI Optimized" },
];

export default function HistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResumes = MOCK_RESUMES.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page Header */}
      <header className="border-b bg-card/30 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Clock className="text-primary-foreground h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Asset Vault</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Blitz AI / History</p>
            </div>
          </div>
          
          <Button onClick={() => router.push("/create")} className="rounded-full px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> New Resume
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search resumes..." 
              className="pl-10 rounded-xl bg-card border-border/60 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-4 py-1.5 rounded-full border-border/50">Total: {MOCK_RESUMES.length}</Badge>
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary bg-primary/5">Premium Storage: Active</Badge>
          </div>
        </div>

        {/* History Table/List */}
        <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            <div className="col-span-6 md:col-span-5">Document Name</div>
            <div className="hidden md:block col-span-2">Last Modified</div>
            <div className="hidden md:block col-span-2">ATS Score</div>
            <div className="col-span-6 md:col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-border/40">
            <AnimatePresence>
              {filteredResumes.map((resume, index) => (
                <motion.div 
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/40 transition-colors group"
                >
                  {/* Name & Type */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate">{resume.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {resume.status === "AI Optimized" ? (
                          <span className="flex items-center text-[10px] text-emerald-500 font-bold">
                            <ShieldCheck className="h-3 w-3 mr-1" /> OPTIMIZED
                          </span>
                        ) : (
                          <span className="flex items-center text-[10px] text-amber-500 font-bold">
                            <Clock className="h-3 w-3 mr-1" /> DRAFT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block col-span-2 text-xs text-muted-foreground font-medium">
                    {new Date(resume.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Score */}
                  <div className="hidden md:block col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${resume.score}%` }}
                          className={`h-full ${resume.score > 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        />
                      </div>
                      <span className="text-xs font-bold">{resume.score}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-6 md:col-span-3 flex justify-end items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => router.push(`/builder/${resume.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem className="gap-2">
                          <Cpu className="h-4 w-4 text-blue-500" /> Run AI Audit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete Asset
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredResumes.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-bold text-lg">No assets found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or create a new document.</p>
            </div>
          )}
        </div>

        {/* Stats / Storage Footer */}
        <footer className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-card border border-border/60 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-5 w-5" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Documents</p>
               <p className="text-xl font-bold">12 / 50</p>
             </div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border/60 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu className="h-5 w-5" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">AI Credits</p>
               <p className="text-xl font-bold">840</p>
             </div>
          </div>
          <div className="p-5 rounded-2xl bg-primary text-primary-foreground flex items-center justify-between">
             <div>
               <p className="text-xs font-bold uppercase opacity-80 tracking-tighter">Current Plan</p>
               <p className="text-xl font-bold italic">Pro Integrator</p>
             </div>
             <Button variant="secondary" size="sm" className="rounded-full font-bold">Manage</Button>
          </div>
        </footer>
      </main>
    </div>
  );
}