"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowLeft, Download, Sparkles, 
  ShieldCheck, Zap, ArrowUpRight, FileText, 
  Layers, Lightbulb, Target, AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SaveAnalysisResult from "./SaveAnalysisResult";

interface AnalysisPageProps {
  data: any;
}

export default function AnalysisDetails({ data }: AnalysisPageProps) {
  const [activeTab, setActiveTab] = useState("overview");


  if (!data) return <AnalysisSkeleton />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Button variant="ghost" size="sm" className="h-8 rounded-full px-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <span className="text-border">/</span>
              <span className="text-primary font-medium">ATS Scan Result</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Resume <span className="text-primary">Analysis</span>
            </h1>
          </div>
          <div className="flex gap-3">
          <SaveAnalysisResult id={data.id}/>
            <Button variant="outline" className="rounded-xl border-border/60">
              <Download className="mr-2 h-4 w-4" /> Generate Report
            </Button>
            <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 h-4 w-4" /> Optimize with AI
            </Button>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <ScoreRing score={data.overall_score} />
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold">Overall ATS Score</h3>
                  <Badge variant="success">Level: {data.overall_score > 80 ? 'High' : 'Medium'}</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">{data.summary}</p>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl border bg-card p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Scan Vitals
                </h4>
                <div className="space-y-4">
                {data.vitals.map((vital: any) => (
                    <div key={vital.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground uppercase font-semibold">{vital.category}</span>
                        <span className="font-bold">{vital.score}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(vital.score / 10) * 100}%` }}
                        className={`h-full rounded-full ${vital.score >= 8 ? 'bg-primary' : 'bg-amber-500'}`}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
            {[
                { id: 'overview', label: 'Overview', icon: Layers },
                { id: 'keywords', label: 'Keyword Cloud', icon: Target },
                { id: 'audit', label: 'Technical Audit', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && <OverviewTab data={data} />}
              {activeTab === 'keywords' && <KeywordsTab data={data} />}
              {activeTab === 'audit' && <AuditTab data={data} />}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sticky top-8">
                <h4 className="font-semibold mb-6 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Quick Metrics
                </h4>
                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b pb-4">
                        <span className="text-sm text-muted-foreground">Readability</span>
                        <div className="text-right">
                            <div className="text-xl font-bold">{data.technical_audit.readability.flesch_kincaid_score}</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase">Flesch Score</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end border-b pb-4">
                        <span className="text-sm text-muted-foreground">Achievement Ratio</span>
                        <div className="text-right">
                            <div className="text-xl font-bold">{data.technical_audit.action_verbs_usage.achievement_ratio * 100}%</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase">Action Verbs</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-sm text-muted-foreground">Skills Match</span>
                        <div className="text-right">
                            <div className="text-xl font-bold text-primary">{data.technical_audit.skills_relevance.expected_vs_found * 100}%</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase">Relevance</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function OverviewTab({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-3xl border border-primary/10 bg-primary/[0.02] p-8">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> AI Recommendation
        </h4>
        <p className="text-muted-foreground leading-relaxed">
          {data.technical_audit.achievements_vs_responsibilities.recommendation} 
          Focus on adding <span className="text-foreground font-bold italic">Testing frameworks</span> to hit the next tier.
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" /> 
            Critical Improvements
        </h4>
        {data.critical_improvements.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl border bg-card hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <Badge variant={item.impact === 'high' ? 'warning' : 'info'}>Impact: {item.impact}</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Confidence: {item.confidence}</span>
            </div>
            <h5 className="font-bold text-lg mb-2">{item.title}</h5>
            <p className="text-sm text-muted-foreground mb-4">{item.recommendation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-red-600 uppercase mb-1">Current</div>
                    <div className="text-xs font-mono line-through opacity-60">{item.example_before}</div>
                </div>
                <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Suggested</div>
                    <div className="text-xs font-mono">{item.example_after}</div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function KeywordsTab({ data }: { data: any }) {
  return (
    <div className="space-y-8 bg-card p-8 rounded-3xl border">
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Keywords (Frequency)</h4>
        <div className="flex flex-wrap gap-3">
          {data.keyword_cloud.top_keywords.map((kw: any) => (
            <div key={kw.keyword} className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm font-medium flex items-center gap-2">
              <span className="text-primary font-bold">x{kw.frequency}</span> {kw.keyword}
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Job Match Detection</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.keyword_cloud.job_keyword_matches.map((kw: any) => (
            <div key={kw.keyword} className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="font-bold">{kw.keyword}</span>
                    {kw.found ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground">Evidence: "{kw.evidence[0]}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AuditTab({ data }: { data: any }) {
    const audit = data.technical_audit;
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border bg-card p-8">
                <h4 className="font-bold mb-6">Format Compliance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                            <span className="text-sm">Text Extractable</span>
                            {audit.format_compliance.pdf_text_extractable ? <Badge variant="success">Yes</Badge> : <Badge variant="warning">No</Badge>}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                            <span className="text-sm">Font Compatibility</span>
                            {audit.format_compliance.font_issues.length === 0 ? <Badge variant="success">Clean</Badge> : <Badge variant="warning">Issues</Badge>}
                        </div>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-2xl flex flex-col justify-center">
                        <div className="text-xs font-bold text-primary uppercase mb-1">Parser Note</div>
                        <p className="text-sm text-muted-foreground italic">"{audit.format_compliance.notes}"</p>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border bg-card p-8">
                <h4 className="font-bold mb-6">Action Verbs Evidence</h4>
                <div className="flex flex-wrap gap-2">
                    {audit.action_verbs_usage.examples.map((verb: string) => (
                        <span key={verb} className="px-3 py-1 bg-secondary rounded-lg text-sm font-mono">{verb}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="64" cy="64" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
          strokeDasharray={circumference} strokeLinecap="round" className="text-primary" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{score}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-bold">ATS Score</span>
      </div>
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 animate-pulse text-center">
        <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4" />
        <div className="h-8 w-64 bg-muted rounded-lg mx-auto" />
        <div className="h-4 w-96 bg-muted rounded-lg mx-auto" />
      </div>
    </div>
  );
}

function Badge({ children, variant = "info", className = "" }: any) {
  const variants = {
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
}