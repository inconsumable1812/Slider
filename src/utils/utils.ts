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

function filterModelOptions(element: string): boolean {
  return (
    element === 'minValue' ||
    element === 'maxValue' ||
    element === 'valueStart' ||
    element === 'valueEnd' ||
    element === 'step' ||
    element === 'range'
  );
}

function filterViewOptions(element: string): boolean {
  return (
    element === 'scalePointCount' ||
    element === 'showTooltip' ||
    element === 'isVertical' ||
    element === 'showProgress' ||
    element === 'showScale'
  );
}

function objectFilter(
  obj: object,
  predicate: (value: [string, string]) => boolean
) {
  return Object.fromEntries(Object.entries(obj).filter(predicate));
}

function findDecimalPart(value: number) {
  let numberOfDecimal = 0;
  if (value.toString().includes('.')) {
    numberOfDecimal = value.toString().split('.').pop()!.length;
  }
  return numberOfDecimal;
}

function atrOldValueIsNumber(atrOldValue: string): boolean {
  return (
    atrOldValue === 'data-min-value' ||
    atrOldValue === 'data-max-value' ||
    atrOldValue === 'data-step' ||
    atrOldValue === 'data-value-start' ||
    atrOldValue === 'data-value-end' ||
    atrOldValue === 'data-scale-point-count'
  );
}

function atrOldValueIsBoolean(atrOldValue: string): boolean {
  return (
    atrOldValue === 'data-range' ||
    atrOldValue === 'data-show-tooltip' ||
    atrOldValue === 'data-is-vertical' ||
    atrOldValue === 'data-show-progress' ||
    atrOldValue === 'data-show-scale'
  );
}

function isNeedToChangeNewVal(
  AtrName: string,
  newValues: Record<string, string>
): boolean {
  if (atrOldValueIsNumber(AtrName)) {
    return isNeedToChangeValue(newValues[AtrName]);
  }
  if (atrOldValueIsBoolean(AtrName)) {
    return isNeedToChangeIfValueBoolean(newValues[AtrName]);
  }
  return false;
}

export {
  roundToRequiredNumber,
  render,
  camelCaseToDash,
  camelCase,
  toNumber,
  isNeedToChangeValue,
  toBoolean,
  isNeedToChangeIfValueBoolean,
  filterModelOptions,
  objectFilter,
  filterViewOptions,
  findDecimalPart,
  atrOldValueIsNumber,
  atrOldValueIsBoolean,
  isNeedToChangeNewVal
};
