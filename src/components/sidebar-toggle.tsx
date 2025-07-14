import { BookOpen } from "lucide-react";

interface SidebarToggleProps {
  onToggle: () => void;
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <div className="fixed top-6 left-6 z-30">
      <button
        onClick={onToggle}
        className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800 hover:border-gray-700 transition-colors backdrop-blur-sm"
      >
        <BookOpen className="h-5 w-5" />
      </button>
    </div>
  );
} 