import Handle from './handle/Handle';

function findClosestHandle({
  firstHandle,
  secondHandle,
  clickValue
}: {
  firstHandle: Handle;
  secondHandle: Handle;
  clickValue: number;
}): Handle {
  const firstValue: number = firstHandle.getValue();
  const secondValue: number = secondHandle.getValue();
  if (Math.abs(firstValue - clickValue) <= Math.abs(secondValue - clickValue)) {
    return firstHandle;
  }
  return secondHandle;
}

function searchStyleValue({
  minValue,
  maxValue,
  progress
}: {
  minValue: number;
  maxValue: number;
  progress: number;
}): number {
  return (100 / (maxValue - minValue)) * (progress - minValue);
}

function isClickFromSecondHandlePosition({
  click,
  styleValue,
  firstHandle,
  secondHandle
}: {
  click: number;
  styleValue: number;
  firstHandle: Handle;
  secondHandle: Handle;
}): boolean {
  return (
    click > styleValue / 100 &&
    firstHandle.getStyleValue() < styleValue &&
    Math.abs(firstHandle.getStyleValue() / 100 - click) >
      Math.abs(secondHandle!.getStyleValue() / 100 - click)
  );
}

function isNewValueCorrect({
  handle,
  newValue,
  firstHandle,
  secondHandle
}: {
  handle: Handle;
  newValue: number;
  firstHandle: Handle;
  secondHandle: Handle;
}): boolean {
  if (handle === secondHandle) {
    return newValue > firstHandle.getValue();
  }
  if (handle === firstHandle) {
    return newValue < secondHandle!.getValue();
  }
  return false;
}

function isRangeAndShowProgress(
  range: boolean,
  showProgress: boolean
): boolean {
  return range && showProgress;
}

function isNotRangeAndShowProgress(
  range: boolean,
  showProgress: boolean
): boolean {
  return !range && showProgress;
}

function isNotRangeAndStayMergeTooltip(
  range: boolean,
  firstHandle: Handle
): boolean {
  return !range && firstHandle.getTooltipContent()!.includes('...');
}

function isShowTooltipAndRange(showTooltip: boolean, range: boolean): boolean {
  return showTooltip && range;
}

function isHideTooltipAndRange(showTooltip: boolean, range: boolean): boolean {
  return !showTooltip && range;
}

function isFirstHandleRangeAndShowProgress({
  firstHandle,
  closestHandle,
  range,
  showProgress
}: {
  firstHandle: Handle;
  closestHandle: Handle;
  range: boolean;
  showProgress: boolean;
}): boolean {
  return range && showProgress && closestHandle === firstHandle;
}

function isSecondHandleRangeAndShowProgress({
  secondHandle,
  closestHandle,
  range,
  showProgress
}: {
  secondHandle: Handle;
  closestHandle: Handle;
  range: boolean;
  showProgress: boolean;
}): boolean {
  return range && showProgress && closestHandle === secondHandle;
}

export {
  findClosestHandle,
  searchStyleValue,
  isClickFromSecondHandlePosition,
  isRangeAndShowProgress,
  isNotRangeAndShowProgress,
  isNotRangeAndStayMergeTooltip,
  isShowTooltipAndRange,
  isHideTooltipAndRange,
  isNewValueCorrect,
  isFirstHandleRangeAndShowProgress,
  isSecondHandleRangeAndShowProgress
};
