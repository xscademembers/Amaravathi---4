import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageOff } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

type GalleryThumbProps = {
  src: string;
  alt: string;
  index: number;
  onClick?: () => void;
  fixedAspect?: boolean;
  rounded?: '2xl' | '3xl';
};

function markLoaded(img: HTMLImageElement | null, setLoading: (v: boolean) => void) {
  if (img?.complete && img.naturalWidth > 0) {
    setLoading(false);
  }
}

export default function GalleryThumb({
  src,
  alt,
  index,
  onClick,
  fixedAspect = false,
  rounded = '3xl',
}: GalleryThumbProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const roundClass = rounded === '2xl' ? 'rounded-2xl' : 'rounded-3xl';
  const eager = index < 2;

  useEffect(() => {
    setError(false);
    setLoading(true);
    markLoaded(imgRef.current, setLoading);
  }, [src]);

  const handleLoad = useCallback(() => setLoading(false), []);

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const setImgRef = useCallback(
    (el: HTMLImageElement | null) => {
      imgRef.current = el;
      markLoaded(el, setLoading);
    },
    [src],
  );

  if (error) {
    return (
      <div
        className={`${fixedAspect ? 'aspect-[4/3]' : 'aspect-video'} bg-maroon/5 flex flex-col items-center justify-center p-8 text-center border border-maroon/10 ${roundClass}`}
      >
        <ImageOff className="w-10 h-10 text-maroon/20 mb-3" />
        <p className="text-maroon/40 font-serif text-sm italic">Image failed to load</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group bg-maroon/5 ${roundClass} ${onClick ? 'cursor-pointer' : ''} ${fixedAspect ? 'aspect-[4/3]' : ''} ${loading && !fixedAspect ? 'min-h-[200px]' : ''} ${loading ? 'animate-pulse' : ''} luxury-shadow`}
      onClick={onClick}
    >
      <OptimizedImage
        ref={setImgRef}
        src={src}
        alt={alt}
        priority={eager}
        lazy={!eager}
        className={`w-full ${fixedAspect ? 'h-full object-cover' : 'h-auto'} group-hover:scale-105 transition-transform duration-500`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-maroon/5 pointer-events-none">
          <div className="w-8 h-8 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin" />
        </div>
      )}
      {onClick && (
        <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/20 transition-colors pointer-events-none" />
      )}
    </div>
  );
}
