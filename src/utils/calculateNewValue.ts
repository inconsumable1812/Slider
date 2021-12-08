import {
  STEP_NUMBER_OF_ZEROS,
  MIN_STEP,
  STEP_DECIMAL_PART
} from '../constants';

function calculateNewValue(
  minValue: number,
  maxValue: number,
  progressInPercents: number,
  step: number
): number {
  const progressValue = +(
    (maxValue - minValue) * progressInPercents +
    minValue
  ).toFixed(STEP_NUMBER_OF_ZEROS);

  const delta = +((progressValue - minValue) % step).toFixed(
    STEP_NUMBER_OF_ZEROS
  );

  const deltaOfMaxValue = maxValue % step;
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let newValue = +progressValue.toFixed(STEP_NUMBER_OF_ZEROS);
  let incorrectValue = +(
    ((newValue - minValue) * STEP_DECIMAL_PART) %
    (step * STEP_DECIMAL_PART)
  ).toFixed(STEP_NUMBER_OF_ZEROS);

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
    const roundValue = +newValue.toFixed(STEP_NUMBER_OF_ZEROS) - MIN_STEP;
    newValue = +roundValue.toFixed(STEP_NUMBER_OF_ZEROS);

    incorrectValue = +(
      ((newValue - minValue) * STEP_DECIMAL_PART) %
      (step * STEP_DECIMAL_PART)
    ).toFixed(STEP_NUMBER_OF_ZEROS);
  }
  return +newValue.toFixed(STEP_NUMBER_OF_ZEROS);
}

export default calculateNewValue;
