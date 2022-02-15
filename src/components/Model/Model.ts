/* eslint-disable consistent-return */
import { MIN_STEP } from '../../constants';
import findClosestCorrectValue from '../../utils/findClosestCorrectValue';
import {
  roundToRequiredNumber,
  camelCaseToDash,
  toNumber,
  isNeedToChangeValue,
  toBoolean,
  isNeedToChangeIfValueBoolean,
  filterModelOptions,
  objectFilter
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
  isMinValueBiggerMaxValueAndMaxValueLessPrevValue,
  isNeedRound,
  calculateValueStartBeforeMax
} from './Model.function';

class Model extends Observer<{ modelValueChange: null }> {
  modelOptions: ModelOptions = DEFAULT_MODEL_OPTIONS;
  constructor(
    private selector: HTMLElement,
    private options?: Partial<ModelOptions>
  ) {
    super();
    this.init();
    this.checkOptions(this.modelOptions);
    this.observeAtr();
  }

  getOptions(): ModelOptions {
    return { ...this.modelOptions };
  }

  getFirstValue(): number {
    return this.modelOptions.valueStart;
  }

  getSecondValue(): number {
    return this.modelOptions.valueEnd;
  }

  setOptions(modelOptions: Partial<ModelOptions>): void {
    const { valueEnd, valueStart, minValue, maxValue } = this.modelOptions;

    this.modelOptions = { ...this.modelOptions, ...modelOptions };
    this.checkOptions({ valueStart, valueEnd, minValue, maxValue });
    this.emit(ListenersName.modelValueChange, null);
  }

  private init(): void {
    const optionsFromDataAtr = this.initOptionsFromDataAtr();

    this.modelOptions = {
      ...this.modelOptions,
      ...this.options,
      ...optionsFromDataAtr
    };
  }

