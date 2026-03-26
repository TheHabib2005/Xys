import { useState, useCallback, useEffect, useRef } from 'react';
import type { ResumeData, StyleSettings } from '@/interfaces/custom-resume-builder';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeEditorPanelProps {
  data: ResumeData;
  styles: StyleSettings;
  customCss: string;
  onUpdateSectionContent: (id: string, html: string) => void;
  onUpdateName: (name: string) => void;
  onUpdateTitle: (title: string) => void;
  onCustomCssChange: (css: string) => void;
}

function generateFullHtml(data: ResumeData, styles: StyleSettings): string {
  const sections = [...data.sections].sort((a, b) => a.position - b.position);
  const contactsHtml = Object.entries(data.contacts)
    .map(([key, val]) => `  <span class="contact-item">${key}: ${val}</span>`)
    .join('\n');

  const sectionsHtml = sections
    .map(
      (s) =>
        `  <section id="${s.id}" data-type="${s.type}">\n    <h2>${s.title}</h2>\n    <div class="section-content">\n      ${s.content}\n    </div>\n  </section>`
    )
    .join('\n\n');

  return `<div class="resume" style="font-family: ${styles.fontFamily}; font-size: ${styles.fontSize}px; line-height: ${styles.lineHeight}; color: ${styles.color}; letter-spacing: ${styles.letterSpacing}px;">
  <header>
    <h1 style="color: ${styles.headingColor};">${data.name}</h1>
    <p class="title">${data.title}</p>
    <div class="contacts">
${contactsHtml}
    </div>
  </header>

${sectionsHtml}
</div>`;
}

function parseHtmlToData(
  html: string,
  currentData: ResumeData
): Partial<{ name: string; title: string; sections: { id: string; content: string }[] }> | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const result: any = {};

    const h1 = doc.querySelector('h1');
    if (h1) result.name = h1.textContent || '';

    const titleEl = doc.querySelector('.title');
    if (titleEl) result.title = titleEl.textContent || '';

    const sectionEls = doc.querySelectorAll('section[id]');
    if (sectionEls.length > 0) {
      result.sections = Array.from(sectionEls).map((el) => {
        const contentEl = el.querySelector('.section-content');
        return {
          id: el.id,
          content: contentEl ? contentEl.innerHTML.trim() : '',
        };
      });
    }

    return result;
  } catch {
    return null;
  }
}

export function CodeEditorPanel({
  data,
  styles,
  customCss,
  onUpdateSectionContent,
  onUpdateName,
  onUpdateTitle,
  onCustomCssChange,
}: CodeEditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [htmlValue, setHtmlValue] = useState('');
  const [cssValue, setCssValue] = useState(customCss);
  const [parseError, setParseError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const isInternalUpdate = useRef(false);

  // Generate HTML from data when data changes (but not from our own edits)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    setHtmlValue(generateFullHtml(data, styles));
  }, [data, styles]);

  useEffect(() => {
    setCssValue(customCss);
  }, [customCss]);

  const handleHtmlChange = useCallback(
    (value: string) => {
      setHtmlValue(value);
      setParseError(null);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const parsed = parseHtmlToData(value, data);
        if (!parsed) {
          setParseError('Could not parse HTML — check your markup.');
          return;
        }
        isInternalUpdate.current = true;
        if (parsed.name !== undefined) onUpdateName(parsed.name);
        if (parsed.title !== undefined) onUpdateTitle(parsed.title);
        if (parsed.sections) {
          parsed.sections.forEach(({ id, content }) => {
            onUpdateSectionContent(id, content);
          });
        }
      }, 800);
    },
    [data, onUpdateName, onUpdateTitle, onUpdateSectionContent]
  );

  const handleCssChange = useCallback(
    (value: string) => {
      setCssValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onCustomCssChange(value);
      }, 500);
    },
    [onCustomCssChange]
  );

  return (
    <div className="flex flex-col h-full border-r border-border bg-card" style={{ width: 420 }}>
      {/* Tab header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'css')}>
          <TabsList className="h-8 bg-accent/50 p-0.5">
            <TabsTrigger value="html" className="text-xs h-7 px-3 data-[state=active]:shadow-sm">
              HTML
            </TabsTrigger>
            <TabsTrigger value="css" className="text-xs h-7 px-3 data-[state=active]:shadow-sm">
              CSS
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {parseError && (
          <span className="text-[10px] text-destructive truncate max-w-[180px]">{parseError}</span>
        )}
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'html' ? (
          <textarea
            value={htmlValue}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full h-full resize-none bg-background text-foreground p-4 font-mono text-[12px] leading-relaxed outline-none border-none"
            spellCheck={false}
            aria-label="HTML editor"
            placeholder="Edit resume HTML here..."
          />
        ) : (
          <textarea
            value={cssValue}
            onChange={(e) => handleCssChange(e.target.value)}
            className="w-full h-full resize-none bg-background text-foreground p-4 font-mono text-[12px] leading-relaxed outline-none border-none"
            spellCheck={false}
            aria-label="CSS editor"
            placeholder={`/* Custom CSS for your resume */\n\n.resume h2 {\n  border-bottom: 2px solid #3B82F6;\n  padding-bottom: 4px;\n}\n\n.section-content ul {\n  margin-left: 1.2em;\n}`}
          />
        )}
      </div>
    </div>
  );
}
