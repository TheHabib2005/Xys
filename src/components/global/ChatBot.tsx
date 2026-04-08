'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState, useCallback, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
  Check,
  Copy,
  Wrench,
  FileText,
  Briefcase,
  ArrowUp,
  X,
  MessageSquare,
} from 'lucide-react';

type AnyMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: Array<any>;
  content?: string;
};

type AnyToolInvocation = {
  toolName?: string;
  toolCallId?: string;
  state?: string;
  result?: any;
  output?: any;
  [key: string]: any;
};

// ----------------------------------------------------------------------
//  UTILITY: Copy to Clipboard
// ----------------------------------------------------------------------
const useCopyToClipboard = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, []);

  return { copiedId, copy };
};

// ----------------------------------------------------------------------
//  TOOL CALL DISPLAY COMPONENT
// ----------------------------------------------------------------------
const ToolCallDisplay = ({ toolInvocation }: { toolInvocation: AnyToolInvocation }) => {
  const toolName = toolInvocation?.toolName || 'tool';
  const result = toolInvocation?.result ?? toolInvocation?.output;
  const state = toolInvocation?.state;
  const isComplete =
    state === 'result' ||
    state === 'output-available' ||
    state === 'done' ||
    result !== undefined;

  if (!isComplete) {
    return (
      <div className="mt-3 rounded-xl border border-blue-200/50 bg-blue-50/50 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/30">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Wrench className="h-3.5 w-3.5" />
          <span>{toolName.replace(/([A-Z])/g, ' $1').trim()}</span>
          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin" />
        </div>
        <div className="mt-2 text-sm italic text-slate-600 dark:text-white/60">Executing analysis...</div>
      </div>
    );
  }

  const safeResult = result || {};

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/30">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/70">
        <Wrench className="h-3.5 w-3.5" />
        <span>{toolName.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-800 dark:text-white/90">
        {toolName === 'analyzeResumeSnippet' && (
          <>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              📊 Estimated ATS Score: {safeResult.estimatedScore ?? 'N/A'}/100
            </p>

            {Array.isArray(safeResult.feedback) && safeResult.feedback.length > 0 && (
              <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
                {safeResult.feedback.map((fb: string, i: number) => (
                  <li key={i}>{fb}</li>
                ))}
              </ul>
            )}

            {safeResult.improvedExample && (
              <p className="mt-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 italic text-slate-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-slate-200">
                ✨ <span className="font-medium not-italic">Improved:</span> "{safeResult.improvedExample}"
              </p>
            )}
          </>
        )}

        {toolName === 'matchSkillsToJob' && (
          <>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">🎯 Match: {safeResult.matchPercentage ?? 0}%</p>
            <p className="text-slate-700 dark:text-slate-300">✅ <span className="font-medium">Matched:</span> {safeResult.skillsMatched?.join(', ') || 'None'}</p>
            <p className="text-rose-600 dark:text-rose-400">❌ <span className="font-medium">Missing:</span> {safeResult.missingFromResume?.join(', ') || 'None'}</p>
            {safeResult.recommendedAdditions?.length > 0 && (
              <p className="text-blue-600 dark:text-blue-400">💡 <span className="font-medium">Add:</span> {safeResult.recommendedAdditions.join(', ')}</p>
            )}
            <p className="mt-2 border-t border-slate-200 pt-2 text-slate-600 dark:border-white/10 dark:text-white/80">{safeResult.summary}</p>
          </>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
//  MESSAGE BUBBLE COMPONENT
// ----------------------------------------------------------------------
const MessageBubble = ({
  message,
  onCopy,
  copiedId,
}: {
  message: AnyMessage;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) => {
  const isUser = message.role === 'user';

  const textContent =
    message.parts
      ?.filter((part) => part?.type === 'text' && typeof part?.text === 'string')
      .map((part) => part.text)
      .join('\n') ?? message.content ?? '';

  const toolInvocations =
    message.parts?.filter((part) => {
      const t = part?.type;
      return (
        t === 'tool-invocation' ||
        t === 'toolInvocation' ||
        t === 'tool-call' ||
        t === 'toolCall'
      );
    }) ?? [];

  return (
    <div className={`flex gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`group relative rounded-2xl px-5 py-3.5 text-sm shadow-sm transition-all ${
            isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
              : 'rounded-tl-sm border border-slate-200 bg-white/90 text-slate-800 backdrop-blur-md dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-100'
          }`}
        >
          {textContent ? (
       <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed text-current marker:text-current">
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          return !inline && match ? (
            <div className="my-3 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-inner">
              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1rem' }}>
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[13px] font-medium text-pink-600 dark:bg-white/10 dark:text-pink-400" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {textContent}
    </ReactMarkdown>
  </div>
          ) : (
            <div className="flex h-5 items-center gap-1 opacity-60">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"></span>
            </div>
          )}

          {toolInvocations.length > 0 &&
            toolInvocations.map((ti: any, index: number) => {
              const toolData = ti?.toolInvocation ?? ti?.toolCall ?? ti;
              return (
                <ToolCallDisplay
                  key={toolData?.toolCallId ?? index}
                  toolInvocation={toolData}
                />
              );
            })}

          {!isUser && textContent && (
            <button
              type="button"
              onClick={() => onCopy(textContent, message.id)}
              className="absolute -bottom-8 right-0 rounded-lg border border-slate-200 bg-white p-1.5 opacity-0 shadow-sm transition-all hover:bg-slate-50 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Copy message"
            >
              {copiedId === message.id ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
//  MAIN CHAT MODAL COMPONENT
// ----------------------------------------------------------------------
export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { copiedId, copy } = useCopyToClipboard();

  const [input, setInput] = useState('');

  const initialMessages: AnyMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text:
            "👋 **Welcome to Blitz Analyzer Engine™**\n\nI'm your premium career strategist. I can:\n- Analyze resume snippets for ATS compliance\n- Match your skills to job descriptions\n- Rewrite bullet points using the STAR method\n- Guide you to a higher callback rate\n\nHow can I help you today?",
        },
      ],
    },
  ];

  const {
    messages = [],
    sendMessage,
    isLoading,
    setMessages,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    messages: initialMessages as any,
    onFinish: () => {
      inputRef.current?.focus();
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading, isOpen]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      setInput('');

      try {
        await sendMessage({ text: trimmed });
      } catch (err) {
        console.error('sendMessage failed:', err);
        setInput(trimmed);
      }
    },
    [input, isLoading, sendMessage]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      setInput(text);
      window.requestAnimationFrame(() => {
        formRef.current?.requestSubmit();
      });
    },
    []
  );

  const suggestions = [
    { icon: FileText, text: 'Analyze: "Responsible for managing team projects"' },
    { icon: Briefcase, text: 'Match my skills: Python, SQL to Data Analyst JD' },
    { icon: Sparkles, text: 'How to improve ATS score from 65 to 85?' },
  ];

  const hasOnlyWelcome = messages.length === 1;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 active:scale-95 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="absolute h-6 w-6 animate-pulse" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in dark:bg-black/60 sm:p-6 md:p-12">
          
          {/* Modal Container */}
          <div className="relative flex h-full max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all animate-in zoom-in-95 duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            
            {/* Header */}
            <div className="relative z-10 shrink-0 border-b border-slate-200/50 bg-white/50 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:to-slate-300">
                      Blitz Analyzer AI
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      </span>
                      Online & Ready
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMessages(initialMessages as any)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                    title="Clear Conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <div className="mx-auto flex max-w-3xl flex-col space-y-6">
                {hasOnlyWelcome && (
                  <div className="my-8 flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                      <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">How can I assist your career?</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a suggestion below or type your own question.</p>
                    </div>
                    <div className="grid w-full gap-3 sm:grid-cols-1 md:grid-cols-3">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSuggestionClick(s.text)}
                          className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/50 p-4 text-center text-sm text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-white/5 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-900/20"
                        >
                          <div className="rounded-full bg-slate-100 p-2.5 text-slate-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-700 dark:text-slate-400 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400">
                            <s.icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{s.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m: any) => (
                  <MessageBubble key={m.id} message={m} onCopy={copy} copiedId={copiedId} />
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 animate-in fade-in">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white/90 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-slate-800/90">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-600 shadow-sm dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                    ⚠️ {error.message || 'Something went wrong. Please try again.'}
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <div className="relative z-10 shrink-0 border-t border-slate-200/50 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
              <form ref={formRef} onSubmit={onSubmit} className="mx-auto relative flex max-w-3xl items-center">
                <input
                  ref={inputRef}
                  className="w-full rounded-full border border-slate-300 bg-white/80 py-4 pl-6 pr-14 text-[15px] text-slate-800 shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-800 dark:focus:ring-blue-400/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your resume, ATS score, or job match..."
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                </button>
              </form>

              <div className="mx-auto mt-3 max-w-3xl text-center flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <Sparkles className="h-3 w-3" />
                Blitz Analyzer AI can make mistakes. Verify important information.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}