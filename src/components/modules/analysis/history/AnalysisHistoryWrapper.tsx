'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
  Clock,
  ShieldCheck,
  Cpu,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Types (based on API response)
// ----------------------------------------------------------------------
interface AnalysisHistoryItem {
  id: string;
  userId: string;
  analysisType: string;
  resumeText: string;
  resumeUrl: string | null;
  jobData: Record<string, any>; // can contain title, etc.
  result: {
    overall_score: number;
    summary: string;
    // ... other fields not needed for list
  };
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: AnalysisHistoryItem[];
  meta: { timestamp: string };
}

// ----------------------------------------------------------------------
// Skeleton Row Component
// ----------------------------------------------------------------------
function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border/40">
      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="hidden md:block col-span-2">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="hidden md:block col-span-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-1.5 w-16 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function AnalysisHistoryWrapper() {
  const { user } = useUser();
  const router = useRouter();
  const cacheKey = `analysis-history-${user?.id}`;

  const { data, isFetching, isError } = useApiQuery<ApiResponse>(
    [cacheKey],
    '/analyzer/get-analysis-history',
    'axios'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract history array
  const history = useMemo(() => data?.data || [], [data]);

  // Filter and sort history
  const filteredAndSorted = useMemo(() => {
    let items = [...history as any];

    // Filter by search query (case-insensitive, check resumeText and job title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        const inResume = item.resumeText?.toLowerCase().includes(q);
        const inJobTitle = item.jobData?.title?.toLowerCase().includes(q);
        return inResume || inJobTitle;
      });
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        // score
        const scoreA = a.result?.overall_score || 0;
        const scoreB = b.result?.overall_score || 0;
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      }
    });

    return items;
  }, [history, searchQuery, sortBy, sortOrder]);

  // Toggle sort order or change sort field
  const handleSort = (field: 'date' | 'score') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get a display name for the analysis
  const getDisplayName = (item: AnalysisHistoryItem) => {
    if (item.jobData?.title) {
      return item.jobData.title;
    }
    // Fallback: use first few words of resumeText
    const words = item.resumeText?.split(' ').slice(0, 5).join(' ') || 'Untitled';
    return words.length > 30 ? words.substring(0, 30) + '…' : words;
  };

  // Get analysis type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ATS_SCAN':
        return { label: 'ATS Scan', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'GENERAL':
        return { label: 'General', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
      default:
        return { label: type, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    }
  };

  // Loading skeleton
  if (isFetching) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 col-span-3" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-bold text-lg">Failed to load analysis history</h3>
        <p className="text-sm text-muted-foreground mb-4">Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Analysis History</h1>
        <p className="mt-1 text-muted-foreground">View and manage your resume analysis reports</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by content or job title..."
            className="pl-10 rounded-xl bg-card border-border/60 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by: {sortBy === 'date' ? 'Date' : 'Score'} {sortOrder === 'desc' ? '↓' : '↑'}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'score')}>
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="score">ATS Score</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                {sortOrder === 'desc' ? 'Ascending' : 'Descending'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="secondary" className="px-4 py-2 rounded-full border-border/50">
            Total: {filteredAndSorted.length}
          </Badge>
        </div>
      </div>

      {/* List Container */}
      <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-xs uppercase font-bold tracking-widest text-muted-foreground">
          <div className="col-span-6 md:col-span-5">Analysis</div>
          <div className="hidden md:block col-span-2">Date</div>
          <div className="hidden md:block col-span-2">ATS Score</div>
          <div className="col-span-6 md:col-span-3 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          <AnimatePresence initial={false}>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((item, index) => {
                const typeBadge = getTypeBadge(item.analysisType);
                const displayName = getDisplayName(item);
                const score = item.result?.overall_score ?? 0;
                const scoreColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/40 transition-colors group"
                  >
                    {/* Name & Type */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{displayName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={cn('text-[10px] px-2 py-0 h-5', typeBadge.className)}>
                            {typeBadge.label}
                          </Badge>
                          {score >= 70 && (
                            <span className="flex items-center text-[10px] text-emerald-500 font-bold">
                              <ShieldCheck className="h-3 w-3 mr-1" /> OPTIMIZED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden md:block col-span-2 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="hidden md:block col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            className={cn(
                              'h-full',
                              score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            )}
                          />
                        </div>
                        <span className={cn('text-xs font-bold', scoreColor)}>{score}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-6 md:col-span-3 flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => router.push(`/analysis/${item.id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button> 
                      {item.resumeUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          asChild
                        >
                          <a href={item.resumeUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem className="gap-2" onClick={() => router.push(`/analysis/${item.id}`)}>
                            <Cpu className="h-4 w-4 text-blue-500" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-lg">No analyses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search.' : 'Upload a resume to get started.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Stats */}
      {filteredAndSorted.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Total Analyses</p>
                <p className="text-xl font-bold">{filteredAndSorted.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Average Score</p>
                <p className="text-xl font-bold">
                  {Math.round(
                    filteredAndSorted.reduce((acc, item) => acc + (item.result?.overall_score || 0), 0) /
                      filteredAndSorted.length
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase opacity-80 tracking-tighter">Plan</p>
                <p className="text-xl font-bold italic">Pro Analyst</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-full font-bold">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}