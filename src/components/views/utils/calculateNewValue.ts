function calculateNewValue(
  minValue: number,
  maxValue: number,
  progressInPercents: number,
  step: number
): number {
  const progressValue = Math.round(
    (maxValue - minValue) * progressInPercents + minValue
  );
  const delta = (progressValue - minValue) % step;
  const deltaOfMaxValue = maxValue % step;
  const lastValueBeforeMax = maxValue - deltaOfMaxValue;

  let incorrectValue = (progressValue - minValue) % step;
  let newValue = progressValue;

  if (delta < step / 2) {
    if (newValue > lastValueBeforeMax) {
      if (Math.abs(newValue - lastValueBeforeMax) >= deltaOfMaxValue / 2) {
        while (newValue !== maxValue) {
          newValue += 1;
        }
      } else {
        while (incorrectValue) {
          newValue -= 1;
          incorrectValue = (newValue - minValue) % step;
        }
      }
    } else {
      while (incorrectValue) {
        newValue -= 1;
        incorrectValue = (newValue - minValue) % step;
      }
    }
    return newValue;
  }
  while (incorrectValue) {
    newValue += 1;
    incorrectValue = (newValue - minValue) % step;
  }
  return newValue;
}

export default calculateNewValue;
