import {
  MIN_STEP,
  STEP_DECIMAL_PART,
  STEP_NUMBER_OF_ZEROS
} from '../../constants';
import { roundToRequiredNumber } from '../../utils/utils';

function isValueStartBiggerValueEnd(
  valueStart: number,
  valueEnd: number,
  maxValue: number
): boolean {
  return valueStart >= valueEnd && valueStart !== maxValue;
}

function isValueStartBiggerMaxValue(
  valueStart: number,
  valueEnd: number,
  maxValue: number
): boolean {
  return valueStart === maxValue && valueEnd !== maxValue;
}

function isIncorrectStepInValueStart(
  minValue: number,
  step: number,
  valueStart: number,
  maxValue: number
): boolean {
  return (
    ((Math.round(Math.abs(valueStart - minValue) * STEP_DECIMAL_PART) %
      (step * STEP_DECIMAL_PART)) as unknown as boolean) &&
    valueStart !== maxValue
  );
}

function isIncorrectStepInValueEnd(
  maxValue: number,
  minValue: number,
  step: number,
  valueEnd: number
): boolean {
  return (
    ((Math.round(Math.abs(valueEnd - minValue) * STEP_DECIMAL_PART) %
      (step * STEP_DECIMAL_PART)) as unknown as boolean) &&
    valueEnd !== maxValue
  );
}

function isShouldRound(step: number): boolean {
  return step! < 1 && step!.toString().length - 2 !== STEP_NUMBER_OF_ZEROS;
}

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

  const deltaOfMaxValue = maxValue % step;
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let newValue = roundToRequiredNumber(value);
  let incorrectValue = roundToRequiredNumber(newValue, minValue, step);

  if (
    isValueNearMaxAndNeedGoUp(newValue, lastValueBeforeMax, deltaOfMaxValue)
  ) {
    while (newValue !== maxValue) {
      newValue = roundToRequiredNumber(newValue) + MIN_STEP;
    }
    return newValue;
  }

  if (
    isValueNearMaxAndNeedGoDown(newValue, lastValueBeforeMax, deltaOfMaxValue)
  ) {
    while (incorrectValue) {
      newValue = roundToRequiredNumber(newValue) - MIN_STEP;
      incorrectValue = roundToRequiredNumber(newValue, minValue, step);
    }
    return newValue;
  }

  if (isNeedGoDown(delta, step)) {
    while (incorrectValue) {
      newValue = roundToRequiredNumber(newValue) - MIN_STEP;
      incorrectValue = roundToRequiredNumber(newValue, minValue, step);
    }
    return newValue;
  }

  while (incorrectValue) {
    newValue = roundToRequiredNumber(newValue) + MIN_STEP;
    incorrectValue = roundToRequiredNumber(newValue, minValue, step);
  }

  return newValue;
}

function isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  maxValue: number
): boolean {
  return range && valueStart === valueEnd && valueEnd === maxValue;
}

function isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  minValue: number
): boolean {
  return range && valueStart === valueEnd && valueStart === minValue;
}

function isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  prevValueStart: number
): boolean {
  return range && valueStart === valueEnd && valueStart! > prevValueStart;
}

function isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  prevValueEnd: number
): boolean {
  return range && valueStart === valueEnd && valueEnd! < prevValueEnd;
}

function isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  prevValueStart: number
): boolean {
  return range && valueStart! > valueEnd! && valueStart! > prevValueStart;
}

function isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue(
  range: boolean,
  valueStart: number,
  valueEnd: number,
  prevValueEnd: number
): boolean {
  return range && valueStart! > valueEnd! && valueEnd! < prevValueEnd;
}

export {
  isValueStartBiggerValueEnd,
  isValueStartBiggerMaxValue,
  isIncorrectStepInValueStart,
  isIncorrectStepInValueEnd,
  findClosestCorrectValue,
  isShouldRound,
  isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue,
  isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue,
  isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue
};
