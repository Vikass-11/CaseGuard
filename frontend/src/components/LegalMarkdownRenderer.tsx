'use client';

import React from 'react';

export interface LegalBlock {
  type: 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'p' | 'quote';
  content?: string;
  items?: string[];
}

/**
 * Normalizes legal text from LLM / database:
 * - Strips literal `\r` (or unescaped `\\r` from JSON)
 * - Normalizes Windows `\r\n` and `\r` to standard `\n`
 * - Intelligently separates flattened sections, headings, bullets and numbered items
 *   that may have lost paragraph breaks during DB persistence or AI generation.
 */
export function normalizeLegalText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText
    // 1. Replace all forms of escaped or literal \r and \n
    .replace(/\\r\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // 2. Separate Roman numeral headings glued to preceding sentences:
  // e.g. "immediate injunctive relief. II. CHRONOLOGY" -> "immediate injunctive relief.\n\nII. CHRONOLOGY"
  text = text.replace(
    /([.!?])\s+((?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\.\s+[A-Z])/g,
    '$1\n\n$2'
  );

  // 3. Separate Roman numeral headings glued to following sentences or items on the same line:
  // e.g. "I. STATEMENT OF THE CASE Petitioner, Jane Doe" -> "I. STATEMENT OF THE CASE\n\nPetitioner, Jane Doe"
  // e.g. "II. CHRONOLOGY OF FACTUAL INCIDENTS - **Sunday" -> "II. CHRONOLOGY OF FACTUAL INCIDENTS\n\n- **Sunday"
  text = text.replace(
    /((?:^|\n)(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\.\s+[A-Z\s&,/-]{3,80}?)\s+([A-Z][a-z]|[•\-\*]|\d+[\.\)])/g,
    '$1\n\n$2'
  );

  // 4. Separate bullet points that were glued to prior text or items:
  // e.g. "parking lot. - **09:05 am**" -> "parking lot.\n- **09:05 am**"
  // e.g. "INCIDENTS - **Sunday" -> "INCIDENTS\n- **Sunday"
  text = text.replace(/([.!?:]|[a-zA-Z0-9)])\s+([•\-\*]\s+\*\*)/g, '$1\n$2');
  text = text.replace(/([.!?:]|[a-zA-Z0-9)])\s+([•\-\*]\s+[A-Z0-9])/g, '$1\n$2');

  // 5. Separate numbered points that were glued to prior text:
  // e.g. "domestic violence: 1. **Coercive Control**" -> "domestic violence:\n\n1. **Coercive Control**"
  // e.g. "legal representation. 2. **Threats" -> "legal representation.\n2. **Threats"
  text = text.replace(/([:!])\s+(\d+[\.\)]\s+)/g, '$1\n\n$2');
  text = text.replace(/([.?])\s+(\d+[\.\)]\s+\*\*)/g, '$1\n$2');
  text = text.replace(/([.?])\s+(\d+[\.\)]\s+[A-Z])/g, '$1\n$2');

  // 6. Clean up excessive consecutive newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/**
 * Parses inline markdown: bold (**text**), italics (*text*), quotes
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground print:text-black">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-foreground print:text-black">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

/**
 * Converts inline markdown to HTML string for Word (.doc) export
 */
export function inlineMarkdownToHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/**
 * Parses raw legal brief / memorandum markdown into structured document blocks
 */
