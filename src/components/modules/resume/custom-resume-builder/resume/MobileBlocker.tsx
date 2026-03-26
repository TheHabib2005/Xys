import { Monitor } from 'lucide-react';

export function MobileBlocker() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-8 lg:hidden">
      <div className="text-center max-w-sm space-y-4">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Monitor className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Desktop Only</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Resume Builder editor requires a desktop screen for the best experience. Please open this page on a device with a screen width of at least 1024px.
        </p>
      </div>
    </div>
  );
}
