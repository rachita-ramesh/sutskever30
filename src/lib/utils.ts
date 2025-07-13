import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  return `${Math.round(minutes)} min`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getDifficultyLabel(level: string): string {
  switch (level) {
    case 'intuitive':
      return 'Explain the big idea';
    case 'conceptual':
      return 'Show me how it works';
    case 'technical':
      return 'I want to build this';
    default:
      return level;
  }
} 