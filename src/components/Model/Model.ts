/* eslint-disable consistent-return */
import { DEFAULT_MODEL_OPTIONS } from '../default';
import { ModelOptions, ListenersName } from '../type';
import Observer from '../Observer/Observer';
import {
  isIncorrectStepInValueEnd,
  isIncorrectStepInValueStart,
  isValueStartBiggerMaxValue,
  isValueStartBiggerValueEnd,
  findClosestCorrectValue
} from './Model.function';

class Model extends Observer {
  constructor(private options: Partial<ModelOptions> = DEFAULT_MODEL_OPTIONS) {
    super();
    this.init();
    this.checkOptions();
  }

  getOptions(): ModelOptions {
    return this.options as ModelOptions;
  }

  getFirstValue(): number {
    return this.options.valueStart!;
  }

  getSecondValue(): number {
    return this.options.valueEnd!;
  }

  setOptions(modelOptions: Partial<ModelOptions>): void {
    this.options = { ...this.options, ...modelOptions };
    this.checkOptions();
    this.emit(ListenersName.modelValueChange);
  }

  private init(): void {
    this.options = { ...DEFAULT_MODEL_OPTIONS, ...this.options };
  }

  private checkOptions(): void {
    this.checkStep();
    this.checkMinValueLessMax();
    this.checkRangeLessThanStepSize();
    this.checkValueStartInRange();
    this.checkValueEndInRange();
    this.checkValueStartLessValueEnd();
    this.checkValueStartCorrectStep();
    this.checkValueEndCorrectStep();
  }

  private checkStep(): void {
    const { step } = this.options;
    if (step! < 1) {
      return this.setOptions({ step: 1 });
    }
    if (!Number.isInteger(step)) {
      return this.setOptions({ step: Math.floor(step!) });
    }
  }

  private checkMinValueLessMax(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.options;
    if (minValue === maxValue) {
      return this.setOptions({ maxValue: minValue! + step! });
    }
    if (minValue! > maxValue!) {
      return this.setOptions({ minValue: maxValue! - step! });
    }
  }

  private checkRangeLessThanStepSize(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step } = this.options;
    const range = Math.abs(maxValue! - minValue!);
    const rangeLess: boolean = range < step!;
    if (rangeLess) {
      return this.setOptions({ step: step, maxValue: minValue! + step! * 2 });
    }
  }

  private checkValueStartInRange(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueStart, range } = this.options;
    if (valueStart! < minValue!) {
      return this.setOptions({ valueStart: minValue });
    }
    if (valueStart! > maxValue!) {
      if (range) {
        return this.setOptions({ valueStart: maxValue! - step! });
      }
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

  private checkValueStartLessValueEnd(): void | Partial<ModelOptions> {
    const { minValue, maxValue, step, valueEnd, valueStart } = this.options;
    if (this.options.range) {
      if (valueStart === valueEnd) {
        if (valueEnd === maxValue) {
          return this.setOptions({ valueStart: valueStart! - step! });
        }
        if (valueStart === minValue) {
          return this.setOptions({ valueEnd: valueEnd! + step! });
        }
        return this.setOptions({ valueEnd: valueEnd! + step! });
      }
      if (valueStart! > valueEnd!) {
        return this.setOptions({ valueStart: minValue });
      }
    } else if (isValueStartBiggerValueEnd(valueStart!, valueEnd!, maxValue!)) {
      return this.setOptions({ valueEnd: maxValue });
    } else if (isValueStartBiggerMaxValue(valueStart!, valueEnd!, maxValue!)) {
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
      return this.setOptions({ valueStart: newValue });
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
      return this.setOptions({ valueEnd: newValue });
    }
  }
}

export default Model;
