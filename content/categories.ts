// src/data/categories.ts
import { prompts, type Category } from './prompts';

export const categories: Category[] = [
  'PMM/GTM',
  'Executive',
  'AI & Creative Tools',
];

// Color hints for category badges (Tailwind classes).
// Editorial palette per BRAND.md: ink, oxblood, slate. Restrained on purpose.
export const categoryStyles: Record<Category, string> = {
  'PMM/GTM': 'bg-stone-100 text-stone-800',
  'Executive': 'bg-red-50 text-red-900',
  'AI & Creative Tools': 'bg-slate-100 text-slate-700',
};

// All unique tags, derived from the prompt data and sorted.
export const allTags: string[] = Array.from(
  new Set(prompts.flatMap((p) => p.tags))
).sort();

// Count per category, handy for showing totals in the UI.
export const countByCategory: Record<Category, number> = categories.reduce(
  (acc, c) => {
    acc[c] = prompts.filter((p) => p.category === c).length;
    return acc;
  },
  {} as Record<Category, number>
);
