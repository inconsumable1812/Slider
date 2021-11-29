import Handle from './handle/Handle';

function findClosestHandle(firstHandle: Handle, secondHandle: Handle, clickValue: number): Handle {
  const firstValue: number = firstHandle.getValue();
  const secondValue: number = secondHandle.getValue();
  if (Math.abs(firstValue - clickValue) <= Math.abs(secondValue - clickValue)) {
    return firstHandle;
  }
  return secondHandle;
}

function searchStyleValue(minValue: number, maxValue: number, progress: number): number {
  return (100 / (maxValue - minValue)) * (progress - minValue);
}

function isClickFromSecondHandlePosition(
  click: number,
  styleValue: number,
  firstHandle: Handle,
  secondHandle: Handle
): boolean {
  return (
    click > styleValue / 100 &&
    firstHandle.getStyleValue() < styleValue &&
    Math.abs(firstHandle.getStyleValue() / 100 - click) >
      Math.abs(secondHandle!.getStyleValue() / 100 - click)
  );
}

export { findClosestHandle, searchStyleValue, isClickFromSecondHandlePosition };
