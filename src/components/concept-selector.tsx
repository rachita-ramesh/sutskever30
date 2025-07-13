"use client";

import { useState, useEffect } from "react";
import { Concept } from "@/types/chat";
import { getRandomConcepts } from "@/data/concepts";
import { Shuffle, ArrowRight, ExternalLink, Sparkles, Brain, Zap, BookOpen } from "lucide-react";

interface ConceptSelectorProps {
  onSelectConcept: (concept: Concept) => void;
  onToggleSidebar: () => void;
}

export function ConceptSelector({ onSelectConcept, onToggleSidebar }: ConceptSelectorProps) {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  
  useEffect(() => {
    setConcepts(getRandomConcepts(2));
  }, []);

  const handleShuffle = () => {
    setConcepts(getRandomConcepts(2));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCardStyle = (index: number) => {
    if (index === 0) {
      return {
        gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
        border: 'border-purple-500/30',
        hoverBorder: 'group-hover:border-purple-400/50',
        icon: <Brain className="h-6 w-6 text-purple-400" />,
        accent: 'bg-gradient-to-r from-purple-500 to-purple-600'
      };
    } else {
      return {
        gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
        border: 'border-blue-500/30',
        hoverBorder: 'group-hover:border-blue-400/50',
        icon: <Zap className="h-6 w-6 text-blue-400" />,
        accent: 'bg-gradient-to-r from-blue-500 to-blue-600'
      };
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <header className="fixed top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={onToggleSidebar}
            className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800 hover:border-gray-700 transition-colors backdrop-blur-sm"
          >
            <BookOpen className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <div className="relative flex items-center justify-center min-h-screen p-6 pt-24">
        <div className="max-w-7xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-white">Ilya's Reading List</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Learn <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">90% of What Matters</span> in AI
            </h1>
            
            <blockquote className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-400 mb-4 italic leading-relaxed">
                “If you really learn all of these, you’ll know 90 percent of what matters today.”
              </p>
              <footer className="text-gray-500">— Ilya Sutskever to John Carmack</footer>
            </blockquote>

            <p className="text-lg text-gray-400 mt-8 mb-8 max-w-2xl mx-auto leading-relaxed">
              This is a public reconstruction of the reading list Ilya gave John.
              Choose a paper to begin.
            </p>
            
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 shadow-sm text-white"
            >
              <Shuffle className="h-4 w-4" />
              <span className="font-medium">Get New Options</span>
            </button>
          </div>

          {/* Concepts Grid */}
          <div className="relative max-w-lg lg:max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {concepts.map((concept, index) => {
                const cardStyle = getCardStyle(index);
                
                return (
                  <div
                    key={concept.id}
                    onClick={() => onSelectConcept(concept)}
                    className={`group relative cursor-pointer bg-gray-900/50 border-2 ${cardStyle.border} ${cardStyle.hoverBorder} rounded-2xl p-6 lg:p-8 hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm hover:shadow-2xl`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cardStyle.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Choice Indicator */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cardStyle.accent}`}></div>
                    </div>
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {cardStyle.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative space-y-6">
                      {/* Title and Difficulty */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
                            {concept.name}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(concept.difficulty)}`}>
                            {concept.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {concept.description}
                        </p>
                      </div>

                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-300">{concept.category}</span>
                      </div>

                      {/* Paper Reference */}
                      <div className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                              {concept.paperReference.title}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {concept.paperReference.authors.slice(0, 2).join(", ")}
                              {concept.paperReference.authors.length > 2 && " et al."} • {concept.paperReference.year}
                            </p>
                          </div>
                          <a
                            href={concept.paperReference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="pt-4">
                        <div className="flex items-center justify-between text-gray-400 group-hover:text-white transition-colors">
                          <span className="font-medium">Click to start learning</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* OR Divider */}
            <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-900 border-2 border-amber-500/30 text-gray-400 font-semibold shadow-[0_0_25px_theme(colors.amber.500/0.4)]">
                    OR
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 