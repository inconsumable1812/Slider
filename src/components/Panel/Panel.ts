import { render } from '../../utils/utils';
import {
  ModelOptions,
  PanelElements,
  PanelInputs,
  Slider,
  ViewOptions
} from '../type';

class Panel {
  private root!: HTMLElement;
  private elements!: PanelElements;
  private inputs!: PanelInputs;
  private selector: HTMLElement;
  private slider: Slider;

  constructor(selector: HTMLElement, slider: Slider) {
    this.selector = selector;
    this.slider = slider;

    this.init();
  }

  public init(): void {
    this.render();
    this.updateOptionsFromSlider();
  }

  public getRoot(): HTMLElement {
    return this.root;
  }

  public getInputs(): PanelInputs {
    return this.inputs;
  }

  public setOptionsFromSlider(): void {
    const {
      scalePointCount,
      showTooltip,
      isVertical,
      showProgress,
      showScale,
      minValue,
      maxValue,
      step,
      valueStart,
      valueEnd,
      range
    } = this.slider.getOptions();

    this.inputs.maxValue.value = maxValue.toString();
    this.inputs.minValue.value = minValue.toString();
    this.inputs.valueStart.value = valueStart.toString();
    this.inputs.valueEnd.value = valueEnd.toString();
    this.inputs.valueEnd.disabled = !range;
    this.inputs.showTooltip.checked = showTooltip;
    this.inputs.range.checked = range;
    this.inputs.step.value = step.toString();
    this.inputs.showScale.checked = showScale;
    this.inputs.scalePointCount.value = scalePointCount!.toString();
    this.inputs.showProgress.checked = showProgress;
    this.inputs.isVertical.checked = isVertical;

    this.inputs.valueStart.setAttribute('min', `${minValue}`);
    this.inputs.valueEnd.setAttribute('min', `${minValue}`);
    this.inputs.valueStart.setAttribute('step', `${step}`);
    this.inputs.valueEnd.setAttribute('step', `${step}`);
  }

  private render(): void {
    this.root = render(`
    <div class="panel"></div>
    `);
    this.elements = {
      maxValueEl: render(`
        <div class="panel__input-max panel__option">Max value
        <input class="panel__input" type="number">
        </div>
        `),
      minValueEl: render(`
        <div class="panel__input-min panel__option">Min value
        <input class="panel__input" type="number">
        </div>
      `),
      firstValueEl: render(`
        <div class="panel__value-first panel__option">First value
        <input class="panel__input" type="number">
        </div>
      `),
      secondValueEl: render(`
        <div class="panel__value-second panel__option">Second value
        <input class="panel__input" type="number">
        </div>
      `),
      showTooltipEL: render(`
        <div class="panel__tooltip panel__option">Show tooltip
        <input class="panel__input" type="checkbox">
        </div>
      `),
      rangeEl: render(`
        <div class="panel__range panel__option">Range
        <input class="panel__input" type="checkbox">
        </div>
      `),
      stepEl: render(`
      <div class="panel__step panel__option">Step
      <input class="panel__input" type="number" >
      </div>
      `),
      showScaleEl: render(`
        <div class="panel__scale-show panel__option">Show scale
        <input class="panel__input" type="checkbox">
        </div>
      `),
      scalePointEl: render(`
        <div class="panel__scale-point panel__option">Scale point
        <input class="panel__input" type="number" >
        </div>
      `),
      progressEl: render(`
        <div class="panel__progress panel__option">Show progress
        <input class="panel__input" type="checkbox">
        </div>
      `),
      verticalEl: render(`
        <div class="panel__vertical panel__option">Is vertical
        <input class="panel__input" type="checkbox">
        </div>
        `)
    };

    const {
      maxValueEl,
      minValueEl,
      firstValueEl,
      secondValueEl,
      showTooltipEL,
      rangeEl,
      stepEl,
      showScaleEl,
      scalePointEl,
      progressEl,
      verticalEl
    } = this.elements;

    this.root.append(maxValueEl);
    this.root.append(minValueEl);
    this.root.append(firstValueEl);
    this.root.append(secondValueEl);
    this.root.append(showTooltipEL);
    this.root.append(rangeEl);
    this.root.append(stepEl);
    this.root.append(showScaleEl);
    this.root.append(scalePointEl);
    this.root.append(progressEl);
    this.root.append(verticalEl);

    this.selector.append(this.root);

    this.inputs = {
      maxValue: maxValueEl.querySelector('input') as HTMLInputElement,
      minValue: minValueEl.querySelector('input') as HTMLInputElement,
      valueStart: firstValueEl.querySelector('input') as HTMLInputElement,
      valueEnd: secondValueEl.querySelector('input') as HTMLInputElement,
      showTooltip: showTooltipEL.querySelector('input') as HTMLInputElement,
      range: rangeEl.querySelector('input') as HTMLInputElement,
      step: stepEl.querySelector('input') as HTMLInputElement,
      showScale: showScaleEl.querySelector('input') as HTMLInputElement,
      scalePointCount: scalePointEl.querySelector('input') as HTMLInputElement,
      showProgress: progressEl.querySelector('input') as HTMLInputElement,
      isVertical: verticalEl.querySelector('input') as HTMLInputElement
    };

    this.addListeners();
    this.setOptionsFromSlider();
  }

