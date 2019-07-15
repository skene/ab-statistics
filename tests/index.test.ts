import { ABTest, Hypothesis } from "../src";

const data = {
  control: [1600, 80000],
  variation: [1700, 80000]
};

describe("AB Testing Statistics", () => {
  it("should have default properties", () => {
    const Test = new ABTest({});

    expect(Test.hypothesis).toEqual(Hypothesis.oneSided);
    expect(Test.confidence).toEqual(0.95);
    expect(Test.control).toEqual(null);
    expect(Test.variation).toEqual(null);
  });

  it("should calculate z-score", () => {
    const Test = new ABTest(data);
    const zScore = Test.zScore().toFixed(4);

    expect(parseFloat(zScore)).toEqual(1.759);
  });

  it("should calculate p-value", () => {
    const Test = new ABTest(data);
    const pValue = Test.pValue().toFixed(4);

    expect(parseFloat(pValue)).toEqual(0.0393);
  });

  it("should calculate standard error of diff", () => {
    const Test = new ABTest(data);
    const seDiff = Test.standardErrorDifference().toFixed(6);

    expect(parseFloat(seDiff)).toEqual(0.000711);
  });

  it("should calculate statistical significance", () => {
    const Test = new ABTest(data);
    const isSignificant = Test.isSignificant();

    expect(isSignificant).toEqual(true);
  });
});
