import { Gaussian } from "ts-gaussian";

export enum Hypothesis {
  oneSided = "one-sided"
}

export class ABTest {
  public hypothesis: Hypothesis;
  public confidence: number;
  public control: number[] | null; // [conversions, impressions]
  public variation: number[] | null; // [conversions, impressions]

  constructor({
    hypothesis = Hypothesis.oneSided,
    confidence = 0.95,
    control = null,
    variation = null
  }: {
    hypothesis?: Hypothesis;
    confidence?: number;
    control?: number[] | null;
    variation?: number[] | null;
  }) {
    this.hypothesis = hypothesis;
    this.confidence = confidence;
    this.control = control;
    this.variation = variation;
  }

  /**
   * Is test statistically significant?
   * @returns {boolean}
   */
  public isSignificant(): boolean {
    const pValue = this.pValue();

    return pValue < 1 - this.confidence;
  }

  /**
   * Calculate p-value
   * @returns {boolean}
   */
  public pValue(): number {
    const zScore = this.zScore();

    const distribution = new Gaussian(0, 1);

    return 1 - distribution.cdf(zScore);
  }

  /**
   * Calculate standard error difference of current data
   * @returns {boolean}
   */
  public standardErrorDifference(): number {
    const conversionRates = this.conversionRates();

    // standard errors
    const seControl = this.standardError(conversionRates[0], this.control[1]);
    const seVariation = this.standardError(
      conversionRates[1],
      this.variation[1]
    );

    return Math.sqrt(Math.pow(seControl, 2) + Math.pow(seVariation, 2));
  }

  /**
   * Calculate z-scores
   * @returns {number}
   */
  public zScore(): number {
    const conversionRates = this.conversionRates();

    return (
      (conversionRates[1] - conversionRates[0]) / this.standardErrorDifference()
    );
  }

  /**
   * Calculate standard error for given variation
   * @param {number} c conversion rate
   * @param {number} n impressions
   * @returns {boolean}
   */
  private standardError(c: number, n: number): number {
    return Math.sqrt((c * (1 - c)) / n);
  }

  /**
   * Calculate conversion rates
   * @returns {number[]} [conversionRateControl, conversionRateVariation]
   */
  private conversionRates(): number[] {
    // conversion rates
    const crControl = this.control[0] / this.control[1];
    const crVariation = this.variation[0] / this.variation[1];

    return [crControl, crVariation];
  }
}