  private updateOptionsFromSlider(): void {
    this.slider.updateModelOptions(this.setOptionsFromSlider.bind(this));
    this.slider.updateViewOptions(this.setOptionsFromSlider.bind(this));
  }

  private getMaxValue(): Partial<ModelOptions> {
    const { maxValue } = this.inputs;
    return {
      maxValue: maxValue.value === '' ? undefined : Number(maxValue.value)
    };
  }

  private getMinValue(): Partial<ModelOptions> {
    const { minValue } = this.inputs;
    return {
      minValue: minValue.value === '' ? undefined : Number(minValue.value)
    };
  }

  private getValueStart(): Partial<ModelOptions> {
    const { valueStart } = this.inputs;
    return {
      valueStart: valueStart.value === '' ? undefined : Number(valueStart.value)
    };
  }

  private getValueEnd(): Partial<ModelOptions> {
    const { valueEnd } = this.inputs;
    return {
      valueEnd: valueEnd.value === '' ? undefined : Number(valueEnd.value)
    };
  }

  private getStep(): Partial<ModelOptions> {
    const { step } = this.inputs;
    return { step: step.value === '' ? undefined : Number(step.value) };
  }

  private getScaleCount(): Partial<ViewOptions> {
    const { scalePointCount } = this.inputs;
    return {
      scalePointCount:
        scalePointCount.value === '' ? undefined : Number(scalePointCount.value)
    };
  }

  private getRange(): Partial<ModelOptions> {
    const { range } = this.inputs;
    return { range: range.checked };
  }

  private getProgress(): Partial<ViewOptions> {
    const { showProgress } = this.inputs;
    return { showProgress: showProgress.checked };
  }

  private getTooltip(): Partial<ViewOptions> {
    const { showTooltip } = this.inputs;
    return { showTooltip: showTooltip.checked };
  }

  private getScale(): Partial<ViewOptions> {
    const { showScale } = this.inputs;
    return { showScale: showScale.checked };
  }

  private getVertical(): Partial<ViewOptions> {
    const { isVertical } = this.inputs;
    return { isVertical: isVertical.checked };
  }

