/* eslint-disable consistent-return */
import { DEFAULT_MODEL_OPTIONS } from '../default';
import { ModelOptions } from '../type';

import Observer from '../observer/Observer';

class Model extends Observer {
  constructor(private options: Partial<ModelOptions> = DEFAULT_MODEL_OPTIONS) {
    super();
    this.init();
    this.checkOptions();
  }

  private init(): void {
    this.options = { ...DEFAULT_MODEL_OPTIONS, ...this.options };
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

  setOptions(modelOptions: Partial<ModelOptions>): void {
    this.options = { ...this.options, ...modelOptions };
    this.checkOptions();
    this.emit('modelValueChange', this.options);
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
      return this.setOptions({ minValue: maxValue! - step! });
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
    } else if (valueStart! >= valueEnd! && valueStart !== maxValue) {
      return this.setOptions({ valueEnd: maxValue });
    } else if (valueStart === maxValue && valueEnd !== maxValue) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }

  private checkValueStartCorrectStep(): void | Partial<ModelOptions> {
    const { minValue, step, valueStart } = this.options;
    if (Math.abs(valueStart! - minValue!) % step!) {
      return this.setOptions({ valueStart: minValue });
    }
  }

  private checkValueEndCorrectStep(): void | Partial<ModelOptions> {
    const { maxValue, minValue, step, valueEnd } = this.options;
    if (Math.abs(valueEnd! - minValue!) % step! && valueEnd !== maxValue) {
      return this.setOptions({ valueEnd: maxValue });
    }
  }
}

export default Model;
