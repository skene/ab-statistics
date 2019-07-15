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
});
