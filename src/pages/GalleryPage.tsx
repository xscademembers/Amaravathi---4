import { useState, useEffect, useCallback } from 'react';
import { ImageOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';

const API = import.meta.env.VITE_API_URL || '';

const DEFAULT_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
];

function GalleryImage({ src, index, onClick }: { src: string; index: number; onClick: () => void }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="aspect-video bg-maroon/5 flex flex-col items-center justify-center p-8 text-center border border-maroon/10 rounded-2xl">
        <ImageOff className="w-10 h-10 text-maroon/20 mb-3" />
        <p className="text-maroon/40 font-serif text-sm italic">Image failed to load</p>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group cursor-pointer bg-maroon/5 ${loading ? 'animate-pulse min-h-[200px]' : ''}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={`Gallery ${index + 1}`}
        className={`w-full h-auto group-hover:scale-105 transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/20 transition-colors" />
    </div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>(DEFAULT_GALLERY_IMAGES);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setImages(data.map((img: { imageUrl: string }) => img.imageUrl));
        }
      }
    } catch { /* fallback to defaults */ }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(prev => prev !== null ? (prev + 1) % images.length : null);
      if (e.key === 'ArrowLeft') setLightbox(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, images.length]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar transparent={false} />

      <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="pt-24 pb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold font-sans font-semibold tracking-[0.3em] uppercase mb-4"
        >
          Visual Journey
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif text-maroon mb-4"
        >
          The Full Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-charcoal/50 max-w-xl mx-auto"
        >
          Browse through our gallery of grand celebrations, exquisite venues, and unforgettable moments at Amaravathi Conventions.
        </motion.p>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GalleryImage src={img} index={i} onClick={() => setLightbox(i)} />
            </motion.div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12 text-charcoal/30">
            <ImageOff size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-serif text-lg">No images yet</p>
          </div>
        )}
      </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
              className="absolute left-4 md:left-8 text-white/40 hover:text-white text-4xl font-light transition-colors select-none"
            >
              &#8249;
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={images[lightbox]}
              alt={`Gallery ${lightbox + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
              referrerPolicy="no-referrer"
              onClick={e => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
              className="absolute right-4 md:right-8 text-white/40 hover:text-white text-4xl font-light transition-colors select-none"
            >
              &#8250;
            </button>

            <div className="absolute bottom-6 text-white/40 text-sm font-sans tracking-widest">
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto shrink-0 bg-[#1a1a1a] py-6 text-center">
        <p className="text-white/30 text-[11px] uppercase tracking-[0.2em]">
          &copy; 2026 Amaravathi Conventions. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
