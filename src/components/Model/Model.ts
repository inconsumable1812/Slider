/* eslint-disable consistent-return */
import { MIN_STEP } from '../../constants';
import findClosestCorrectValue from '../../utils/findClosestCorrectValue';
import { roundToRequiredNumber } from '../../utils/utils';
import { DEFAULT_MODEL_OPTIONS } from '../default';
import { ModelOptions, ListenersName } from '../type';
import Observer from '../Observer/Observer';
import {
  isIncorrectStepInValueEnd,
  isIncorrectStepInValueStart,
  isValueStartBiggerMaxValue,
  isValueStartBiggerValueEnd,
  isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue,
  isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue,
  isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue,
  isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue,
  isMinValueEqualMaxValueAndMinValueBiggerPrevValue,
  isMinValueEqualMaxValueAndMaxValueLessPrevValue,
  isMinValueBiggerMaxValueAndMinValueBiggerPrevValue,
  isMinValueBiggerMaxValueAndMaxValueLessPrevValue
} from './Model.function';

class Model extends Observer {
  constructor(private options: Partial<ModelOptions> = DEFAULT_MODEL_OPTIONS) {
    super();
    this.init();
    this.checkOptions();
  }

  getOptions(): ModelOptions {
    return { ...this.options } as ModelOptions;
  }

  getFirstValue(): number {
    return this.options.valueStart!;
  }

  getSecondValue(): number {
    return this.options.valueEnd!;
  }

  setOptions(modelOptions: Partial<ModelOptions>): void {
    const { valueEnd, valueStart, step, minValue, maxValue } = this.options;

    this.options = { ...this.options, ...modelOptions };
    this.checkOptions(valueStart!, valueEnd!, step!, minValue!, maxValue!);
    this.emit(ListenersName.modelValueChange);
  }

  private init(): void {
    this.options = { ...DEFAULT_MODEL_OPTIONS, ...this.options };
  }

  private checkOptions(
    valueStart?: number,
    valueEnd?: number,
    step?: number,
    minValue?: number,
    maxValue?: number
  ): void {
    this.checkStep(step!);
    this.checkMinValueLessMax(minValue!, maxValue!);
    this.checkRangeLessThanStepSize();
    this.checkValueStartInRange();
    this.checkValueEndInRange();
    this.checkValueStartCorrectStep();
    this.checkValueEndCorrectStep();
    this.checkValueStartLessValueEnd(valueStart!, valueEnd!);
  }

  private checkStep(prevStep: number): void {
    const { step } = this.options;

    if (step! < MIN_STEP) {
      return this.setOptions({ step: MIN_STEP });
    }
    if (step !== prevStep) {
      return this.setOptions({ step: roundToRequiredNumber(step!) });
    }
  }

  private checkMinValueLessMax(
    prevMinValue: number,
    prevMaxValue: number
  ): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.options;

    if (
      isMinValueEqualMaxValueAndMinValueBiggerPrevValue(
        minValue!,
        maxValue!,
        prevMinValue
      )
    ) {
      return this.setOptions({
        maxValue: minValue! + step!,
        minValue: minValue
      });
    }

    if (
      isMinValueEqualMaxValueAndMaxValueLessPrevValue(
        minValue!,
        maxValue!,
        prevMaxValue
      )
    ) {
      return this.setOptions({
        maxValue: maxValue!,
        minValue: maxValue! - step!
      });
    }

    if (
      isMinValueBiggerMaxValueAndMinValueBiggerPrevValue(
        minValue!,
        maxValue!,
        prevMinValue
      )
    ) {
      return this.setOptions({
        maxValue: minValue! + step!,
        minValue: minValue!
      });
    }

    if (
      isMinValueBiggerMaxValueAndMaxValueLessPrevValue(
        minValue!,
        maxValue!,
        prevMaxValue
      )
    ) {
      return this.setOptions({
        maxValue: maxValue!,
        minValue: maxValue! - step!
      });
    }
  }

  private checkRangeLessThanStepSize(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.options;
    const range = Math.abs(maxValue! - minValue!);
    const rangeLess: boolean = range < step!;
    if (rangeLess) {
      return this.setOptions({ step: range });
    }
  }

  private checkValueStartInRange(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueStart, range } = this.options;

    if (valueStart! < minValue!) {
      return this.setOptions({ valueStart: minValue });
    }
    if (valueStart! > maxValue! && range) {
      return this.setOptions({ valueStart: maxValue! - step! });
    }
    if (valueStart! > maxValue!) {
      return this.setOptions({ valueStart: maxValue });
    }
  }

  private checkValueEndInRange(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueEnd } = this.options;
    if (valueEnd! < minValue!) {
      return this.setOptions({ valueEnd: minValue! + step! });
    }
    if (valueEnd! > maxValue!) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }

  private checkValueStartLessValueEnd(
    prevValueStart: number,
    prevValueEnd: number
  ): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueEnd, valueStart, range } =
      this.options;

    if (
      isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue(
        range!,
        valueStart!,
        valueEnd!,
        maxValue!
      )
    ) {
      return this.setOptions({ valueStart: valueStart! - step! });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue(
        range!,
        valueStart!,
        valueEnd!,
        minValue!
      )
    ) {
      return this.setOptions({ valueEnd: valueEnd! + step! });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue(
        range!,
        valueStart!,
        valueEnd!,
        prevValueStart
      )
    ) {
      return this.setOptions({
        valueEnd: valueStart! + step!,
        valueStart: valueStart!
      });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue(
        range!,
        valueStart!,
        valueEnd!,
        prevValueEnd
      )
    ) {
      return this.setOptions({
        valueEnd: valueEnd!,
        valueStart: valueEnd! - step!
      });
    }

    if (
      isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue(
        range!,
        valueStart!,
        valueEnd!,
        prevValueStart
      )
    ) {
      return this.setOptions({
        valueEnd: valueStart! + step!,
        valueStart: valueStart!
      });
    }

    if (
      isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue(
        range!,
        valueStart!,
        valueEnd!,
        prevValueEnd
      )
    ) {
      return this.setOptions({
        valueEnd: valueEnd!,
        valueStart: valueEnd! - step!
      });
    }

    if (isValueStartBiggerValueEnd(valueStart!, valueEnd!, maxValue!)) {
      return this.setOptions({ valueEnd: maxValue });
    }
    if (isValueStartBiggerMaxValue(valueStart!, valueEnd!, maxValue!)) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }

  private checkValueStartCorrectStep(): void | Partial<ModelOptions> {
    const { minValue, step, valueStart, maxValue } = this.options;

    if (isIncorrectStepInValueStart(minValue!, step!, valueStart!, maxValue!)) {
      const newValue = findClosestCorrectValue(
        step!,
        valueStart!,
        maxValue!,
        minValue!
      );

      return this.setOptions({
        valueStart: newValue
      });
    }
  }

  private checkValueEndCorrectStep(): void | Partial<ModelOptions> {
    const { maxValue, minValue, step, valueEnd } = this.options;
    if (isIncorrectStepInValueEnd(maxValue!, minValue!, step!, valueEnd!)) {
      const newValue = findClosestCorrectValue(
        step!,
        valueEnd!,
        maxValue!,
        minValue!
      );

      return this.setOptions({
        valueEnd: newValue
      });
    }
  }
}

export default Model;
