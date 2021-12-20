import { STEP_DECIMAL_PART, MIN_STEP } from '../../constants';
import { findDecimalPart, roundToRequiredNumber } from '../../utils/utils';

function isValueStartBiggerValueEnd({
  valueStart,
  valueEnd,
  maxValue
}: {
  valueStart: number;
  valueEnd: number;
  maxValue: number;
}): boolean {
  return valueStart >= valueEnd && valueStart !== maxValue;
}

function isValueStartBiggerMaxValue({
  valueStart,
  valueEnd,
  maxValue
}: {
  valueStart: number;
  valueEnd: number;
  maxValue: number;
}): boolean {
  return valueStart === maxValue && valueEnd !== maxValue;
}

function isIncorrectStepInValueStart({
  minValue,
  step,
  valueStart,
  maxValue
}: {
  minValue: number;
  step: number;
  valueStart: number;
  maxValue: number;
}): boolean {
  return (
    ((Math.round(Math.abs(valueStart - minValue) * STEP_DECIMAL_PART) %
      Math.round(step * STEP_DECIMAL_PART)) as unknown as boolean) &&
    valueStart !== maxValue
  );
}

function isIncorrectStepInValueEnd({
  maxValue,
  minValue,
  step,
  valueEnd
}: {
  maxValue: number;
  minValue: number;
  step: number;
  valueEnd: number;
}): boolean {
  return (
    ((Math.round(Math.abs(valueEnd - minValue) * STEP_DECIMAL_PART) %
      Math.round(step * STEP_DECIMAL_PART)) as unknown as boolean) &&
    valueEnd !== maxValue
  );
}

function isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue({
  range,
  valueStart,
  valueEnd,
  maxValue
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  maxValue: number;
}): boolean {
  return range && valueStart === valueEnd && valueEnd === maxValue;
}

function isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue({
  range,
  valueStart,
  valueEnd,
  minValue
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  minValue: number;
}): boolean {
  return range && valueStart === valueEnd && valueStart === minValue;
}

function isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue({
  range,
  valueStart,
  valueEnd,
  prevValueStart
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  prevValueStart: number;
}): boolean {
  return range && valueStart === valueEnd && valueStart! > prevValueStart;
}

function isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue({
  range,
  valueStart,
  valueEnd,
  prevValueEnd
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  prevValueEnd: number;
}): boolean {
  return range && valueStart === valueEnd && valueEnd! < prevValueEnd;
}

function isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue({
  range,
  valueStart,
  valueEnd,
  prevValueStart
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  prevValueStart: number;
}): boolean {
  return range && valueStart! > valueEnd! && valueStart! > prevValueStart;
}

function isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue({
  range,
  valueStart,
  valueEnd,
  prevValueEnd
}: {
  range: boolean;
  valueStart: number;
  valueEnd: number;
  prevValueEnd: number;
}): boolean {
  return range && valueStart! > valueEnd! && valueEnd! < prevValueEnd;
}

function isMinValueEqualMaxValueAndMinValueBiggerPrevValue({
  minValue,
  maxValue,
  prevMinValue
}: {
  minValue: number;
  maxValue: number;
  prevMinValue: number;
}): boolean {
  return minValue === maxValue && minValue! > prevMinValue;
}

function isMinValueEqualMaxValueAndMaxValueLessPrevValue({
  minValue,
  maxValue,
  prevMaxValue
}: {
  minValue: number;
  maxValue: number;
  prevMaxValue: number;
}): boolean {
  return minValue === maxValue && maxValue! < prevMaxValue;
}

function isMinValueBiggerMaxValueAndMinValueBiggerPrevValue({
  minValue,
  maxValue,
  prevMinValue
}: {
  minValue: number;
  maxValue: number;
  prevMinValue: number;
}): boolean {
  return minValue! > maxValue! && minValue! > prevMinValue;
}

function isMinValueBiggerMaxValueAndMaxValueLessPrevValue({
  minValue,
  maxValue,
  prevMaxValue
}: {
  minValue: number;
  maxValue: number;
  prevMaxValue: number;
}): boolean {
  return minValue! > maxValue! && maxValue! < prevMaxValue;
}

function isNeedRound(value: number) {
  const minStepDecimalPart = findDecimalPart(MIN_STEP);
  const valueDecimalPart = findDecimalPart(value);

  if (valueDecimalPart > minStepDecimalPart) {
    return true;
  }
  return false;
}

function calculateValueStartBeforeMax({
  minValue,
  maxValue,
  step
}: {
  minValue: number;
  maxValue: number;
  step: number;
}): number {
  const delta = Math.abs(minValue - maxValue);
  let newValue = minValue + Math.floor(delta / step) * step;
  if (newValue === maxValue) {
    newValue -= step;
  }

  return roundToRequiredNumber(newValue);
}

export {
  isValueStartBiggerValueEnd,
  isValueStartBiggerMaxValue,
  isIncorrectStepInValueStart,
  isIncorrectStepInValueEnd,
  isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue,
  isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue,
  isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue,
  isMinValueEqualMaxValueAndMinValueBiggerPrevValue,
  isMinValueEqualMaxValueAndMaxValueLessPrevValue,
  isMinValueBiggerMaxValueAndMinValueBiggerPrevValue,
  isMinValueBiggerMaxValueAndMaxValueLessPrevValue,
  isNeedRound,
  calculateValueStartBeforeMax
};
