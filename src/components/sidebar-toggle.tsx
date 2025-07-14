import { BookOpen } from "lucide-react";

interface SidebarToggleProps {
  onToggle: () => void;
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-1/2 left-4 -translate-y-1/2 z-30 p-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800 hover:border-gray-700 transition-colors backdrop-blur-sm"
      aria-label="Toggle reading list"
    >
      <BookOpen className="h-5 w-5" />
    </button>
  );
} 