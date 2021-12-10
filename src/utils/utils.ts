/* eslint-disable no-restricted-globals */
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

function camelCaseToDash(myStr: string): string {
  return myStr.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function camelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}

function toNumber(value: string, valFromOptions: number): number {
  if (value.trim() === '') return valFromOptions;
  if (isNaN(Number(value))) return valFromOptions;
  return Number(value);
}

function toBoolean(value: string): boolean {
  if (value === 'true') return true;
  return false;
}

function isNeedToChangeValue(value: string): boolean {
  if (value.trim() === '') return true;
  if (isNaN(Number(value))) return true;
  return false;
}

function isNeedToChangeIfValueBoolean(value: string): boolean {
  if (value === 'false') return false;
  if (value === 'true') return false;
  return true;
}

export {
  roundToRequiredNumber,
  render,
  camelCaseToDash,
  camelCase,
  toNumber,
  isNeedToChangeValue,
  toBoolean,
  isNeedToChangeIfValueBoolean
};
