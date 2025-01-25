import { expect, test } from '@jest/globals';

import { Crawl } from '.';

test('normalizeURL strip protocol', () => {
  const input = 'https://example.com';
  const expected = 'example.com';

  const actual = Crawl.normalizeURL(input);

  expect(actual).toBe(expected);
});

test('normalizeURL strip trailing slash', () => {
  const input = 'https://example.com/';
  const expected = 'example.com';

  const actual = Crawl.normalizeURL(input);

  expect(actual).toBe(expected);
});

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.example.com/';
  const expected = 'blog.example.com';

  const actual = Crawl.normalizeURL(input);

  expect(actual).toBe(expected);
});
