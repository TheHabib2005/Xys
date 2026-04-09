"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BlockStatus = "published" | "draft" | "archived";
type BlockType = "blog" | "issue" | "template";

type BlockItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: BlockStatus;
  type: BlockType;
  category: string;
  author: string;
  tags: string[];
  updatedAt: string;
  slug: string;
};

const BLOCKS: BlockItem[] = [
  {
    id: "1",
    title: "How to Build an ATS Friendly Resume",
    summary: "Write a resume that passes ATS and still feels human.",
    content:
      "Use keyword-rich headlines, quantified impact bullets, simple formatting, and role-specific summary sections. Keep the structure predictable for recruiters and parsers.",
    status: "published",
    type: "template",
    category: "Resume",
    author: "Admin",
    tags: ["resume", "ats", "recruiter", "template"],
    updatedAt: "2026-04-02",
    slug: "/templates/ats-friendly-resume",
  },
  {
    id: "2",
    title: "Frontend Interview DSA Roadmap",
    summary: "A practical roadmap for frontend developers preparing for interviews.",
    content:
      "Cover arrays, strings, recursion, linked lists, trees, graphs, dynamic programming, and daily problem practice with a clear progression.",
    status: "published",
    type: "blog",
    category: "Frontend",
    author: "Habib",
    tags: ["javascript", "dsa", "frontend", "interview"],
    updatedAt: "2026-03-30",
    slug: "/blogs/frontend-dsa-roadmap",
  },
  {
    id: "3",
    title: "Issue Tracker Best Practices",
    summary: "How to structure issue posts so users can solve problems faster.",
    content:
      "Use clear title, reproduction steps, expected result, actual result, environment info, and tags. This makes search and support flow much easier.",
    status: "published",
    type: "issue",
    category: "Support",
    author: "Support Team",
    tags: ["issue", "bug", "support", "workflow"],
    updatedAt: "2026-03-28",
    slug: "/issues/best-practices",
  },
  {
    id: "4",
    title: "Resume Summary Examples for Developers",
    summary: "Examples of concise professional summaries that convert better.",
    content:
      "Lead with experience level, stack, strongest contributions, and target role. Keep it short and strong with measurable impact.",
    status: "draft",
    type: "template",
    category: "Resume",
    author: "Admin",
    tags: ["summary", "developer", "cv", "examples"],
    updatedAt: "2026-03-26",
    slug: "/templates/resume-summary-examples",
  },
  {
    id: "5",
    title: "How to Improve Portfolio Projects",
    summary: "Make your projects look production-ready for recruiters.",
    content:
      "Add authentication, search, filtering, pagination, loading states, accessibility, and realistic data models. Show deployment and clean UX.",
    status: "published",
    type: "blog",
    category: "Career",
    author: "Habib",
    tags: ["portfolio", "projects", "react", "jobs"],
    updatedAt: "2026-04-01",
    slug: "/blogs/improve-portfolio-projects",
  },
  {
    id: "6",
    title: "AI Search for Blog Listing Pages",
    summary: "Semantic search pattern for content-heavy pages.",
    content:
      "Combine local fuzzy scoring with AI rerank. Show suggestions, highlight matching cards, and allow click-to-focus behavior.",
    status: "published",
    type: "blog",
    category: "AI",
    author: "Admin",
    tags: ["ai search", "semantic", "ranking", "search"],
    updatedAt: "2026-04-03",
    slug: "/blogs/ai-search-blog-listing",
  },
  {
    id: "7",
    title: "Template Search Page UX Patterns",
    summary: "How to make template search feel fast and intuitive.",
    content:
      "Use search modal, instant suggestions, visible selection state, and filters like status and type. Keep the flow minimal and clear.",
    status: "published",
    type: "template",
    category: "UX",
    author: "Design Team",
    tags: ["ux", "search", "modal", "templates"],
    updatedAt: "2026-04-04",
    slug: "/templates/search-ux-patterns",
  },
  {
    id: "8",
    title: "How to Write a Strong Blog Title",
    summary: "Titles that improve CTR and readability.",
    content:
      "Use clarity, specificity, and intent keywords. Avoid vague phrasing and make the benefit obvious in one glance.",
    status: "archived",
    type: "blog",
    category: "Content",
    author: "Content Team",
    tags: ["blog", "seo", "title", "content"],
    updatedAt: "2026-03-21",
    slug: "/blogs/strong-blog-title",
  },
  {
    id: "9",
    title: "Project Status Filtering Guide",
    summary: "Filter content by published, draft, and archived state.",
    content:
      "Use a stable status taxonomy, keep labels consistent, and let users switch views without losing context or selected item focus.",
    status: "published",
    type: "issue",
    category: "System",
    author: "Admin",
    tags: ["filter", "status", "ui", "search"],
    updatedAt: "2026-04-04",
    slug: "/issues/status-filtering-guide",
  },
  {
    id: "10",
    title: "Modern Resume Template Listing",
    summary: "A modern listing page for templates with strong visual hierarchy.",
    content:
      "Display template cards with tags, category, updated date, and quick actions. Make the page easy to scan and easy to search.",
    status: "published",
    type: "template",
    category: "Templates",
    author: "Design Team",
    tags: ["resume", "listing", "template", "ui"],
    updatedAt: "2026-04-05",
    slug: "/templates/modern-listing",
  },
  {
    id: "11",
    title: "Bug Reporting Checklist for Users",
    summary: "A clear structure for issue submission.",
    content:
      "Ask for title, environment, steps to reproduce, screenshots, and expected outcome. Better input means better support resolution.",
    status: "draft",
    type: "issue",
    category: "Support",
    author: "Support Team",
    tags: ["bug", "checklist", "issue", "support"],
    updatedAt: "2026-03-25",
    slug: "/issues/bug-reporting-checklist",
  },
  {
    id: "12",
    title: "Recruiter Friendly Portfolio Checklist",
    summary: "What recruiters actually notice on a portfolio page.",
    content:
      "Clear projects, real stack, working demos, concise case studies, good typography, and easy navigation matter more than flashy visuals.",
    status: "published",
    type: "blog",
    category: "Career",
    author: "Habib",
    tags: ["portfolio", "recruiter", "career", "checklist"],
    updatedAt: "2026-04-06",
    slug: "/blogs/recruiter-friendly-portfolio",
  },
  {
    id: "13",
    title: "Search Suggestions Interaction Model",
    summary: "How to make suggestions feel instant and useful.",
    content:
      "Show top matches quickly, allow keyboard navigation, use score labels, and keep the selected result visible after click.",
    status: "published",
    type: "blog",
    category: "UX",
    author: "Design Team",
    tags: ["suggestions", "interaction", "search", "modal"],
    updatedAt: "2026-04-06",
    slug: "/blogs/search-suggestions-interaction",
  },
  {
    id: "14",
    title: "Template Card Layout System",
    summary: "A consistent layout system for listing cards.",
    content:
      "Use title, summary, status badge, category, tags, and action area. Keep spacing consistent across all cards.",
    status: "archived",
    type: "template",
    category: "Design System",
    author: "Admin",
    tags: ["layout", "cards", "template", "design-system"],
    updatedAt: "2026-03-18",
    slug: "/templates/card-layout-system",
  },
  {
    id: "15",
    title: "Content Search with Page Context",
    summary: "Rank results based on the current page perspective.",
    content:
      "Blog pages, issue pages, and template pages should behave differently. Page context helps the search feel smarter and more relevant.",
    status: "published",
    type: "blog",
    category: "Search",
    author: "Habib",
    tags: ["context", "page-aware", "ranking", "search"],
    updatedAt: "2026-04-07",
    slug: "/blogs/content-search-page-context",
  },
];

