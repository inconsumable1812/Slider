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
    ((Math.abs(valueStart - minValue) % step) as unknown as boolean) &&
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
    ((Math.abs(valueEnd - minValue) % step) as unknown as boolean) &&
    valueEnd !== maxValue
  );
}

function findClosestCorrectValue(
  step: number,
  value: number,
  maxValue: number,
  minValue: number
) {
  const delta = (value - minValue) % step;
  const deltaOfMaxValue = maxValue % step;
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let newValue = value;
  const incorrectValue = (newValue - minValue) % step;

  if (delta < step / 2) {
    if (newValue > lastValueBeforeMax) {
      if (Math.abs(newValue - lastValueBeforeMax) >= deltaOfMaxValue / 2) {
        while (newValue !== maxValue) {
          newValue += 1;
        }
      } else {
        while (incorrectValue) {
          newValue -= 1;
        }
      }
    } else {
      while (incorrectValue) {
        newValue -= 1;
      }
    }
    return newValue;
  }
  while (incorrectValue) {
    newValue += 1;
  }
  return newValue;
}

export {
  isValueStartBiggerValueEnd,
  isValueStartBiggerMaxValue,
  isIncorrectStepInValueStart,
  isIncorrectStepInValueEnd,
  findClosestCorrectValue
};
