import React from "react";
import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col px-4 py-6">
      <nav className="flex justify-between items-center w-full max-w-5xl mb-12 pt-4">
        <div className="font-semibold text-lg">Brevity Bot</div>

      </nav>
      
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Summarize Articles with <br className="max-md:hidden" />
          <span className="bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text">
            OpenAI GPT-4
          </span>
        </h1>
        
        <h2 className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Simplify your reading with Summize, an open-source article summarizer
          that transforms lengthy articles into clear and concise summaries
        </h2>
      </div>
      
    </header>
  );
};

export default Hero;
