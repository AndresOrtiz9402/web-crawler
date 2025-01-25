interface TestCase<InputType, OutputType> {
  title: string;
  input: InputType;
  expected: OutputType;
}

type FnToTest<InputType, OutputType> = (input: InputType) => OutputType;

export class Test<InputType, OutputType> {
  constructor(
    readonly fnToTest: FnToTest<InputType, OutputType>,
    readonly testCases: TestCase<InputType, OutputType>[],
  ) {}
}
