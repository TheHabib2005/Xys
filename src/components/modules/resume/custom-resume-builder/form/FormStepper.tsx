import React from 'react';
import { Check } from 'lucide-react';
import type { SectionDef } from '@/lib/templates';

interface FormStepperProps {
  sections: SectionDef[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  sections,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between min-w-max px-2">
        {sections.map((section, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isPast = index < currentStep;

          return (
            <React.Fragment key={section.id}>
              {/* Step */}
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : isCompleted
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-accent'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`
                    text-xs font-medium transition-colors hidden sm:block
                    ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                  `}
                >
                  {section.title}
                </span>
              </button>

              {/* Connector */}
              {index < sections.length - 1 && (
                <div
                  className={`
                    flex-1 h-px mx-3 min-w-[24px]
                    ${isPast || isCompleted ? 'bg-success' : 'bg-border'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
