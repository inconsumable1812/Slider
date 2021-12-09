import { STEP_DECIMAL_PART } from '../constants';

function render(html: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild as HTMLElement;
}

function roundToRequiredNumber(
  value: number,
  minValue?: number,
  step?: number
) {
  if (minValue !== undefined && step !== undefined) {
    return (
      (Math.round((value - minValue) * STEP_DECIMAL_PART) %
        Math.round(step * STEP_DECIMAL_PART)) /
      STEP_DECIMAL_PART
    );
  }

  return Math.round(value * STEP_DECIMAL_PART) / STEP_DECIMAL_PART;
}

export { roundToRequiredNumber, render };
