## AB Statistics

`ab-statistics` is a simple library for calculating statistical significance for A/B Tests.

## Quick Start

```sh
yarn add ab-statistics
# or
npm install --save ab-statistics
```

```js
import { ABTest, Hypothesis } from "ab-statistics";

const data = {
  hypothesis: Hypothesis.oneSided,
  confidence: 0.95,
  control: [1600, 80000], // [conversions, impressions]
  variation: [1700, 80000]
};

const Test = new ABTest(data);

const zScore = Test.zScore(); // 1.759...
const pValue = Test.pValue(); // 0.0393...
const isSignificant = Test.isSignificant(); // true
```