export function parseLegalDocumentBlocks(rawContent: string): LegalBlock[] {
  const normalized = normalizeLegalText(rawContent);
  if (!normalized) return [];

  const lines = normalized.split('\n');
  const blocks: LegalBlock[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'p',
        content: currentParagraph.join(' ')
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({
        type: currentList.type,
        items: [...currentList.items]
      });
      currentList = null;
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Blank line: flushes current block
    if (!line) {
      flushAll();
      continue;
    }

    // 2. Headings
    // Level 1: Markdown # or formal centered document title
    if (line.startsWith('# ')) {
      flushAll();
      blocks.push({ type: 'h1', content: line.replace(/^#\s+/, '') });
      continue;
    }

    // Level 2: Markdown ## or Roman Numeral Heading (e.g. "I. STATEMENT OF THE CASE", "II. CHRONOLOGY OF FACTUAL INCIDENTS")
    const romanNumeralMatch = line.match(/^(?:##\s+|([I|V|X]+)\.\s+)(.*)$/i);
    if (romanNumeralMatch) {
      flushAll();
      const headingText = romanNumeralMatch[1]
        ? `${romanNumeralMatch[1].toUpperCase()}. ${romanNumeralMatch[2]}`
        : romanNumeralMatch[2];
      blocks.push({ type: 'h2', content: headingText });
      continue;
    }

    // Level 3: Markdown ### or Lettered sub-headings ("A. Legal Grounds", "B. Relief Sought")
    const letterHeadingMatch = line.match(/^(?:###\s+|([A-Z])\.\s+([A-Z].*))$/);
    if (letterHeadingMatch) {
      flushAll();
      const headingText = letterHeadingMatch[1]
        ? `${letterHeadingMatch[1]}. ${letterHeadingMatch[2]}`
        : line.replace(/^###\s+/, '');
      blocks.push({ type: 'h3', content: headingText });
      continue;
    }

    // 3. Unordered Bullet Lists (- Item, * Item, • Item)
    if (/^[•\-\*]\s+/.test(line)) {
      flushParagraph();
      const itemText = line.replace(/^[•\-\*]\s+/, '');
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      }
      continue;
    }

    // 4. Ordered Numbered Lists (1. Item, 2. Item, (1) Item)
    const numMatch = line.match(/^(\d+[\.\)]|\([0-9]+\))\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      const itemText = numMatch[2];
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      }
      continue;
    }

    // 5. Blockquotes (> Quote)
    if (line.startsWith('> ')) {
      flushAll();
      blocks.push({ type: 'quote', content: line.replace(/^>\s*/, '') });
      continue;
    }

    // 6. Regular Paragraph Line: group with current paragraph
    flushList();
    currentParagraph.push(line);
  }

  flushAll();
  return blocks;
}

/**
 * Converts structured legal document blocks to high-fidelity Word HTML for export
 */
export function legalBlocksToWordHtml(blocks: LegalBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'h1':
          return `<h1 style="font-size: 14pt; font-weight: bold; text-align: left; text-transform: uppercase; margin-top: 14pt; margin-bottom: 6pt; border-bottom: 2pt solid #000; padding-bottom: 3pt; page-break-after: avoid; mso-break-after: avoid;">${inlineMarkdownToHtml(block.content || '')}</h1>`;
        case 'h2':
          return `<h2 style="font-size: 12pt; font-weight: bold; text-align: left; text-transform: uppercase; margin-top: 14pt; margin-bottom: 5pt; border-bottom: 1.5pt solid #000; padding-bottom: 2pt; page-break-after: avoid; mso-break-after: avoid;">${inlineMarkdownToHtml(block.content || '')}</h2>`;
        case 'h3':
          return `<h3 style="font-size: 11pt; font-weight: bold; text-align: left; margin-top: 10pt; margin-bottom: 3pt; page-break-after: avoid; mso-break-after: avoid;">${inlineMarkdownToHtml(block.content || '')}</h3>`;
        case 'ul':
          return `<ul style="margin-top: 4pt; margin-bottom: 8pt; padding-left: 20pt; text-align: left; page-break-inside: avoid;">${(block.items || []).map((item) => `<li style="margin-bottom: 3pt; line-height: 1.35; text-align: left;">${inlineMarkdownToHtml(item)}</li>`).join('')}</ul>`;
        case 'ol':
          return `<ol style="margin-top: 4pt; margin-bottom: 8pt; padding-left: 20pt; text-align: left; page-break-inside: avoid;">${(block.items || []).map((item) => `<li style="margin-bottom: 3pt; line-height: 1.35; text-align: left;">${inlineMarkdownToHtml(item)}</li>`).join('')}</ol>`;
        case 'quote':
          return `<blockquote style="margin: 8pt 0; padding: 6pt 12pt; border-left: 3pt solid #000; font-style: italic; text-align: left; page-break-inside: avoid;">${inlineMarkdownToHtml(block.content || '')}</blockquote>`;
        case 'p':
        default:
          return `<p style="margin-top: 0; margin-bottom: 7pt; line-height: 1.35; text-align: left; text-indent: 0; mso-pagination: widow-orphan;">${inlineMarkdownToHtml(block.content || '')}</p>`;
      }
    })
    .join('\n');
}

/**
 * Court Document View Component
 * Renders legal memoranda with clean left alignment, comfortable line height (1.7–1.8),
 * proper paragraph separation, Roman numeral headings, and bullet/numbered lists.
 */
export default function LegalMarkdownRenderer({
  content,
  className = ''
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseLegalDocumentBlocks(content);

  if (blocks.length === 0) {
    return (
      <div className="text-muted-foreground italic text-xs py-8 text-center">
        No document content available.
      </div>
    );
  }

  return (
    <div className={`space-y-4 font-serif text-sm sm:text-[15px] leading-[1.75] text-foreground/90 print:text-black ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <div key={idx} className="my-6 pb-3 border-b-2 border-border/80 print:border-black text-left">
                <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground print:text-black">
                  {renderInlineMarkdown(block.content || '')}
                </h1>
              </div>
            );

          case 'h2':
            return (
              <div key={idx} className="mt-8 mb-4 pt-3 border-b border-border/70 print:border-black text-left">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground print:text-black flex items-center gap-2.5 pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#9E6752] print:bg-black shrink-0" />
                  <span>{renderInlineMarkdown(block.content || '')}</span>
                </h2>
              </div>
            );

          case 'h3':
            return (
              <h3 key={idx} className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground print:text-black mt-5 mb-2 pl-2.5 border-l-2 border-[#2D4354] text-left">
                {renderInlineMarkdown(block.content || '')}
              </h3>
            );

          case 'ul':
            return (
              <ul key={idx} className="space-y-2.5 my-4 pl-6 list-disc text-foreground/90 print:text-black text-left leading-[1.7]">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed pl-1">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={idx} className="space-y-2.5 my-4 pl-6 list-decimal text-foreground/90 print:text-black font-medium text-left leading-[1.7]">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed pl-1">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );

          case 'quote':
            return (
              <blockquote key={idx} className="p-4 my-4 rounded-xl bg-muted/30 border-l-4 border-primary text-xs font-serif italic text-foreground/90 print:border-black text-left">
                {renderInlineMarkdown(block.content || '')}
              </blockquote>
            );

          case 'p':
          default:
            return (
              <p key={idx} className="text-left leading-[1.75] text-foreground/90 print:text-black mb-4 break-words">
                {renderInlineMarkdown(block.content || '')}
              </p>
            );
        }
      })}
    </div>
  );
}
