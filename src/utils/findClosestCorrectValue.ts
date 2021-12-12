import { MIN_STEP } from '../constants';
import { roundToRequiredNumber } from './utils';

function isNeedGoDown(delta: number, step: number): boolean {
  return delta < step / 2;
}

function isValueNearMaxAndNeedGoUp(
  newValue: number,
  lastValueBeforeMax: number,
  deltaOfMaxValue: number
): boolean {
  return (
    newValue > lastValueBeforeMax &&
    Math.abs(newValue - lastValueBeforeMax) >= deltaOfMaxValue / 2
  );
}

function isValueNearMaxAndNeedGoDown(
  newValue: number,
  lastValueBeforeMax: number,
  deltaOfMaxValue: number
): boolean {
  return (
    newValue > lastValueBeforeMax &&
    Math.abs(newValue - lastValueBeforeMax) < deltaOfMaxValue / 2
  );
}

function findClosestCorrectValue(
  step: number,
  value: number,
  maxValue: number,
  minValue: number
) {
  const delta = roundToRequiredNumber(value, minValue, step);

  const deltaOfMaxValue = roundToRequiredNumber(
    Math.abs(maxValue - minValue) % step
  );
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let newValue = roundToRequiredNumber(value);

  let incorrectValue = roundToRequiredNumber(newValue, minValue, step);

  if (value >= maxValue) {
    newValue = maxValue;
    return newValue;
  }

  if (value <= minValue) {
    newValue = minValue;
    return minValue;
  }

  if (
    isValueNearMaxAndNeedGoUp(newValue, lastValueBeforeMax, deltaOfMaxValue)
  ) {
    while (newValue !== maxValue) {
      newValue = roundToRequiredNumber(
        roundToRequiredNumber(newValue) + MIN_STEP
      );
    }
    return newValue;
  }

  if (
    isValueNearMaxAndNeedGoDown(newValue, lastValueBeforeMax, deltaOfMaxValue)
  ) {
    while (incorrectValue) {
      newValue = roundToRequiredNumber(
        roundToRequiredNumber(newValue) - MIN_STEP
      );
      incorrectValue = roundToRequiredNumber(newValue, minValue, step);
    }
    return newValue;
  }

  if (isNeedGoDown(delta, step)) {
    while (incorrectValue) {
      newValue = roundToRequiredNumber(
        roundToRequiredNumber(newValue) - MIN_STEP
      );
      incorrectValue = roundToRequiredNumber(newValue, minValue, step);
    }
    return newValue;
  }

  while (incorrectValue) {
    newValue = roundToRequiredNumber(
      roundToRequiredNumber(newValue) + MIN_STEP
    );

    incorrectValue = roundToRequiredNumber(newValue, minValue, step);
  }
  return newValue;
}

export default findClosestCorrectValue;