const STATUS_OPTIONS: Array<{ label: string; value: "all" | BlockStatus }> = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean);
}

function scoreBlock(query: string, block: BlockItem) {
  const q = normalizeText(query);
  if (!q) return 0;

  const qTokens = tokenize(q);
  const title = normalizeText(block.title);
  const summary = normalizeText(block.summary);
  const content = normalizeText(block.content);
  const category = normalizeText(block.category);
  const tags = normalizeText(block.tags.join(" "));
  const status = normalizeText(block.status);
  const type = normalizeText(block.type);

  let score = 0;

  if (title === q) score += 55;
  if (title.includes(q)) score += 32;
  if (summary.includes(q)) score += 18;
  if (content.includes(q)) score += 12;
  if (tags.includes(q)) score += 20;
  if (category.includes(q)) score += 10;
  if (status.includes(q)) score += 6;
  if (type.includes(q)) score += 6;

  for (const token of qTokens) {
    if (!token) continue;
    if (title.startsWith(token)) score += 10;
    if (title.includes(token)) score += 8;
    if (summary.includes(token)) score += 6;
    if (content.includes(token)) score += 4;
    if (tags.includes(token)) score += 9;
    if (category.includes(token)) score += 5;
    if (status.includes(token)) score += 2;
    if (type.includes(token)) score += 2;
  }

  const uniqueHits = new Set(
    [title, summary, content, category, tags, status, type].flatMap((field) =>
      qTokens.filter((token) => token && field.includes(token))
    )
  ).size;

  score += uniqueHits * 3;

  return Math.min(100, Math.round(score));
}

