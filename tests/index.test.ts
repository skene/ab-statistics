import { ABTest } from "../src";

interface VariationDocument {
  name: string;
  conversions: number;
  impressions: number;
}

const control: VariationDocument = {
  name: "Control Variation",
  conversions: 1600,
  impressions: 80000
};

const variations: VariationDocument[] = [
  {
    name: "Variation A",
    conversions: 1500,
    impressions: 80000
  },
  {
    name: "Variation B",
    conversions: 1700,
    impressions: 80000
  },
  {
    name: "Variation C",
    conversions: 1800,
    impressions: 80000
  }
];

describe("AB Testing Statistics", () => {
  it("should have default properties", () => {
    const Test = new ABTest<VariationDocument>({});

    expect(Test.confidence).toEqual(0.95);
    expect(Test.control).toEqual(null);
    expect(Test.variations).toEqual([]);
  });

  it("should calculate conversion rate static method", () => {
    const converstionRate = ABTest.conversionRate(
      control.conversions,
      control.impressions
    );

    expect(converstionRate).toEqual(0.02);
  });

  it("should calculate standard error static method", () => {
    const converstionRate = ABTest.conversionRate(
      control.conversions,
      control.impressions
    );

    const standardError = ABTest.standardError(
      converstionRate,
      control.impressions
    );

    expect(parseFloat(standardError.toFixed(6))).toEqual(0.000495);
  });

  it("should filter significant variations", () => {
    const Test = new ABTest<VariationDocument>({ control, variations });
    const Test2 = new ABTest<VariationDocument>({
      control,
      variations: [variations[0]]
    });

    expect(Test.filterSignificant()).toHaveLength(2);
    expect(Test2.filterSignificant()).toEqual(null);
  });

  it("should calculate variation with highest significance", () => {
    const Test = new ABTest<VariationDocument>({ control, variations });

    expect(Test.highestSignificance()).toMatchObject(variations[2]);
  });
});
