import React, { useState, MouseEvent } from 'react';
import { SectionId } from '../types';

const About: React.FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to center of section
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = (clientX - centerX) / 20; // Dampening factor
    const y = (clientY - centerY) / 20;
    
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section 
        id={SectionId.ABOUT} 
        className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 relative perspective-1000">
            {/* Floating Frame - moves opposite to image for depth */}
            <div 
                className="absolute top-4 left-4 w-full h-full border-4 border-yellow-400/60 rounded-lg z-0 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${offset.x * 1.5}px, ${offset.y * 1.5}px)` }}
            ></div>
            
            {/* Image - moves slightly with mouse */}
            <div 
                className="relative z-10 transition-transform duration-100 ease-out"
                style={{ transform: `translate(${offset.x * -1}px, ${offset.y * -1}px) rotateY(${offset.x * 0.05}deg)` }}
            >
                <img 
                    src="https://picsum.photos/800/800?random=99" 
                    alt="Gallery Interior" 
                    className="rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-black/5"></div>
            </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-6 relative z-10">
          <h2 className="text-4xl font-serif text-slate-800 drop-shadow-sm">A Sanctuary for the Soul</h2>
          <div className="w-16 h-1 bg-yellow-400 shadow-sm"></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Established to honor the turbulent yet magnificent life of Vincent van Gogh, 
            our gallery offers a digital sanctuary where his works can be admired in peace.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            We believe that art is not just about seeing, but about feeling. Through our curated collection
            and AI-enhanced guides, we invite you to step into the wheat fields, gaze at the starry nights,
            and feel the warmth of the sunflowers.
          </p>
          
          <blockquote 
            className="pl-4 border-l-4 border-sky-700 italic text-slate-700 my-6 bg-white p-6 rounded-r-lg shadow-lg transform transition-transform hover:scale-[1.02]"
            style={{ transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)` }}
          >
            "If you hear a voice within you say 'you cannot paint,' then by all means paint, and that voice will be silenced."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default About;