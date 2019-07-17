import { Gaussian } from "ts-gaussian";

export interface ABTestVariant {
  name?: string;
  conversions: number;
  impressions: number;
}

export interface ABTestConfig<T> {
  confidence?: number;
  control?: T;
  variations?: T[];
}

export class ABTest<T extends ABTestVariant> implements ABTestConfig<T> {
  readonly confidence;
  readonly control;
  readonly variations;

  constructor({
    confidence = 0.95,
    control = null,
    variations = []
  }: ABTestConfig<T>) {
    this.confidence = confidence;
    this.control = control;
    this.variations = variations;
  }

  /**
   * find variation with highest significance
   * - ugly but :shrug:
   * @returns {T[]}
   */
  public highestSignificance(): T {
    let significantVariants: T[] = [];
    let highestIndex = 0; // bad name

    for (let i = 0; i < this.variations.length; i++) {
      const variant = this.variations[i];

      if (this.isSignificant(variant)) {
        significantVariants.push(variant);

        if (this.pValue(variant) <= this.pValue(this.variations[highestIndex]))
          highestIndex = i;
      }
    }

    return this.variations[highestIndex];
  }

  /**
   * Filter significant variants
   * @returns {T[]}
   */
  public filterSignificant(): T[] {
    let significantVariants: T[] = [];

    for (let i = 0; i < this.variations.length; i++) {
      const variant = this.variations[i];

      if (this.isSignificant(variant)) significantVariants.push(variant);
    }

    return significantVariants.length > 0 ? significantVariants : null;
  }

  /**
   * Is test statistically significant?
   * @param {T} variant variant object
   * @returns {boolean}
   */
  private isSignificant(variant: T): boolean {
    const pValue = this.pValue(variant);

    return pValue < 1 - this.confidence;
  }

  /**
   * Calculate p-value
   * @param {T} variant variant object
   * @returns {number}
   */
  private pValue(variant: T): number {
    const zScore = this.zScore(variant);
    const distribution = new Gaussian(0, 1);

    return 1 - distribution.cdf(zScore);
  }

  /**
   * Calculate standard error difference of current data
   * @param {T} variant variant object
   * @returns {number}
   */
  private standardErrorDifference(variant: T): number {
    // standard errors
    const seControl = ABTest.standardError(
      ABTest.conversionRate(this.control.conversions, this.control.impressions),
      this.control.impressions
    );
    const seVariation = ABTest.standardError(
      ABTest.conversionRate(variant.conversions, variant.impressions),
      variant.impressions
    );

    return Math.sqrt(Math.pow(seControl, 2) + Math.pow(seVariation, 2));
  }

  /**
   * Calculate test z-scores
   * @param {T} variant variant object
   * @returns {number}
   */
  private zScore(variant: T): number {
    // conversion rates
    const crControl = ABTest.conversionRate(
      this.control.conversions,
      this.control.impressions
    );
    const crVariant = ABTest.conversionRate(
      variant.conversions,
      variant.impressions
    );

    return (crVariant - crControl) / this.standardErrorDifference(variant);
  }

  /**
   * Calculate standard error (sample proportion)
   * @param {number} c success rate
   * @param {number} n observations
   * @returns {number}
   */
  static standardError(c: number, n: number): number {
    return Math.sqrt((c * (1 - c)) / n);
  }

  /**
   * Calculate conversion rate
   * @param {number} c conversions
   * @param {number} n impressions
   * @returns {number}
   */
  static conversionRate(c: number, n: number): number {
    return c / n;
  }
}
