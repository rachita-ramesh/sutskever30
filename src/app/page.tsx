"use client";

import { useState } from "react";
import { Concept } from "@/types/chat";
import { ConceptSelector } from "@/components/concept-selector";
import { ChatInterface } from "@/components/chat-interface";
import { Sidebar } from "@/components/sidebar";
import { concepts as allConcepts } from "@/data/concepts";

export default function HomePage() {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectConcept = (concept: Concept) => {
    setSelectedConcept(concept);
  };

  const handleBack = () => {
    setSelectedConcept(null);
  };

  const handleSwitchToConcept = (concept: Concept) => {
    setSelectedConcept(concept);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        concepts={allConcepts}
        onSelectConcept={handleSwitchToConcept}
        currentConceptId={selectedConcept?.id || ''}
      />
      {selectedConcept ? (
        <ChatInterface
          concept={selectedConcept}
          onBack={handleBack}
          onSwitchToConcept={handleSwitchToConcept}
          onToggleSidebar={toggleSidebar}
        />
      ) : (
        <ConceptSelector 
          onSelectConcept={handleSelectConcept} 
          onToggleSidebar={toggleSidebar}
        />
      )}
    </>
  );
}