  private initOptionsFromDataAtr(): Partial<ModelOptions> {
    const objectFromDataAtr = { ...this.selector.dataset };
    const FilterObjectFromDataAtr = objectFilter(objectFromDataAtr, ([key]) =>
      filterModelOptions(key)
    );

    Object.keys(FilterObjectFromDataAtr).forEach((key) => {
      if (key === 'minValue') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_MODEL_OPTIONS.minValue
        );
      }
      if (key === 'maxValue') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_MODEL_OPTIONS.maxValue
        );
      }
      if (key === 'valueStart') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_MODEL_OPTIONS.valueStart
        );
      }
      if (key === 'valueEnd') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_MODEL_OPTIONS.valueEnd
        );
      }
      if (key === 'step') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_MODEL_OPTIONS.step
        );
      }
      if (key === 'range') {
        FilterObjectFromDataAtr[key] = toBoolean(FilterObjectFromDataAtr[key]);
      }
    });

    return FilterObjectFromDataAtr;
  }

  private setDataAtr(): void {
    const keys = Object.keys(this.getOptions());
    const values = Object.values(this.getOptions());
    const container = this.selector;

    const keysDash = keys.map((el) => camelCaseToDash(el));
    keysDash.forEach((el, i) =>
      container.setAttribute('data-' + el, values[i].toString())
    );
  }

  private observeAtr(): void {
    this.observeValueStartAtr();
    this.observeValueEndAtr();
    this.observeMinValueAtr();
    this.observeMaxValueAtr();
    this.observeStepAtr();
    this.observeRangeAtr();
  }

  private observeValueStartAtr(): void {
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

  private observeValueEndAtr(): void {
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

  private observeMinValueAtr(): void {
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

  private observeMaxValueAtr(): void {
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

  private observeRangeAtr(): void {
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

  private observeStepAtr(): void {
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

  private checkOptions({
    valueStart,
    valueEnd,
    minValue,
    maxValue
  }: Omit<ModelOptions, 'step' | 'range'>): void {
    this.checkStep();
    this.checkMinValueLessMax(minValue, maxValue);
    this.checkRangeLessThanStepSize();
    this.checkValueStartInRange();
    this.checkValueEndInRange();
    this.checkValueStartCorrectStep();
    this.checkValueEndCorrectStep();
    this.checkValueStartLessValueEnd(valueStart, valueEnd);

    this.setDataAtr();
  }

  private checkStep(): void {
    const { step } = this.modelOptions;

    if (step < MIN_STEP) {
      return this.setOptions({ step: MIN_STEP });
    }

    if (isNeedRound(step)) {
      return this.setOptions({
        step: roundToRequiredNumber(step)
      });
    }
  }

  private checkMinValueLessMax(
    prevMinValue: number,
    prevMaxValue: number
  ): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.modelOptions;

    if (
      isMinValueEqualMaxValueAndMinValueBiggerPrevValue({
        minValue,
        maxValue,
        prevMinValue
      })
    ) {
      return this.setOptions({
        maxValue: roundToRequiredNumber(minValue) + step,
        minValue: roundToRequiredNumber(minValue)
      });
    }

    if (
      isMinValueEqualMaxValueAndMaxValueLessPrevValue({
        minValue,
        maxValue,
        prevMaxValue
      })
    ) {
      return this.setOptions({
        maxValue: roundToRequiredNumber(maxValue),
        minValue: roundToRequiredNumber(maxValue) - step
      });
    }

    if (
      isMinValueBiggerMaxValueAndMinValueBiggerPrevValue({
        minValue,
        maxValue,
        prevMinValue
      })
    ) {
      return this.setOptions({
        maxValue: roundToRequiredNumber(minValue) + step,
        minValue: roundToRequiredNumber(minValue)
      });
    }

    if (
      isMinValueBiggerMaxValueAndMaxValueLessPrevValue({
        minValue,
        maxValue,
        prevMaxValue
      })
    ) {
      return this.setOptions({
        maxValue: roundToRequiredNumber(maxValue),
        minValue: roundToRequiredNumber(maxValue) - step
      });
    }

    if (minValue !== prevMinValue) {
      return this.setOptions({ minValue: roundToRequiredNumber(minValue) });
    }
    if (minValue >= maxValue!) {
      return this.setOptions({
        maxValue: roundToRequiredNumber(minValue + step),
        minValue: roundToRequiredNumber(minValue)
      });
    }

    if (maxValue !== prevMaxValue) {
      return this.setOptions({ maxValue: roundToRequiredNumber(maxValue) });
    }
  }

  private checkRangeLessThanStepSize(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.modelOptions;
    const range = Math.abs(maxValue - minValue);
    const rangeLess: boolean = range < step;
    if (rangeLess) {
      return this.setOptions({ step: range });
    }
  }

  private checkValueStartInRange(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueStart, range } = this.modelOptions;

    if (valueStart < minValue) {
      return this.setOptions({ valueStart: minValue });
    }

    if (valueStart > maxValue && range) {
      return this.setOptions({ valueStart: maxValue - step });
    }
    if (valueStart > maxValue) {
      return this.setOptions({ valueStart: maxValue });
    }
  }

  private checkValueEndInRange(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueEnd } = this.modelOptions;
    if (valueEnd < minValue) {
      return this.setOptions({
        valueEnd: minValue + step,
        valueStart: minValue
      });
    }
    if (valueEnd > maxValue) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }

  private checkValueStartLessValueEnd(
    prevValueStart: number,
    prevValueEnd: number
  ): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueEnd, valueStart, range } =
      this.modelOptions;

    if (
      isRangeAndValueStartEqualValueEndAndValueEndEqualMaxValue({
        range,
        valueStart,
        valueEnd,
        maxValue
      })
    ) {
      return this.setOptions({
        valueStart: calculateValueStartBeforeMax({
          minValue,
          maxValue,
          step
        })
      });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueStartEqualMinValue({
        range,
        valueStart,
        valueEnd,
        minValue
      })
    ) {
      return this.setOptions({ valueEnd: valueEnd + step });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueStartBiggerPrevValue({
        range,
        valueStart,
        valueEnd,
        prevValueStart
      })
    ) {
      return this.setOptions({
        valueEnd: valueStart + step,
        valueStart
      });
    }

    if (
      isRangeAndValueStartEqualValueEndAndValueEndLessPrevValue({
        range,
        valueStart,
        valueEnd,
        prevValueEnd
      })
    ) {
      return this.setOptions({
        valueEnd,
        valueStart: valueEnd - step
      });
    }

    if (
      isRangeAndValueStartBiggerValueEndAndValueStartBiggerPrevValue({
        range,
        valueStart,
        valueEnd,
        prevValueStart
      })
    ) {
      return this.setOptions({
        valueEnd: valueStart + step,
        valueStart
      });
    }

    if (
      isRangeAndValueStartBiggerValueEndAndValueEndLessPrevValue({
        range,
        valueStart,
        valueEnd,
        prevValueEnd
      })
    ) {
      return this.setOptions({
        valueEnd,
        valueStart: valueEnd - step
      });
    }

    if (
      isValueStartBiggerValueEnd({
        valueStart,
        valueEnd,
        maxValue
      })
    ) {
      return this.setOptions({ valueEnd: maxValue });
    }
    if (
      isValueStartBiggerMaxValue({
        valueStart,
        valueEnd,
        maxValue
      })
    ) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }

  private checkValueStartCorrectStep(): void | Partial<ModelOptions> {
    const { minValue, step, valueStart, maxValue } = this.modelOptions;

    if (isNeedRound(valueStart)) {
      return this.setOptions({
        valueStart: roundToRequiredNumber(valueStart)
      });
    }

    if (
      isIncorrectStepInValueStart({
        minValue,
        step,
        valueStart,
        maxValue
      })
    ) {
      const newValue = findClosestCorrectValue(
        step,
        valueStart,
        maxValue,
        minValue
      );

      return this.setOptions({
        valueStart: newValue
      });
    }
  }

  private checkValueEndCorrectStep(): void | Partial<ModelOptions> {
    const { maxValue, minValue, step, valueEnd } = this.modelOptions;

    if (isNeedRound(valueEnd)) {
      return this.setOptions({
        valueStart: roundToRequiredNumber(valueEnd)
      });
    }

    if (
      isIncorrectStepInValueEnd({
        maxValue,
        minValue,
        step,
        valueEnd
      })
    ) {
      const newValue = findClosestCorrectValue(
        step,
        valueEnd,
        maxValue,
        minValue
      );

      if (newValue === minValue) {
        return this.setOptions({
          valueEnd: roundToRequiredNumber(minValue + step)
        });
      }

      return this.setOptions({
        valueEnd: newValue
      });
    }
  }
}

export default Model;
