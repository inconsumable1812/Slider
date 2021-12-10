import {
  TOOLTIP_HIDE_CLASS,
  Z_INDEX_DEFAULT,
  Z_INDEX_BIG
} from '../../../constants';
import { roundToRequiredNumber } from '../../../utils/utils';
import { render } from '../../../utils/utils';
import Observer from '../../Observer/Observer';
import { ListenersName } from '../../type';
import Track from '../Track/Track';

class Handle extends Observer {
  private elements!: { handle: HTMLElement; tooltip: HTMLElement };
  element!: HTMLElement;

  constructor(
    private handleNumber: number,
    private value: number,
    private showTooltip: boolean,
    private isVertical: boolean,
    private track: Track,
    private step: number
  ) {
    super();
    this.toHtml();
  }

  handleMouseDown(event: MouseEvent): void {
    event.preventDefault();

    const handleMouseMove = (e: MouseEvent) => this.handleMouseMove(e);

    document.addEventListener('pointermove', handleMouseMove);

    const handleMouseUp = (): void => {
      document.removeEventListener('pointerup', handleMouseUp);
      document.removeEventListener('pointermove', handleMouseMove);
    };

    document.addEventListener('pointerup', handleMouseUp);
  }

  showTooltipMethod(): void {
    this.elements.tooltip.classList.remove(TOOLTIP_HIDE_CLASS);
  }

  updateStep(newValue: number): void {
    this.step = newValue;
  }

  hideTooltip(): void {
    this.elements.tooltip.classList.add(TOOLTIP_HIDE_CLASS);
  }

  getElement(): HTMLElement {
    return this.elements.handle;
  }

  getTooltip(): HTMLElement {
    return this.elements.tooltip;
  }

  getValue(): number {
    return +this.value;
  }

  getStyleValue(): number {
    return this.isVertical
      ? +this.elements.handle.style.top.slice(0, -1)
      : +this.elements.handle.style.left.slice(0, -1);
  }

  setValue(value: number): void {
    if (this.getValue() !== value) {
      this.value = value;
      if (!this.getTooltipContent()?.includes('...')) {
        this.setTooltipContent();
      }
    }
  }

  setZIndex(styleValue: number): void {
    if (styleValue >= 97) {
      this.elements.handle.style.zIndex = Z_INDEX_BIG;
    } else if (this.elements.handle.style.zIndex === Z_INDEX_BIG) {
      this.elements.handle.style.zIndex = Z_INDEX_DEFAULT;
    }
  }

  getTooltipContent(): string | null {
    return this.elements.tooltip.textContent;
  }

  clearTooltipContent(): void {
    this.elements.tooltip.textContent = '';
    this.elements.tooltip.classList.add(TOOLTIP_HIDE_CLASS);
  }

  setTooltipContent(value?: string): void {
    if (value) {
      if (this.getTooltipContent() !== value) {
        this.clearTooltipContent();
        this.elements.tooltip.textContent = value;
      }
    } else {
      this.elements.tooltip.textContent = this.getValue().toString();
    }
  }

  setStyle(value: number): void {
    if (this.getStyleValue() !== value) {
      // eslint-disable-next-line no-unused-expressions
      this.isVertical
        ? (this.elements.handle.style.top = value + '%')
        : (this.elements.handle.style.left = value + '%');
      if (this.handleNumber === 1) {
        this.setZIndex(this.getStyleValue());
      }
    }
  }

  clearStyle(): void {
    // eslint-disable-next-line no-unused-expressions
    this.isVertical
      ? (this.elements.handle.style.left = -4.5 + 'px')
      : (this.elements.handle.style.top = -4.5 + 'px');
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__handle range-slider__handle_num_${this.handleNumber}">
      <div class="range-slider__tooltip js-range-slider__tooltip">${this.value}</div>
    </div>`);
    this.elements = {
      handle: this.element,
      tooltip: this.element.querySelector(
        `.js-range-slider__tooltip`
      ) as HTMLElement
    };
    if (!this.showTooltip) {
      this.hideTooltip();
    }

    this.bindListenersToHandle(this.element);
  }

  private bindListenersToHandle(handle: HTMLElement): void {
    const handleMouseDown = (event: MouseEvent): void =>
      this.handleMouseDown(event);
    handle.addEventListener('pointerdown', handleMouseDown);
  }

  private handleMouseMove(event: MouseEvent): void {
    const { track, isVertical, step } = this;

    const valueInPx: number = isVertical
      ? event.clientY - track.element.getBoundingClientRect().top
      : event.clientX - track.element.getBoundingClientRect().left;

    const widthOrHeight: number = isVertical
      ? track.element.getBoundingClientRect().height
      : track.element.getBoundingClientRect().width;

    const valueInPercent: number = valueInPx / widthOrHeight;
    const valueInPercentRoundTo4: number =
      Math.round(valueInPercent * 10000) / 10000;

    const delta: number = track.getMaxValue() - track.getMinValue();

    const valueCorrectInStepSize: number =
      delta * valueInPercentRoundTo4 -
      ((delta * valueInPercentRoundTo4) % step);

    let newValue: number =
      roundToRequiredNumber(track.getMinValue()) +
      roundToRequiredNumber(valueCorrectInStepSize);

    if (valueInPercent <= 0) {
      newValue = track.getMinValue();
    } else if (valueInPercent >= 1) {
      newValue = track.getMaxValue();
    }

    this.emit(ListenersName.clickOnHandle, roundToRequiredNumber(newValue));
  }
}

export default Handle;
