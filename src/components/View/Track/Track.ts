import { render } from '../../../utils/utils';
import findClosestCorrectValue from '../../../utils/findClosestCorrectValue';
import Observer from '../../Observer/Observer';
import { ListenersName, trackProps } from '../../type';

class Track extends Observer {
  element!: HTMLElement;
  minValue: number;
  maxValue: number;
  isVertical: boolean;
  step: number;

  constructor({ minValue, maxValue, isVertical, step }: trackProps) {
    super();
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.isVertical = isVertical;
    this.step = step;
    this.toHtml();
  }

  getMinValue(): number {
    return this.minValue;
  }

  getMaxValue(): number {
    return this.maxValue;
  }

  getStep(): number {
    return this.step;
  }

  getOrientation(): boolean {
    return this.isVertical;
  }

  setMaxMinValueAndStep(
    maxValue: number,
    minValue: number,
    step: number
  ): void {
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.step = step;
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  private toHtml(): void {
    this.element = render(`<div class="range-slider__track"></div>`);

    const clickEvent = (event: MouseEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const { minValue, maxValue, isVertical, step } = this;
      const widthOrHeight = isVertical
        ? target.getBoundingClientRect().height
        : target.getBoundingClientRect().width;

      const borderWidthPx = getComputedStyle(target).borderWidth;
      const borderWidth = Math.round(+borderWidthPx.slice(0, -2));
      const offset = isVertical
        ? event.offsetY + borderWidth
        : event.offsetX + borderWidth;

      const progress = offset / widthOrHeight;
      const clickValue = (maxValue - minValue) * progress + minValue;

      const newValue = findClosestCorrectValue(
        step,
        clickValue,
        maxValue,
        minValue
      );

      this.emit(ListenersName.clickOnTrack, {
        event,
        value: newValue,
        click: progress
      });
    };

    this.element.addEventListener('pointerdown', clickEvent);
  }
}

export default Track;
