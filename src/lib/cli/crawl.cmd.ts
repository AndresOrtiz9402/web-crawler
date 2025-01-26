import { Crawl } from '..';

export async function crawlPageCmd() {
  const length = process.argv.length;

  if (length < 3) {
    console.log('no website provided.');
    process.exit(1);
  }

  if (length > 3) {
    console.log('To many command line args.');
    process.exit(1);
  }

  const BaseURL = process.argv[2];

  const URLsObj = await Crawl.crawlPage(BaseURL, BaseURL, {});

  Crawl.logCrawledPages(URLsObj);
}
