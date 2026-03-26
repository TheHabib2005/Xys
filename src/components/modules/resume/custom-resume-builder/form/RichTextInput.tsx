import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from 'lucide-react';

interface RichTextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const RichTextInput: React.FC<RichTextInputProps> = ({ value, onChange, placeholder, error }) => {
  const editor = useEditor({
    extensions: [StarterKit as any, Underline as any],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm max-w-none min-h-[80px] p-3 focus:outline-none text-sm text-foreground',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    immediatelyRender:false
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  const chain = () => editor.chain().focus() as any;

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`;

  return (
    <div className={`rounded-md border bg-card overflow-hidden ${error ? 'border-destructive' : 'border-border'}`}>
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
        <button type="button" onClick={() => chain().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => chain().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => chain().toggleUnderline().run()} className={btn(editor.isActive('underline'))}><UnderlineIcon className="w-3.5 h-3.5" /></button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => chain().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => chain().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered className="w-3.5 h-3.5" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
