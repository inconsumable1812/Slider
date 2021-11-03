import Observer from '../../observer/Observer';
import render from '../utils/render';

class Scale extends Observer {
  element!: HTMLElement;
  subElement!: HTMLElement;

  constructor(
    private minValue: number,
    private maxValue: number,
    private scalePointCount: number,
    private step: number,
    private isVertical: boolean
  ) {
    super();
    this.init();
  }

  private init(): void {
    this.toHtml();
    this.renderScalePoint();
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale"></div>
    `);
  }

  private renderScalePoint(): void {
    const { isVertical, scalePointCount } = this;
    const arrayOfValue: number[][] = this.calculateStepValue();
    const arrayOfStepsValue: number[] = arrayOfValue[0];
    const arrayOfStepsStyleValue: number[] = arrayOfValue[1];
    const scalePointCountLess: boolean = scalePointCount < arrayOfStepsValue.length;
    const actualCount: number = scalePointCountLess
      ? arrayOfStepsValue.length - 1
      : arrayOfStepsValue.length;

    const subElementStyle: string = isVertical ? 'top' : 'left';

    let j = 0;
    for (let i = 0; i < actualCount; i += 1) {
      if (scalePointCountLess && i === actualCount - 1) {
        j = i;
        i += 1;
      }
      this.subElement = render(`
      <div class="range-slider__scale_point">${arrayOfStepsValue[i]}</div>
    `);
      this.subElement.style[subElementStyle] = arrayOfStepsStyleValue[i] + '%';
      if (i === actualCount - 1 || j === actualCount - 1) {
        this.subElement.classList.add('range-slider__scale_point-end');
      }
      this.element.append(this.subElement);
    }
  }

  deleteScalePoint(): void {
    const points = this.element.querySelectorAll('.range-slider__scale_point');
    points.forEach((point) => point.remove());
  }

  private calculateStepValue(): number[][] {
    const { minValue, maxValue, step, scalePointCount } = this;
    const range = Math.abs(maxValue - minValue);
    const isLastStepBigThanMaxValue: boolean = (range % step) as unknown as boolean;
    const isCountBigThanScalePoint = Math.floor(range / step) > scalePointCount;
    const actualScaleSize = isCountBigThanScalePoint
      ? Math.round(Math.round(range / step) / (scalePointCount - 1)) * step
      : step;
    let countOfSteps = isCountBigThanScalePoint ? scalePointCount - 1 : Math.floor(range / step);

    countOfSteps = isLastStepBigThanMaxValue ? countOfSteps + 1 : countOfSteps;

    const arrayOfStepsValue = [];
    const arrayOfStepsStyleValue = [];
    for (let i = 0; i <= countOfSteps; i += 1) {
      let stepsValue = +(minValue + actualScaleSize * i).toFixed(0);
      stepsValue = stepsValue > maxValue ? maxValue : stepsValue;
      stepsValue = i === countOfSteps ? maxValue : stepsValue;
      arrayOfStepsValue.push(stepsValue);

      let stepStyleValue = Math.abs(actualScaleSize / range) * i * 100;
      stepStyleValue = stepStyleValue > 100 ? 100 : +stepStyleValue.toFixed(0);
      arrayOfStepsStyleValue.push(stepStyleValue);
    }
    const arrayOfValue = [arrayOfStepsValue, arrayOfStepsStyleValue];

    return arrayOfValue;
  }

  getArrayOfValue(): number[] {
    return this.calculateStepValue()[0];
  }

  getSubElement(): HTMLElement {
    return this.subElement;
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  setScaleOptions(maxValue: number, minValue: number, step: number, scalePointCount: number): void {
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.step = step;
    this.scalePointCount = scalePointCount;
    this.deleteScalePoint();
    this.renderScalePoint();
  }
}

export default Scale;
