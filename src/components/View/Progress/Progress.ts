import render from '../../../utils/render';

class Progress {
  element!: HTMLElement;

  constructor(private isVertical: boolean) {
    this.toHtml();
  }

  setStart(start: number): void {
    this.element.style.left = '0%';
    this.element.style.top = '0%';

    // eslint-disable-next-line no-unused-expressions
    this.isVertical
      ? (this.element.style.top = start + '%')
      : (this.element.style.left = start + '%');
  }
  setEnd(end: number): void {
    this.element.style.bottom = '0%';
    this.element.style.right = '0%';

    // eslint-disable-next-line no-unused-expressions
    this.isVertical
      ? (this.element.style.bottom = 100 - end + '%')
      : (this.element.style.right = 100 - end + '%');
  }

  setStyle(start: number, end: number): void {
    this.setStart(start);
    this.setEnd(end);
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__progress"></div>
    `);
  }
}

export default Progress;
