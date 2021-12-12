import { roundToRequiredNumber } from '../../../utils/utils';
import {
  JS_SCALE_POINT_CLASS,
  MIN_SCALE_POINT_COUNT
} from '../../../constants';
import { render } from '../../../utils/utils';
import Observer from '../../Observer/Observer';
import { ListenersName } from '../../type';

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

  deleteScalePoint(): void {
    const points = this.element.querySelectorAll(`.${JS_SCALE_POINT_CLASS}`);
    points.forEach((point) => point.remove());
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

  setScaleOptions(
    maxValue: number,
    minValue: number,
    step: number,
    scalePointCount: number
  ): void {
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.step = step;
    this.scalePointCount = scalePointCount;

    this.deleteScalePoint();
    this.renderScalePoint();
  }

  private init(): void {
    this.toHtml();
    this.renderScalePoint();

    const clickOnScaleCallback = (e: Event): void => {
      const target = e.target as HTMLElement;
      this.emit(ListenersName.clickOnScale, +target.textContent!);
    };

    this.element.addEventListener('click', clickOnScaleCallback);
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale"></div>
    `);
  }

  private renderScalePoint(): void {
    const { isVertical } = this;
    const arrayOfValue: number[][] = this.calculateStepValue();
    const arrayOfStepsValue: number[] = arrayOfValue[0];
    const arrayOfStepsStyleValue: number[] = arrayOfValue[1];

    const subElementStyle = isVertical ? 'top' : 'left';

    arrayOfStepsValue.forEach((el, index) => {
      this.subElement = render(`
      <div class="range-slider__scale_point ${JS_SCALE_POINT_CLASS}">${el}</div>
      `);
      this.subElement.style[subElementStyle] =
        arrayOfStepsStyleValue[index] + '%';

      if (index === arrayOfStepsValue.length - 1) {
        this.subElement.classList.add('range-slider__scale_point-end');
      }

      this.element.append(this.subElement);
    });
  }

  private calculateStepValue(): number[][] {
    const { minValue, maxValue, step, scalePointCount } = this;

    const range = Math.abs(maxValue - minValue);
    const isCountBigThanScalePoint = Math.floor(range / step) > scalePointCount;
    const actualScaleSize = isCountBigThanScalePoint
      ? Math.round(Math.round(range / step) / (scalePointCount - 1)) * step
      : step;

    let countOfSteps = scalePointCount;

    if (countOfSteps < MIN_SCALE_POINT_COUNT)
      countOfSteps = MIN_SCALE_POINT_COUNT;

    const arrayOfStepsValue = new Array(countOfSteps)
      .fill('')
      .map((_, index) => {
        let value = minValue + actualScaleSize * index;

        if (value > maxValue) value = maxValue;
        if (index === countOfSteps - 1) value = maxValue;
        return roundToRequiredNumber(value);
      })
      .filter((item, pos, arr) => !pos || item !== arr[pos - 1]);

    const arrayOfStepsStyleValue = new Array(countOfSteps)
      .fill('')
      .map((_, index) => {
        let styleValue = Math.abs(actualScaleSize / range) * index * 100;
        if (styleValue > 100) styleValue = 100;
        if (index === countOfSteps - 1) styleValue = 100;
        return roundToRequiredNumber(styleValue);
      })
      .filter((item, pos, arr) => !pos || item !== arr[pos - 1]);

    const arrayOfValue = [arrayOfStepsValue, arrayOfStepsStyleValue];
    return arrayOfValue;
  }
}

export default Scale;
