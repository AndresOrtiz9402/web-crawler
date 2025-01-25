export function normalizeURL(url: string): string {
  const urlObj = new URL(url);
  const normalizedUrl = `${urlObj.hostname}${urlObj.pathname}`;

  if (normalizedUrl.length > 0 && normalizedUrl.slice(-1) === '/')
    return normalizedUrl.slice(0, -1);

  return normalizedUrl;
}
