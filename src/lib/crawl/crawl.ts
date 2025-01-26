import { JSDOM } from 'jsdom';

export interface GetURLsFromHTMLInput {
  htmlBody: string;
  BaseURL: string;
}

const validURL = (url: string): string | null => {
  try {
    return new URL(url).href;
  } catch (error) {
    if (error) return null;
  }
  return null;
};

interface Resp {
  ok: boolean;
  content?: Response;
  error?: Error;
}

const validFetch = async (url: string): Promise<Resp> => {
  try {
    return {
      content: await fetch(url),
      ok: true,
    };
  } catch (error) {
    const newError = error as Error;

    return {
      ok: false,
      error: newError,
    };
  }
};

export async function crawlPage(url: string) {
  const validUrl = validURL(url);

  if (!validUrl) {
    console.log('Invalid URL.');
    return;
  }

  console.log(`Actively crawling: ${validUrl}`);

  const resp = await validFetch(validUrl);

  if (!resp.ok) {
    console.log(`Error in fetch: ${resp.error!.message}, on page: ${validUrl}`);
    return;
  }

  const contentType = resp.content!.headers.get('Content-Type');

  if (!contentType!.includes('text/html')) {
    console.log(`Non html response, content-type: ${contentType}`);
    return;
  }

  console.log(await resp.content!.text());
}

export function getURLsFromHTML(input: GetURLsFromHTMLInput): string[] {
  const { htmlBody, BaseURL } = input;
  const urls: string[] = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll(
    'a',
  ) as NodeListOf<HTMLAnchorElement>;
  const cases = {
    ['/']: (href: string) => validURL(`${BaseURL}${href}`),
    ['h']: (href: string) => validURL(`${href}`),
  };

  for (const linkElement of linkElements) {
    let href = null;

    const firstChar = linkElement.href.slice(0, 1);

    if (firstChar === '/' || firstChar === 'h')
      href = cases[firstChar](linkElement.href);

    if (href) urls.push(href);
  }

  return urls;
}

export type GetURLsFromHTML = typeof getURLsFromHTML;

export function normalizeURL(url: string): string {
  const urlObj = new URL(url);
  const normalizedUrl = `${urlObj.hostname}${urlObj.pathname}`;

  if (normalizedUrl.length > 0 && normalizedUrl.slice(-1) === '/')
    return normalizedUrl.slice(0, -1);

  return normalizedUrl;
}

export type NormalizeURL = typeof normalizeURL;
