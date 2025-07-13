import { Concept } from "@/types/chat";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  onSelectConcept: (concept: Concept) => void;
  currentConceptId: string;
}

export function Sidebar({ isOpen, onClose, concepts, onSelectConcept, currentConceptId }: SidebarProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">Ilya's Reading List</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              <ul>
                {concepts.map((concept) => (
                  <li key={concept.id}>
                    <button
                      onClick={() => onSelectConcept(concept)}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors ${
                        concept.id === currentConceptId 
                          ? 'bg-purple-500/20 text-white font-medium' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {concept.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
} 