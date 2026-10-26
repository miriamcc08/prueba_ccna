export function allowedOrigin(origin: string | undefined, configured: string[], development: boolean): boolean {
  if (!origin || configured.includes(origin)) return true;
  if (!development) return false;
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol)
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch { return false; }
}
