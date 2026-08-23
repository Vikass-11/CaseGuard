"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EvidenceCitationProps {
  children: ReactNode;
  evidenceText?: string;
  researchCitation?: {
    source: string;
    section?: string;
    passage: string;
  };
}

export function EvidenceCitation({ children, evidenceText, researchCitation }: EvidenceCitationProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer border-b border-dashed border-primary/50 hover:bg-muted transition-colors rounded-sm px-1">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-md">
        <div className="space-y-4">
          {evidenceText && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Narrative</h4>
              <p className="text-sm italic border-l-2 border-primary/50 pl-2 text-foreground/90">
                "{evidenceText}"
              </p>
            </div>
          )}
          
          {researchCitation && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clinical Foundation</h4>
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-1">
                {researchCitation.source} {researchCitation.section ? `(§\${researchCitation.section})` : ''}
              </span>
              <p className="text-sm border-l-2 border-accent pl-2 text-foreground/80">
                "{researchCitation.passage}"
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
