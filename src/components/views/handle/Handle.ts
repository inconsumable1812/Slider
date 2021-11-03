/* eslint-disable no-unused-expressions */
import render from '../utils/render';
import Track from '../Track/Track';
import Observer from '../../observer/Observer';

class Handle extends Observer {
  private elements!: { handle: HTMLElement; tooltip: HTMLElement };
  element!: HTMLElement;

  constructor(
    private handleNumber: number = 1,
    private value: number = 10,
    private showTooltip: boolean = true,
    private isVertical: boolean = false,
    private track: Track,
    private step: number
  ) {
    super();
    this.toHtml();
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__handle range-slider__handle_num_${this.handleNumber}">
      <div class="range-slider__tooltip js-range-slider__tooltip">${this.value}</div>
    </div>`);
    this.elements = {
      handle: this.element,
      tooltip: this.element.querySelector(`.js-range-slider__tooltip`) as HTMLElement
    };
    if (!this.showTooltip) {
      this.hideTooltip();
    }
  }

  showTooltipMethod(): void {
    this.elements.tooltip.classList.remove('range-slider__tooltip_hide');
  }

  hideTooltip(): void {
    this.elements.tooltip.classList.add('range-slider__tooltip_hide');
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
      if (!this.getTooltipContent()?.includes('-')) {
        this.elements.tooltip.textContent = this.value.toString();
      }
      if (this.handleNumber === 1) {
        this.setZIndex(this.getStyleValue());
      }
    }
  }

  setZIndex(styleValue: number): void {
    if (styleValue >= 97) {
      this.elements.handle.style.zIndex = '50';
    } else if (this.elements.handle.style.zIndex === '50') {
      this.elements.handle.style.zIndex = '1';
    }
  }

  getTooltipContent(): string | null {
    return this.elements.tooltip.textContent;
  }

  clearTooltipContent(): void {
    this.elements.tooltip.textContent = '';
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
      this.isVertical
        ? (this.elements.handle.style.top = value + '%')
        : (this.elements.handle.style.left = value + '%');
    }
  }

  clearStyle(): void {
    this.isVertical
      ? (this.elements.handle.style.left = -4.5 + 'px')
      : (this.elements.handle.style.top = -4.5 + 'px');
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical;
  }
}

export default Handle;
