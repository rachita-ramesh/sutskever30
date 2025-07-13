import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="relative text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-8">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Learning</span>
        </Link>
      </div>
    </div>
  );
} 