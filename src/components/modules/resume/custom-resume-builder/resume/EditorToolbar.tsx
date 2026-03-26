import type { Editor } from '@tiptap/react';
import type { StyleSettings } from '@/interfaces/custom-resume-builder';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Link, Minus, ChevronDown, ZoomIn, ZoomOut, Undo2, Redo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fonts = [
  'Plus Jakarta Sans',
  'DM Sans',
  'Inter',
  'Merriweather',
  'Roboto',
  'Playfair Display',
  'Source Sans 3',
  'Georgia',
  'Arial',
];

interface EditorToolbarProps {
  editor: Editor | null;
  zoom: number;
  setZoom: (z: number) => void;
  styles: StyleSettings;
  setStyles: (s: Partial<StyleSettings>) => void;
}

function TBtn({
  icon: Icon,
  label,
  isActive,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 rounded-md transition-colors ${
            isActive
              ? 'bg-foreground/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-pressed={isActive}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

export function EditorToolbar({ editor, zoom, setZoom, styles, setStyles }: EditorToolbarProps) {
  // Use any-cast to handle tiptap v3 command types
  const chain = () => editor?.chain().focus() as any;

  return (
    <div className="h-10 border-b border-border bg-card flex items-center px-4 gap-0.5 shrink-0">
      {/* Undo / Redo */}
      <TBtn icon={Undo2} label="Undo" onClick={() => chain()?.undo().run()} disabled={!editor} />
      <TBtn icon={Redo2} label="Redo" onClick={() => chain()?.redo().run()} disabled={!editor} />

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      {/* Font family */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2 font-normal text-foreground hover:bg-accent">
            <span className="max-w-[90px] truncate" style={{ fontFamily: styles.fontFamily }}>{styles.fontFamily}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {fonts.map((f) => (
            <DropdownMenuItem
              key={f}
              onClick={() => setStyles({ fontFamily: f })}
              style={{ fontFamily: f }}
              className={`text-sm ${styles.fontFamily === f ? 'bg-accent font-medium' : ''}`}
            >
              {f}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font size */}
      <div className="flex items-center border border-border rounded-md h-7 ml-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-6 rounded-none text-muted-foreground hover:text-foreground"
          onClick={() => setStyles({ fontSize: Math.max(10, styles.fontSize - 1) })}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-xs w-7 text-center font-medium text-foreground tabular-nums">{styles.fontSize}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-6 rounded-none text-muted-foreground hover:text-foreground"
          onClick={() => setStyles({ fontSize: Math.min(28, styles.fontSize + 1) })}
        >
          <span className="text-xs font-medium">+</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      {/* Formatting */}
      <TBtn icon={Bold} label="Bold" isActive={editor?.isActive('bold')} onClick={() => chain()?.toggleBold().run()} disabled={!editor} />
      <TBtn icon={Italic} label="Italic" isActive={editor?.isActive('italic')} onClick={() => chain()?.toggleItalic().run()} disabled={!editor} />
      <TBtn icon={Underline} label="Underline" isActive={editor?.isActive('underline')} onClick={() => chain()?.toggleUnderline().run()} disabled={!editor} />
      <TBtn icon={Strikethrough} label="Strikethrough" isActive={editor?.isActive('strike')} onClick={() => chain()?.toggleStrike().run()} disabled={!editor} />

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      {/* Lists */}
      <TBtn icon={List} label="Bullet List" isActive={editor?.isActive('bulletList')} onClick={() => chain()?.toggleBulletList().run()} disabled={!editor} />
      <TBtn icon={ListOrdered} label="Ordered List" isActive={editor?.isActive('orderedList')} onClick={() => chain()?.toggleOrderedList().run()} disabled={!editor} />

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      {/* Alignment */}
      <TBtn icon={AlignLeft} label="Align Left" isActive={editor?.isActive({ textAlign: 'left' })} onClick={() => chain()?.setTextAlign('left').run()} disabled={!editor} />
      <TBtn icon={AlignCenter} label="Align Center" isActive={editor?.isActive({ textAlign: 'center' })} onClick={() => chain()?.setTextAlign('center').run()} disabled={!editor} />
      <TBtn icon={AlignRight} label="Align Right" isActive={editor?.isActive({ textAlign: 'right' })} onClick={() => chain()?.setTextAlign('right').run()} disabled={!editor} />

      <Separator orientation="vertical" className="h-5 mx-1.5" />

      {/* Link */}
      <TBtn icon={Link} label="Link" onClick={() => {
        if (!editor) return;
        const url = window.prompt('URL:');
        if (url) chain()?.setLink({ href: url }).run();
      }} disabled={!editor} />

      {/* Color */}
      <div className="h-7 w-7 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:bg-accent ml-0.5">
        <input
          type="color"
          value={styles.color}
          onChange={(e) => setStyles({ color: e.target.value })}
          className="h-8 w-8 -m-0.5 cursor-pointer"
          aria-label="Text color"
        />
      </div>

      <div className="flex-1" />

      {/* Zoom */}
      <div className="flex items-center gap-0.5">
        <TBtn icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(Math.max(50, zoom - 25))} disabled={zoom <= 50} />
        <span className="text-xs text-muted-foreground w-9 text-center tabular-nums">{zoom}%</span>
        <TBtn icon={ZoomIn} label="Zoom In" onClick={() => setZoom(Math.min(150, zoom + 25))} disabled={zoom >= 150} />
      </div>
    </div>
  );
}
