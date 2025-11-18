import React, { useState, MouseEvent, useRef } from 'react';
import { Artwork, SectionId } from '../types';
import { X, Maximize2, Link as LinkIcon, Check } from 'lucide-react';

const ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'The Starry Night',
    year: '1889',
    description: 'Oil on canvas. It depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    palette: ['#1e3a8a', '#fef08a', '#0f172a'],
  },
  {
    id: '2',
    title: 'Sunflowers',
    year: '1888',
    description: 'A series of still life paintings. Van Gogh intended to decorate the Yellow House in Arles with these luminous yellow blooms.',
    imageUrl: 'https://picsum.photos/600/800?random=2',
    palette: ['#facc15', '#a16207', '#fef9c3'],
  },
  {
    id: '3',
    title: 'Wheatfield with Crows',
    year: '1890',
    description: 'Commonly stated to be Van Gogh\'s last painting. The menacing sky and the path leading nowhere suggest deep melancholy.',
    imageUrl: 'https://picsum.photos/800/500?random=3',
    palette: ['#1d4ed8', '#ca8a04', '#000000'],
  },
  {
    id: '4',
    title: 'Self-Portrait',
    year: '1889',
    description: 'One of over 30 self-portraits. It shows the artist\'s intense gaze and the characteristic swirling brushstrokes.',
    imageUrl: 'https://picsum.photos/600/700?random=4',
    palette: ['#3b82f6', '#93c5fd', '#1e40af'],
  },
   {
    id: '5',
    title: 'The Bedroom',
    year: '1888',
    description: 'Van Gogh prepared his own room in the Yellow House with simple furniture and his own art on the walls.',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    palette: ['#7dd3fc', '#fdba74', '#b45309'],
  },
  {
    id: '6',
    title: 'Almond Blossoms',
    year: '1890',
    description: 'Painted as a gift for his newborn nephew. The branches float against a blue sky, influenced by Japanese prints.',
    imageUrl: 'https://picsum.photos/700/600?random=6',
    palette: ['#0ea5e9', '#e0f2fe', '#ffffff'],
  },
];

// 3D Tilt Card Component
const TiltCard = ({ art, onClick }: { art: Artwork; onClick: () => void }) => {
  const [transform, setTransform] = useState('');
  const [shadow, setShadow] = useState('');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position
    // Limit rotation to +/- 10 degrees
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    
    // Dynamic shadow moves opposite to the light source (cursor)
    const shadowX = (centerX - x) / 10;
    const shadowY = (centerY - y) / 10;
    setShadow(`${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.2)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShadow('0 10px 20px rgba(0,0,0,0.1)');
  };

  return (
    <div
      className="group relative bg-white p-4 cursor-pointer border border-slate-100 transition-all duration-200 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ 
        transform, 
        boxShadow: shadow,
        transformStyle: 'preserve-3d' // Essential for 3D depth of children
      }}
    >
      {/* Image Container - pushes back slightly in Z space */}
      <div 
        className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4]"
        style={{ transform: 'translateZ(20px)' }}
      >
        <img 
          src={art.imageUrl} 
          alt={art.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter contrast-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Maximize2 className="text-white w-8 h-8 drop-shadow-lg" />
        </div>
      </div>

      {/* Text Content - pops forward in Z space */}
      <div 
        className="pt-6 pb-2 text-center bg-white"
        style={{ transform: 'translateZ(50px)' }} 
      >
        <h3 className="text-2xl font-serif text-slate-800 group-hover:text-yellow-600 transition-colors">
          {art.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-sans uppercase tracking-widest">{art.year}</p>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: 'twitter' | 'facebook' | 'pinterest') => {
    if (!selectedArtwork) return;
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Viewing ${selectedArtwork.title} by Van Gogh in Vincent's Vision`);
    const image = encodeURIComponent(selectedArtwork.imageUrl);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${text}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    setCopied(false);
  };

  return (
    <section id={SectionId.GALLERY} className="py-24 px-6 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Masterpieces</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto italic">
            "Great things are done by a series of small things brought together."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {ARTWORKS.map((art) => (
            <TiltCard key={art.id} art={art} onClick={() => setSelectedArtwork(art)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in perspective-1000">
          <div className="bg-[#fdfbf7] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-sm shadow-2xl relative animate-scale-up" style={{ transform: 'rotateX(0deg)' }}>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-slate-800 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-3/5 bg-slate-100 flex items-center justify-center p-6">
              <img 
                src={selectedArtwork.imageUrl} 
                alt={selectedArtwork.title} 
                className="max-w-full max-h-[80vh] object-contain shadow-2xl transform transition-transform hover:scale-[1.02]"
              />
            </div>

            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col overflow-y-auto">
              <div className="flex-1">
                <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">{selectedArtwork.title}</h3>
                <span className="inline-block text-yellow-600 font-bold text-xl mb-6">{selectedArtwork.year}</span>
                
                <div className="space-y-4 text-slate-700 leading-relaxed text-lg border-t border-b border-slate-200 py-6">
                  <p>{selectedArtwork.description}</p>
                </div>
                
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Color Palette</p>
                  <div className="flex gap-3">
                    {selectedArtwork.palette.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="w-12 h-12 rounded-full border border-slate-200 shadow-inner hover:scale-110 transition-transform" 
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Share this Masterpiece</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition-all duration-300 group hover:-translate-y-1"
                      title="Share on X (Twitter)"
                    >
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 group hover:-translate-y-1"
                      title="Share on Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleShare('pinterest')}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#E60023] hover:text-white transition-all duration-300 group hover:-translate-y-1"
                      title="Pin on Pinterest"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" /></svg>
                    </button>
                    <div className="w-px h-8 bg-slate-300 mx-1"></div>
                    <button
                      onClick={copyLink}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all duration-300 relative hover:-translate-y-1"
                      title="Copy Link"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;