import { render } from '../../../utils/utils';
import Observer from '../../Observer/Observer';
import { ViewListeners, TrackProps } from '../../type';

class Track extends Observer<{
  clickOnTrack: { event: MouseEvent; progressPercent: number };
}> {
  private element!: HTMLElement;
  private minValue: number;
  private maxValue: number;
  private isVertical: boolean;
  private step: number;

  constructor({ minValue, maxValue, isVertical, step }: TrackProps) {
    super();
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.isVertical = isVertical;
    this.step = step;
    this.toHtml();
  }

  getElement(): HTMLElement {
    return this.element;
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
      const { isVertical } = this;
      const widthOrHeight = isVertical
        ? target.getBoundingClientRect().height
        : target.getBoundingClientRect().width;

      const borderWidthPx = getComputedStyle(target).borderWidth;
      const borderWidth = Math.round(+borderWidthPx.slice(0, -2));
      const offset = isVertical
        ? event.offsetY + borderWidth
        : event.offsetX + borderWidth;

      const progressPercent = offset / widthOrHeight;

      this.emit(ViewListeners.clickOnTrack, {
        event,
        progressPercent
      });
    };

    this.element.addEventListener('pointerdown', clickEvent);
  }
}

export default Track;
