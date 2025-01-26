import { JSDOM } from 'jsdom';

import { type URLsObj, type Resp } from '.';

const validateURL = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch (error) {
    if (error) return null;
  }
  return null;
};

const validateFetch = async (url: string): Promise<Resp> => {
  try {
    return {
      ok: true,
      content: await fetch(url),
    };
  } catch (error) {
    const newError = error as Error;

    return {
      ok: false,
      error: newError,
    };
  }
};

export interface GetURLsFromHTMLInput {
  htmlBody: string;
  baseURL: string;
}

export function getURLsFromHTML(input: GetURLsFromHTMLInput): string[] {
  const { htmlBody, baseURL } = input;
  const urls: string[] = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll(
    'a',
  ) as NodeListOf<HTMLAnchorElement>;
  const cases = {
    ['/']: (href: string) => validateURL(`${baseURL}${href}`)?.href,
    ['h']: (href: string) => validateURL(`${href}`)?.href,
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

//Recursive function
export async function crawlPage(
  baseURL: string,
  currentUrl: string,
  URLsObj: URLsObj,
): Promise<URLsObj> {
  const baseURLObj = validateURL(baseURL);
  const currentURLObj = validateURL(currentUrl);

  if (!baseURLObj) {
    console.log('Invalid base URL.');
    return URLsObj;
  }

  if (!currentURLObj) {
    console.log('Invalid current URL.');
    return URLsObj;
  }

  if (baseURLObj!.hostname !== currentURLObj!.hostname) {
    return URLsObj;
  }

  const normalizedCurrentURL = normalizeURL(currentUrl);

  if (URLsObj[normalizedCurrentURL] > 0) {
    URLsObj[normalizedCurrentURL]++;
    return URLsObj;
  }

  URLsObj[normalizedCurrentURL] = 1;

  const currentURLHref = currentURLObj!.href;

  console.log(`Actively crawling: ${currentURLHref}`);

  const resp = await validateFetch(currentURLHref);

  if (!resp.ok) {
    console.log(
      `Error in fetch: ${resp.error!.message}, on page: ${currentURLHref}`,
    );
    return URLsObj;
  }

  const contentType = resp.content!.headers.get('Content-Type');

  if (!contentType!.includes('text/html')) {
    console.log(`Non html response, content-type: ${contentType}`);
    return URLsObj;
  }

  const htmlBody = await resp.content!.text();

  const nextURLs = getURLsFromHTML({ baseURL, htmlBody });

  for (const nextURL of nextURLs) {
    URLsObj = await crawlPage(baseURL, nextURL, URLsObj);
  }

  return URLsObj;
}

export function logCrawledPages(URLsObj: URLsObj): void {
  const iterableURLsObj = Object.entries(URLsObj);

  for (const URLObj of iterableURLsObj) {
    console.log(URLObj);
  }
}
