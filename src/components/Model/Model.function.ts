import {
  MIN_STEP,
  STEP_DECIMAL_PART,
  STEP_NUMBER_OF_ZEROS
} from '../../constants';

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
  // console.log(
  //   Math.round(Math.abs(valueStart - minValue) * STEP_DECIMAL_PART) %
  //     (step * STEP_DECIMAL_PART)
  // );

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

function findClosestCorrectValue(
  step: number,
  value: number,
  maxValue: number,
  minValue: number
) {
  const delta = +((value - minValue) % step).toFixed(STEP_NUMBER_OF_ZEROS);
  const deltaOfMaxValue = maxValue % step;
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let newValue = +value.toFixed(STEP_NUMBER_OF_ZEROS);

  let incorrectValue = +((newValue - minValue) % step).toFixed(
    STEP_NUMBER_OF_ZEROS
  );

  if (delta < step / 2) {
    if (newValue > lastValueBeforeMax) {
      if (Math.abs(newValue - lastValueBeforeMax) >= deltaOfMaxValue / 2) {
        while (newValue !== maxValue) {
          const roundValue = +newValue.toFixed(STEP_NUMBER_OF_ZEROS) + MIN_STEP;
          newValue = +roundValue.toFixed(STEP_NUMBER_OF_ZEROS);
        }
      } else {
        while (incorrectValue) {
          const roundValue = +newValue.toFixed(STEP_NUMBER_OF_ZEROS) - MIN_STEP;
          newValue = +roundValue.toFixed(STEP_NUMBER_OF_ZEROS);
          incorrectValue = +(
            ((newValue - minValue) * STEP_DECIMAL_PART) %
            (step * STEP_DECIMAL_PART)
          ).toFixed(STEP_NUMBER_OF_ZEROS);
        }
      }
    } else {
      while (incorrectValue) {
        const roundValue = +newValue.toFixed(STEP_NUMBER_OF_ZEROS) - MIN_STEP;
        newValue = +roundValue.toFixed(STEP_NUMBER_OF_ZEROS);
        incorrectValue = +(
          ((newValue - minValue) * STEP_DECIMAL_PART) %
          (step * STEP_DECIMAL_PART)
        ).toFixed(STEP_NUMBER_OF_ZEROS);
      }
    }
    return +newValue.toFixed(STEP_NUMBER_OF_ZEROS);
  }
  while (incorrectValue) {
    const roundValue = +newValue.toFixed(STEP_NUMBER_OF_ZEROS) + MIN_STEP;
    newValue = +roundValue.toFixed(STEP_NUMBER_OF_ZEROS);
    incorrectValue = +(
      ((newValue - minValue) * STEP_DECIMAL_PART) %
      (step * STEP_DECIMAL_PART)
    ).toFixed(STEP_NUMBER_OF_ZEROS);
  }
  return +newValue.toFixed(STEP_NUMBER_OF_ZEROS);
}

export {
  isValueStartBiggerValueEnd,
  isValueStartBiggerMaxValue,
  isIncorrectStepInValueStart,
  isIncorrectStepInValueEnd,
  findClosestCorrectValue,
  isShouldRound
};
