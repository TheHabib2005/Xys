export type AnalysisType = "ats_scan" | "job_match";
export type AnalysisStatus = "idle" | "uploading" | "processing" | "completed" | "error";
export type ResumeTemplate = "ats" | "modern" | "professional";

export interface UploadPayload {
  resumeFile: File | null;
  analysisType: AnalysisType;
  jobTitle: string;
  jobDescription: string;
  keyRequirements: string;
}

export interface FeedbackCard {
  id: string;
  title: string;
  details: string;
  missing: string[];
  type: "skills" | "metrics" | "formatting" | "keywords" | "grammar";
}

export interface AnalysisResult {
  id: string;
  fileId: string;
  atsScore: number;
  skillMatchScore: number;
  missingKeywords: string[];
  feedback: FeedbackCard[];
  suggestions: string[];
  sections: {
    summary: string;
    experience: string[];
    skills: string[];
    education: string[];
  };
}
export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  analysisType: string;
  resumeText: string;
  resumeUrl: string | null;
  jobData: Record<string, any>;
  result: {
    overall_score: number;
    summary: string;
  };
  createdAt: string;
}