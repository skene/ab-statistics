## AB Statistics

`ab-statistics` is a simple library for handling statistical significance with mulitple variations in A/B testing.

## Quick Start

```sh
yarn add ab-statistics
# or
npm install --save ab-statistics
```

```js
import { ABTest } from "ab-statistics";

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

const Test = new ABTest()<VariationDocument>({ control, variations });

const highestSignificance = Test.highestSignificance();
// {
//   name: "Variation C",
//   conversions: 1800,
//   impressions: 80000
// }

const significantVariations = Test.filterSignificant();
// [
//   {
//     name: "Variation B",
//     conversions: 1700,
//     impressions: 80000
//   },
//   {
//     name: "Variation C",
//     conversions: 1800,
//     impressions: 80000
//   }
// ]
```