  private addListeners(): void {
    // MaxValue
    const maxValueCallback = () => {
      const maxValue = this.getMaxValue().maxValue;
      const minValue = this.getMinValue().minValue;
      const step = this.getStep().step;
      const isUndefined =
        maxValue === undefined || minValue === undefined || step === undefined;
      const previousValue = this.slider.getOptions().maxValue;

      const newValue = isUndefined
        ? { maxValue: previousValue }
        : this.getMaxValue();

      this.slider.setOptions(newValue);
    };
    this.inputs.maxValue.addEventListener('change', maxValueCallback);

    const maxValueCallbackWhenFocusGone = () => {
      if (this.inputs.maxValue.value === '') {
        this.inputs.maxValue.value = this.slider
          .getOptions()
          .maxValue.toString();
      }
    };
    this.inputs.maxValue.addEventListener(
      'blur',
      maxValueCallbackWhenFocusGone
    );

    // MinValue
    const minValueCallback = () => {
      const isUndefined = this.getMinValue().minValue === undefined;
      const previousValue = this.slider.getOptions().minValue;

      const newValue = !isUndefined
        ? this.getMinValue()
        : { minValue: previousValue };

      this.slider.setOptions(newValue);

      const min = this.slider.getOptions().minValue;

      this.inputs.valueStart.setAttribute('min', `${min}`);
      this.inputs.valueEnd.setAttribute('min', `${min}`);
    };
    this.inputs.minValue.addEventListener('change', minValueCallback);

    const minValueCallbackWhenFocusGone = () => {
      if (this.inputs.minValue.value === '') {
        this.inputs.minValue.value = this.slider
          .getOptions()
          .minValue.toString();
      }
    };
    this.inputs.minValue.addEventListener(
      'blur',
      minValueCallbackWhenFocusGone
    );

    // ValueStart
    const valueStartCallback = () => {
      const maxValue = this.getMaxValue().maxValue;
      const valueStart = this.getValueStart().valueStart;
      const valueEnd = this.getValueEnd().valueEnd;
      const isUndefined =
        maxValue === undefined ||
        valueStart === undefined ||
        valueEnd === undefined;
      const previousValue = this.slider.getOptions().valueStart;

      const newValue = isUndefined
        ? { valueStart: previousValue }
        : this.getValueStart();

      this.slider.setOptions(newValue);
    };
    this.inputs.valueStart.addEventListener('change', valueStartCallback);

    const valueStartCallbackWhenFocusGone = () => {
      if (this.inputs.valueStart.value === '') {
        this.inputs.valueStart.value = this.slider
          .getOptions()
          .valueStart.toString();
      }
    };
    this.inputs.valueStart.addEventListener(
      'blur',
      valueStartCallbackWhenFocusGone
    );

    // ValueEnd
    const valueEndCallback = () => {
      const valueEnd = this.getValueEnd().valueEnd;
      const valueStart = this.getValueStart().valueStart;
      const previousValue = this.slider.getOptions().valueEnd;
      const isUndefined = valueEnd === undefined || valueStart === undefined;

      let newValue = this.getValueEnd();
      newValue = isUndefined ? { valueEnd: previousValue } : this.getValueEnd();

      this.slider.setOptions(newValue);
    };
    this.inputs.valueEnd.addEventListener('change', valueEndCallback);

    const valueEndCallbackWhenFocusGone = () => {
      if (this.inputs.valueEnd.value === '') {
        this.inputs.valueEnd.value = this.slider
          .getOptions()
          .valueEnd.toString();
      }
    };
    this.inputs.valueEnd.addEventListener(
      'blur',
      valueEndCallbackWhenFocusGone
    );

    // Step
    const stepCallback = () => {
      const previousValue = this.slider.getOptions().step;
      const step = this.getStep().step;
      const maxValue = this.getMaxValue().maxValue;
      const minValue = this.getMinValue().minValue;
      const isUndefined =
        maxValue === undefined || minValue === undefined || step === undefined;

      const newStep = isUndefined ? { step: previousValue } : this.getStep();

      this.slider.setOptions(newStep);

      const setStep = this.slider.getOptions().step;

      this.inputs.valueStart.setAttribute('step', `${setStep}`);
      this.inputs.valueEnd.setAttribute('step', `${setStep}`);
    };
    this.inputs.step.addEventListener('change', stepCallback);

    const stepCallbackWhenFocusGone = () => {
      if (this.inputs.step.value === '') {
        this.inputs.step.value = this.slider.getOptions().step.toString();
      }
    };
    this.inputs.step.addEventListener('blur', stepCallbackWhenFocusGone);

    // ScaleCount
    const scaleCountCallback = () => {
      const scaleCount = this.getScaleCount().scalePointCount;
      const previousValue = this.slider.getOptions().scalePointCount;
      const isUndefined = scaleCount === undefined;

      const newScaleCount = !isUndefined
        ? this.getScaleCount()
        : { scalePointCount: previousValue };

      this.slider.setOptions(newScaleCount);
    };
    this.inputs.scalePointCount.addEventListener('change', scaleCountCallback);

    const scaleCountCallbackWhenFocusGone = () => {
      if (this.inputs.scalePointCount.value === '') {
        this.inputs.scalePointCount.value = this.slider
          .getOptions()
          .scalePointCount.toString();
      }
    };
    this.inputs.scalePointCount.addEventListener(
      'blur',
      scaleCountCallbackWhenFocusGone
    );

    // Range
    const rangeCallback = () => {
      this.slider.setOptions(this.getRange());
      this.inputs.valueEnd.disabled = !this.getRange().range;
    };
    this.inputs.range.addEventListener('change', rangeCallback);

    // Progress
    const progressCallback = () => {
      this.slider.setOptions(this.getProgress());
    };
    this.inputs.showProgress.addEventListener('change', progressCallback);

    // Tooltip
    const tooltipCallback = () => {
      this.slider.setOptions(this.getTooltip());
    };
    this.inputs.showTooltip.addEventListener('change', tooltipCallback);

    // showScale
    const showScaleCallback = () => {
      this.slider.setOptions(this.getScale());
    };
    this.inputs.showScale.addEventListener('change', showScaleCallback);

    // Vertical
    const verticalCallback = () => {
      this.slider.setOptions(this.getVertical());
    };
    this.inputs.isVertical.addEventListener('change', verticalCallback);
  }
}

export default Panel;
