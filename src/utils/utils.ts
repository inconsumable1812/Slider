import { STEP_DECIMAL_PART } from '../constants';

function roundToRequiredNumber(
  value: number,
  minValue?: number,
  step?: number
) {
  if (minValue !== undefined && step !== undefined) {
    return (
      Math.round(
        ((value - minValue) * STEP_DECIMAL_PART) % (step * STEP_DECIMAL_PART)
      ) / STEP_DECIMAL_PART
    );
  }

  return Math.round(value * STEP_DECIMAL_PART) / STEP_DECIMAL_PART;
}

export { roundToRequiredNumber };
