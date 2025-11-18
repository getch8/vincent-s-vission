import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { SectionId } from '../types';

interface HeroProps {
  scrollToSection: (id: SectionId) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Vortex Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Star Palette based on Starry Night
    const colors = ['#fef08a', '#facc15', '#fbbf24', '#e0f2fe', '#ffffff'];

    interface Star {
      x: number;
      y: number;
      z: number; // Depth
      angle: number;
      radius: number; // Distance from center in the spiral
      size: number;
      color: string;
      speed: number;
    }

    let stars: Star[] = [];
    const numStars = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const focalLength = 600; // Controls perspective distortion

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 4,
          y: (Math.random() - 0.5) * height * 4,
          z: Math.random() * 2000, // Initial depth placement
          angle: Math.random() * Math.PI * 2,
          radius: 200 + Math.random() * 1000, // Spiral radius
          size: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 2 + Math.random() * 3
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      // Creating a trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)'; // Dark blue fade
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        // Move star closer (decrease Z)
        star.z -= star.speed;
        
        // Rotate the star around the Z-axis (Spiral effect)
        star.angle += 0.005; 

        // Reset star if it passes the camera or goes too far
        if (star.z <= 1) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // 3D Projection Formula
        // scale = focalLength / (focalLength + z)
        // But since we are moving towards 0, it is focalLength / z
        const scale = focalLength / star.z;
        
        // Apply spiral rotation to X and Y
        // We calculate the 3D position first
        // Simple rotation matrix logic for Z-axis rotation
        const rotatedX = star.x * Math.cos(0.002 * star.z) - star.y * Math.sin(0.002 * star.z);
        const rotatedY = star.x * Math.sin(0.002 * star.z) + star.y * Math.cos(0.002 * star.z);

        // Project 3D position to 2D screen space
        const screenX = centerX + rotatedX * scale;
        const screenY = centerY + rotatedY * scale;
        const screenRadius = star.size * scale;

        // Draw only if visible on screen
        if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.min(1, scale); // Fade in as it gets closer
          ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id={SectionId.HERO} className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-[#0f172a] text-white perspective-1000">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* 3D Floating text container */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto space-y-8 animate-fade-in-up" style={{ transformStyle: 'preserve-3d' }}>
        <h2 className="text-xl md:text-2xl tracking-widest text-yellow-200 font-light uppercase opacity-90 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          The Post-Impressionist Experience
        </h2>
        <h1 className="text-6xl md:text-9xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-300 to-sky-200 drop-shadow-[0_10px_20px_rgba(253,224,71,0.2)] transform hover:scale-105 transition-transform duration-700 ease-out">
          Vincent's Vision
        </h1>
        <p className="text-lg md:text-2xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          "I dream my painting and I paint my dream."
        </p>
        
        <button 
          onClick={() => scrollToSection(SectionId.GALLERY)}
          className="group relative mt-12 px-10 py-4 overflow-hidden rounded-full bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 text-yellow-100 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:border-yellow-400"
        >
          <span className="relative z-10 flex items-center gap-2 text-lg tracking-wide">
            Enter the Gallery
          </span>
          {/* 3D Button Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;