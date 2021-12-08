import { STEP_DECIMAL_PART } from '../../constants';

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

function isMinValueEqualMaxValueAndMinValueBiggerPrevValue(
  minValue: number,
  maxValue: number,
  prevMinValue: number
): boolean {
  return minValue === maxValue && minValue! > prevMinValue;
}

function isMinValueEqualMaxValueAndMaxValueLessPrevValue(
  minValue: number,
  maxValue: number,
  prevMaxValue: number
): boolean {
  return minValue === maxValue && maxValue! < prevMaxValue;
}

function isMinValueBiggerMaxValueAndMinValueBiggerPrevValue(
  minValue: number,
  maxValue: number,
  prevMinValue: number
): boolean {
  return minValue! > maxValue! && minValue! > prevMinValue;
}

function isMinValueBiggerMaxValueAndMaxValueLessPrevValue(
  minValue: number,
  maxValue: number,
  prevMaxValue: number
): boolean {
  return minValue! > maxValue! && maxValue! < prevMaxValue;
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
  isMinValueBiggerMaxValueAndMaxValueLessPrevValue
};