function getMatchFields(query: string, block: BlockItem) {
  const q = normalizeText(query);
  if (!q) return ["page"];
  const fields: string[] = [];
  if (normalizeText(block.title).includes(q)) fields.push("title");
  if (normalizeText(block.summary).includes(q)) fields.push("summary");
  if (normalizeText(block.content).includes(q)) fields.push("content");
  if (normalizeText(block.tags.join(" ")).includes(q)) fields.push("tags");
  if (normalizeText(block.category).includes(q)) fields.push("category");
  if (normalizeText(block.status).includes(q)) fields.push("status");
  if (normalizeText(block.type).includes(q)) fields.push("type");
  return fields.length ? fields : ["semantic"];
}

export default function BlogSearchExperiencePage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlockStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(BLOCKS[0].id);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredByStatus = useMemo(() => {
    return statusFilter === "all"
      ? BLOCKS
      : BLOCKS.filter((block) => block.status === statusFilter);
  }, [statusFilter]);

  const rankedResults = useMemo(() => {
    const q = query.trim();

    if (!q) {
      return [...filteredByStatus].sort((a, b) => Number(a.id) - Number(b.id));
    }

    return [...filteredByStatus]
      .map((block) => ({
        block,
        score: scoreBlock(q, block),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.block);
  }, [filteredByStatus, query]);

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return filteredByStatus.slice(0, 5);

    return [...filteredByStatus]
      .map((block) => ({
        block,
        score: scoreBlock(q, block),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.block);
  }, [filteredByStatus, query]);

  const activeBlock =
    BLOCKS.find((block) => block.id === selectedId) ?? rankedResults[0] ?? BLOCKS[0];

  useEffect(() => {
    if (isModalOpen) {
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      const first = filteredByStatus[0] ?? BLOCKS[0];
      setSelectedId(first.id);
      return;
    }

    const top = rankedResults[0];
    if (top) setSelectedId(top.id);
  }, [filteredByStatus, query, rankedResults]);

  const openCard = (block: BlockItem) => {
    setSelectedId(block.id);
    requestAnimationFrame(() => {
      cardRefs.current[block.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const clearSearch = () => {
    setQuery("");
    setStatusFilter("all");
    setSelectedId(BLOCKS[0].id);
  };

  const renderPercent = (block: BlockItem) => {
    if (!query.trim()) return 0;
    return scoreBlock(query, block);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr] md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                AI search demo
              </p>
              <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
                Search blocks with AI-style suggestions
              </h1>
              
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Data blocks</span>
                <span>{BLOCKS.length}</span>
              </div>
              <div className="mt-2 text-sm text-slate-200">
                AI ranking: <span className="font-medium text-cyan-300">local semantic scoring</span>
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Groq integration can be added later on the same UI.
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-cyan-500 px-5 py-4 font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              Search
            </button>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((item) => {
                const active = statusFilter === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={clearSearch}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white">{rankedResults.length}</span> cards
          </p>
          <p className="text-sm text-slate-500">
            Selected: <span className="text-slate-200">{activeBlock.title}</span>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rankedResults.map((block) => {
            const selected = block.id === activeBlock.id;
            const percent = renderPercent(block);

            return (
              <article
                key={block.id}
                ref={(el) => {
                  cardRefs.current[block.id] = el;
                }}
                onClick={() => openCard(block)}
                className={cn(
                  "cursor-pointer rounded-3xl border p-5 transition duration-200",
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-950/20"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {block.type}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          block.status === "published" && "bg-emerald-500/15 text-emerald-300",
                          block.status === "draft" && "bg-amber-500/15 text-amber-300",
                          block.status === "archived" && "bg-slate-500/20 text-slate-300"
                        )}
                      >
                        {block.status}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold leading-tight">{block.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{block.summary}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {block.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm leading-6 text-slate-300">{block.content}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    Category
                    <div className="mt-1 text-sm text-slate-200">{block.category}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    Match rate
                    <div className="mt-1 text-sm text-cyan-300">{query.trim() ? `${percent}%` : "—"}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{block.updatedAt}</span>
                  <span>{selected ? "Selected" : "Click to focus"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                  AI search modal
                </p>
                <h3 className="mt-1 text-lg font-semibold">Search within the current page</h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type keyword, phrase, or intent..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-base outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const top = suggestions[0];
                    if (top) openCard(top);
                    setIsModalOpen(false);
                  }}
                  className="rounded-2xl bg-cyan-500 px-5 py-4 font-medium text-slate-950 hover:bg-cyan-400"
                >
                  Apply
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((item) => {
                  const active = statusFilter === item.value;
                  return (
                    <button
                      key={`modal-${item.value}`}
                      type="button"
                      onClick={() => setStatusFilter(item.value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition",
                        active
                          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">
                    AI-based suggestions powered by Groq-ready semantic scoring
                  </p>
                  <p className="text-xs text-slate-500">Query: {query.trim() ? `"${query}"` : "type something"}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Each item shows a match percentage based on title, summary, content, tags, category, status, and type.
                </p>
              </div>

              <div className="max-h-[420px] overflow-auto rounded-3xl border border-white/10">
                {query.trim() ? (
                  suggestions.length > 0 ? (
                    suggestions.map((block, index) => {
                      const percent = scoreBlock(query, block);
                      const matchedFields = getMatchFields(query, block);

                      return (
                        <button
                          key={`suggestion-${block.id}`}
                          type="button"
                          onClick={() => {
                            openCard(block);
                            setIsModalOpen(false);
                          }}
                          className="flex w-full items-start justify-between gap-4 border-b border-white/5 bg-slate-950 px-4 py-4 text-left transition hover:bg-white/5"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">#{index + 1}</span>
                              <h4 className="font-medium text-white">{block.title}</h4>
                            </div>
                            <p className="mt-1 text-sm text-slate-400">{block.summary}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {matchedFields.map((field) => (
                                <span
                                  key={field}
                                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                                >
                                  matched: {field}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-medium text-cyan-300">
                              {percent}%
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                              {block.status}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center text-slate-400">
                      No suggestion matched this query.
                    </div>
                  )
                ) : (
                  <div className="px-4 py-10 text-center text-slate-400">
                    Start typing to see AI-based suggestions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}