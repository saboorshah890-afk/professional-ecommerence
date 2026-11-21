export const MAGNIFICATION_LEVELS = [2, 3, 5] as const;

export type MagnificationLevel = (typeof MAGNIFICATION_LEVELS)[number];

export function getHighResolutionSource(source: string): string {
  const unsplashPrefix = 'https://images.unsplash.com/';
  if (!source.startsWith(unsplashPrefix)) return source;

  const queryIndex = source.indexOf('?');
  const path = queryIndex < 0 ? source : source.slice(0, queryIndex);
  const params = new URLSearchParams(queryIndex < 0 ? '' : source.slice(queryIndex + 1));
  params.set('w', '3200');
  params.set('q', '95');
  return `${path}?${params.toString()}`;
}
