function calculateNewValue(
  minValue: number,
  maxValue: number,
  progressInPercents: number,
  step: number
) {
  let progressValue = Math.round((maxValue - minValue) * progressInPercents + minValue)
  let isCorrectNewValue = !((progressValue - minValue) % step)
  let value = progressValue

  let i = 1
  while (!isCorrectNewValue) {
    if ((progressValue - minValue) % step <= step / 2) {
      isCorrectNewValue = !((progressValue - i - minValue) % step)
      value = progressValue - i

      i++
    } else if ((progressValue - minValue) % step > step / 2) {
      isCorrectNewValue = !((progressValue + i - minValue) % step)
      if (value >= maxValue) {
        value = maxValue
        break
      }
      value = progressValue + i
      i++
    } else {
      break
    }
  }

  return value
}

export default calculateNewValue
