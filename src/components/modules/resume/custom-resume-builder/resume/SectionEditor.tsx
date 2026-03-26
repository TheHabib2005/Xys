import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExt from '@tiptap/extension-underline';
import LinkExt from '@tiptap/extension-link';
import type { Section, StyleSettings } from '@/interfaces/custom-resume-builder';
import type { Editor } from '@tiptap/react';

interface SectionEditorProps {
  section: Section;
  styles: StyleSettings;
  isSelected: boolean;
  onSelect: () => void;
  onEditorFocus: (editor: Editor | null) => void;
  onUpdateContent: (id: string, html: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export function SectionEditor({
  section,
  styles,
  isSelected,
  onSelect,
  onEditorFocus,
  onUpdateContent,
  onUpdateTitle,
}: SectionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit as any,
      UnderlineExt,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExt.configure({ openOnClick: false }),
    ],
    content: section.content,
    onUpdate: ({ editor: e }) => {
      onUpdateContent(section.id, e.getHTML());
    },
    onFocus: () => {
      onSelect();
      onEditorFocus(editor);
    },
    editorProps: {
      attributes: {
        'aria-label': `${section.title} content editor`,
        role: 'textbox',
        class: 'tiptap focus:outline-none',
      },
    },
    immediatelyRender:false
  });

  const scrollIntoView = useCallback((node: HTMLDivElement | null) => {
    if (node && isSelected) {
      node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  useEffect(() => {
    if (editor && section.content !== editor.getHTML()) {
      editor.commands.setContent(section.content, { emitUpdate: false } as any);
    }
  }, [section.id]);

  return (
    <div
      ref={scrollIntoView}
      className={`group relative transition-all rounded-sm py-1 ${
        isSelected ? 'ring-1 ring-foreground/10 bg-accent/30' : 'hover:bg-accent/20'
      }`}
      onClick={onSelect}
    >
      <input
        type="text"
        value={section.title}
        onChange={(e) => onUpdateTitle(section.id, e.target.value)}
        className="text-[11px] font-semibold border-none bg-transparent outline-none w-full pb-1.5 mb-1 uppercase tracking-[0.15em] text-foreground/70"
        style={{
          fontFamily: styles.fontFamily,
          borderBottom: `1px solid ${styles.accentColor}20`,
        }}
        aria-label={`${section.title} section title`}
      />
      <div
        style={{
          fontFamily: styles.fontFamily,
          fontSize: `${styles.fontSize}px`,
          lineHeight: styles.lineHeight,
          color: styles.color,
          letterSpacing: `${styles.letterSpacing}px`,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
