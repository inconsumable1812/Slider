import Handle from './handle/Handle';
import { MERGED_TOOLTIP_CLASS } from '../../constants';

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

function findClosestHandleFromPercent({
  firstHandle,
  secondHandle,
  percent
}: {
  firstHandle: Handle;
  secondHandle: Handle;
  percent: number;
}): Handle {
  const actualPercent = percent * 100;
  const firstStyleValue = firstHandle.getStyleValue();
  const secondStyleValue = secondHandle.getStyleValue();
  if (firstStyleValue - actualPercent <= secondStyleValue - actualPercent) {
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
  percent,
  firstHandle,
  secondHandle
}: {
  percent: number;
  firstHandle: Handle;
  secondHandle: Handle;
}): boolean {
  const actualPercent = percent * 100;
  const firstStyleValue = firstHandle.getStyleValue();
  const secondStyleValue = secondHandle.getStyleValue();

  return (
    Math.abs(firstStyleValue - actualPercent) >
    Math.abs(secondStyleValue - actualPercent)
  );
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
  const tooltipContent = firstHandle.getTooltipContent();
  if (tooltipContent === null) {
    return false;
  }
  return !range && tooltipContent.includes('...');
}

function isShowTooltipAndRange(showTooltip: boolean, range: boolean): boolean {
  return showTooltip && range;
}

function isHideTooltipAndRange(showTooltip: boolean, range: boolean): boolean {
  return !showTooltip && range;
}

function isNewValueStartBiggerValueEnd({
  percent,
  secondHandle,
  range,
  step,
  maxValue,
  minValue
}: {
  percent: number;
  secondHandle: Handle;
  range: boolean;
  step: number;
  maxValue: number;
  minValue: number;
}): boolean {
  const styleSize = (step / Math.abs(minValue - maxValue)) * 100;
  return (
    percent * 100 >= secondHandle.getStyleValue() - styleSize &&
    range &&
    secondHandle.getStyleValue() !== 100
  );
}

function isNewValueEndLessValueStart({
  percent,
  firstHandle,
  step,
  maxValue,
  minValue
}: {
  percent: number;
  firstHandle: Handle;
  step: number;
  maxValue: number;
  minValue: number;
}): boolean {
  const styleSize = (step / Math.abs(minValue - maxValue)) * 100;
  return percent * 100 <= firstHandle.getStyleValue() + styleSize;
}

function isNotRangeAndContainsClassListMerged(
  range: boolean,
  firstHandle: Handle
) {
  return (
    !range && firstHandle.getTooltip().classList.contains(MERGED_TOOLTIP_CLASS)
  );
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
  isNewValueStartBiggerValueEnd,
  isNewValueEndLessValueStart,
  isNotRangeAndContainsClassListMerged,
  findClosestHandleFromPercent
};
