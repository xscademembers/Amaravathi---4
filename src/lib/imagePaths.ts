/** Maps a public asset path to its optimized WebP/JPEG pair in /optimized/ */
export function getOptimizedSources(src: string): { webp: string; fallback: string } | null {
  if (!src.startsWith('/') || src.startsWith('//') || src.startsWith('/api/')) {
    return null;
  }
  if (src.startsWith('/optimized/')) {
    const base = src.replace(/\.(webp|jpe?g|png)$/i, '');
    return { webp: `${base}.webp`, fallback: `${base}.jpg` };
  }
  const base = src.replace(/^\//, '').replace(/\.(jpe?g|png|webp)$/i, '');
  return {
    webp: `/optimized/${base}.webp`,
    fallback: `/optimized/${base}.jpg`,
  };
}

export function isExternalSrc(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}
