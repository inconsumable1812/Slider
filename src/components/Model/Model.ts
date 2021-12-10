/* eslint-disable consistent-return */
import { MIN_STEP } from '../../constants';
import findClosestCorrectValue from '../../utils/findClosestCorrectValue';
import {
  roundToRequiredNumber,
  camelCaseToDash,
  toNumber,
  isNeedToChangeValue,
  toBoolean,
  isNeedToChangeIfValueBoolean
} from '../../utils/utils';
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
  constructor(
    private options: Partial<ModelOptions> = DEFAULT_MODEL_OPTIONS,
    private selector: HTMLElement
  ) {
    super();
    this.init();
    this.checkOptions();
    this.observeAtr();
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

  private setDataAtr() {
    const keys = Object.keys(this.getOptions());
    const values = Object.values(this.getOptions());
    const container = this.selector;

    const keysDash = keys.map((el) => camelCaseToDash(el));
    keysDash.forEach((el, i) =>
      container.setAttribute('data-' + el, values[i].toString())
    );
  }

  private observeAtr() {
    this.observeValueStartAtr();
    this.observeValueEndAtr();
    this.observeMinValueAtr();
    this.observeMaxValueAtr();
    this.observeStepAtr();
    this.observeRangeAtr();
  }

  private observeValueStartAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'valueStart';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().valueStart;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute(
          'data-value-start',
          valFromOptions.toString()
        );
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ valueStart: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-value-start']
    });
  }

  private observeValueEndAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'valueEnd';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().valueEnd;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute('data-value-end', valFromOptions.toString());
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ valueEnd: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-value-end']
    });
  }

  private observeMinValueAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'minValue';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().minValue;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute('data-min-value', valFromOptions.toString());
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ minValue: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-min-value']
    });
  }

  private observeMaxValueAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'maxValue';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().maxValue;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute('data-max-value', valFromOptions.toString());
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ maxValue: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-max-value']
    });
  }

  private observeRangeAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'range';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().range;
      const oldValueBoolean = toBoolean(oldValue!);
      const valBoolean = toBoolean(val!);

      if (isNeedToChangeIfValueBoolean(val!)) {
        this.selector.setAttribute('data-range', valFromOptions.toString());
      }

      if (valBoolean !== oldValueBoolean) {
        this.setOptions({ range: valBoolean });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-range']
    });
  }

  private observeStepAtr() {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'step';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().step;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute('data-step', valFromOptions.toString());
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ step: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-step']
    });
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

    this.setDataAtr();
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
        maxValue: roundToRequiredNumber(minValue!) + step!,
        minValue: roundToRequiredNumber(minValue!)
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
        maxValue: roundToRequiredNumber(maxValue!),
        minValue: roundToRequiredNumber(maxValue!) - step!
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
        maxValue: roundToRequiredNumber(minValue!) + step!,
        minValue: roundToRequiredNumber(minValue!)
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
        maxValue: roundToRequiredNumber(maxValue!),
        minValue: roundToRequiredNumber(maxValue!) - step!
      });
    }

    if (minValue !== prevMinValue) {
      return this.setOptions({ minValue: roundToRequiredNumber(minValue!) });
    }

    if (maxValue !== prevMaxValue) {
      return this.setOptions({ maxValue: roundToRequiredNumber(maxValue!) });
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
