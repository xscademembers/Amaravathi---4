import {
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type SyntheticEvent,
  type ImgHTMLAttributes,
} from 'react';
import { getOptimizedSources, isExternalSrc } from '../lib/imagePaths';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> & {
  src: string;
  alt: string;
  /** LCP hero — eager load + fetchpriority high */
  priority?: boolean;
  /** Force lazy even when priority is false (default: lazy unless priority) */
  lazy?: boolean;
};

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(function OptimizedImage(
  {
    src,
    alt,
    className,
    priority = false,
    lazy,
    onLoad,
    onError,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLImageElement>(null);
  const loading = lazy ?? !priority ? 'lazy' : 'eager';
  const optimized = !isExternalSrc(src) ? getOptimizedSources(src) : null;

  const setRef = useCallback(
    (el: HTMLImageElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  useEffect(() => {
    const img = innerRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      onLoad?.({ currentTarget: img } as SyntheticEvent<HTMLImageElement>);
    }
  }, [src, onLoad]);

  const handleLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      onLoad?.(e);
    },
    [onLoad],
  );

  const imgProps = {
    ref: setRef,
    alt,
    className,
    loading: loading as 'lazy' | 'eager',
    decoding: 'async' as const,
    ...(priority ? { fetchPriority: 'high' as const } : {}),
    referrerPolicy: 'no-referrer' as const,
    onLoad: handleLoad,
    onError,
    ...rest,
  };

  if (optimized) {
    return (
      <picture>
        <source srcSet={optimized.webp} type="image/webp" />
        <img src={optimized.fallback} {...imgProps} />
      </picture>
    );
  }

  return <img src={src} {...imgProps} />;
});

export default OptimizedImage;
export { getOptimizedSources };
