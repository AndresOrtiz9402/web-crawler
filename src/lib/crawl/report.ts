import { type URLsObj } from '.';

export function printReport(URLsObj: URLsObj): void {
  const sortedPages = sortPages(URLsObj);

  console.log('============');
  console.log('REPORT');
  console.log('============');
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];
    console.log(`Found ${hits} links to page: ${url}`);
  }
  console.log('============');
  console.log('END REPORT');
  console.log('============');
}

export function sortPages(URLsObj: URLsObj): [string, number][] {
  const URLs = Object.entries(URLsObj);

  URLs.sort((a, b) => b[1] - a[1]);

  return URLs;
}
