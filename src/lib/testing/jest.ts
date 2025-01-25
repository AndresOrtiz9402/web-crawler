import { Shared } from '.';

export function runTest<InputType, OutputType>(
  crawlTest: Shared.Test<InputType, OutputType>,
) {
  for (const testCase of crawlTest.testCases) {
    const { expected, input, title } = testCase;

    const fn = () => {
      const actual = crawlTest.fnToTest(input);

      expect(actual).toEqual(expected);
    };

    test(title, fn);
  }
}
