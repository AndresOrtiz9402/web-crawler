import { Testing, Crawl } from '..';

const { runTest } = Testing.Jest;
const { Test } = Testing.Shared;

const normalizeURLTestCases = new Test<string, string>(Crawl.normalizeURL, [
  {
    title: 'normalizeURL strip protocol',
    input: 'https://example.com',
    expected: 'example.com',
  },
  {
    title: 'normalizeURL strip trailing slash',
    input: 'https://example.com/',
    expected: 'example.com',
  },
  {
    title: 'normalizeURL capitals',
    input: 'https://BLOG.example.com/',
    expected: 'blog.example.com',
  },
]);

const BaseURL = 'https://example.com';

const getURLsFromHTMLTestCases = new Test<Crawl.GetURLsFromHTMLInput, string[]>(
  Crawl.getURLsFromHTML,
  [
    {
      title: 'getURLsFromHTML absolute.',
      input: {
        htmlBody: `
        <html>
          <body>
            <a href="https://example.com/path/"></a>
          </body>
        </html>
        `,
        BaseURL,
      },
      expected: ['https://example.com/path/'],
    },
    {
      title: 'getURLsFromHTML relative.',
      input: {
        htmlBody: `
        <html>
          <body>
            <a href="/path/"></a>
          </body>
        </html>
        `,
        BaseURL,
      },
      expected: ['https://example.com/path/'],
    },
    {
      title: 'getURLsFromHTML both and multiple.',
      input: {
        htmlBody: `
        <html>
          <body>
            <a href="https://example.com/path1/"></a>
            <a href="https://example.com/path2/"></a>
            <a href="/path/"></a>
          </body>
        </html>
        `,
        BaseURL,
      },
      expected: [
        'https://example.com/path1/',
        'https://example.com/path2/',
        'https://example.com/path/',
      ],
    },

    {
      title: 'getURLsFromHTML invalid.',
      input: {
        htmlBody: `
        <html>
          <body>
            <a href="invalidURL"></a>
          </body>
        </html>
        `,
        BaseURL,
      },
      expected: [],
    },
    {
      title: 'getURLsFromHTML no links.',
      input: {
        htmlBody: `
        <html>
          <body>
          </body>
        </html>
        `,
        BaseURL,
      },
      expected: [],
    },
  ],
);

runTest<string, string>(normalizeURLTestCases);

runTest<Crawl.GetURLsFromHTMLInput, string[]>(getURLsFromHTMLTestCases);
