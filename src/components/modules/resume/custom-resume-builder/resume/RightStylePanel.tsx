import type { StyleSettings } from '@/interfaces/custom-resume-builder';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify, RotateCcw,
  ChevronDown, Type, Palette, Sparkles,
} from 'lucide-react';

const fonts = ['Plus Jakarta Sans', 'DM Sans', 'Inter', 'Merriweather', 'Roboto', 'Playfair Display', 'Source Sans 3', 'Georgia', 'Arial'];

const colorPresets = [
  '#0F172A', '#1E293B', '#334155', '#3B82F6',
  '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
];

interface RightStylePanelProps {
  styles: StyleSettings;
  setStyles: (s: Partial<StyleSettings>) => void;
  resetStyles: () => void;
  selectedSectionId: string | null;
}

export function RightStylePanel({ styles, setStyles, resetStyles }: RightStylePanelProps) {
  return (
    <aside className="w-[300px] shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto" aria-label="Style controls">
      {/* Typography */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-3.5 w-3.5 text-muted-foreground" />
          <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Typography</Label>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Font Family</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-8 text-xs justify-between font-normal">
                <span style={{ fontFamily: styles.fontFamily }}>{styles.fontFamily}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full min-w-[220px]">
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
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-muted-foreground">Font Size</Label>
            <span className="text-[11px] text-muted-foreground tabular-nums">{styles.fontSize}px</span>
          </div>
          <Slider value={[styles.fontSize]} onValueChange={([v]) => setStyles({ fontSize: v })} min={10} max={24} step={1} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-muted-foreground">Line Height</Label>
            <span className="text-[11px] text-muted-foreground tabular-nums">{styles.lineHeight.toFixed(1)}</span>
          </div>
          <Slider value={[styles.lineHeight * 10]} onValueChange={([v]) => setStyles({ lineHeight: v / 10 })} min={10} max={25} step={1} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-muted-foreground">Letter Spacing</Label>
            <span className="text-[11px] text-muted-foreground tabular-nums">{styles.letterSpacing.toFixed(1)}</span>
          </div>
          <Slider value={[styles.letterSpacing * 10 + 50]} onValueChange={([v]) => setStyles({ letterSpacing: (v - 50) / 10 })} min={0} max={100} step={1} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Alignment</Label>
          <div className="flex gap-1">
            {[
              { icon: AlignLeft, label: 'Left' },
              { icon: AlignCenter, label: 'Center' },
              { icon: AlignRight, label: 'Right' },
              { icon: AlignJustify, label: 'Justify' },
            ].map(({ icon: Icon, label }) => (
              <Button key={label} variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label={label}>
                <Icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-muted-foreground" />
          <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Colors</Label>
        </div>

        {[
          { label: 'Text Color', key: 'color' as const },
          { label: 'Heading Color', key: 'headingColor' as const },
          { label: 'Accent Color', key: 'accentColor' as const },
        ].map(({ label, key }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md border border-border overflow-hidden shrink-0 cursor-pointer">
                <input type="color" value={styles[key]} onChange={(e) => setStyles({ [key]: e.target.value })} className="h-10 w-10 -m-1 cursor-pointer" />
              </div>
              <Input value={styles[key]} onChange={(e) => setStyles({ [key]: e.target.value })} className="h-8 text-xs font-mono flex-1" />
            </div>
          </div>
        ))}

        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Presets</Label>
          <div className="flex gap-1.5 flex-wrap">
            {colorPresets.map((c) => (
              <button
                key={c}
                className="h-6 w-6 rounded-md border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                onClick={() => setStyles({ color: c, headingColor: c })}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={resetStyles}>
          <RotateCcw className="h-3 w-3" /> Reset to Defaults
        </Button>
      </div>
    </aside>
  );
}
