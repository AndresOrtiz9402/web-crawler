import { Testing, Crawl } from '..';

const { runTest } = Testing.Jest;
const { Test } = Testing.Shared;

const reportTest = new Test(Crawl.sortPages, [
  {
    title: 'Sort pages.',
    input: {
      'https://example.com/tags': 3,
      'https://example.com': 1,
      'https://example.com/path': 2,
      'https://example.com/index': 2,
    },
    expected: [
      ['https://example.com/tags', 3],
      ['https://example.com/path', 2],
      ['https://example.com/index', 2],
      ['https://example.com', 1],
    ],
  },
]);

runTest(reportTest);
