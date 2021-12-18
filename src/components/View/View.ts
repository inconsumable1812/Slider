import {
  MIN_SCALE_POINT_COUNT,
  MAX_SCALE_POINT_COUNT,
  VERTICAL_CLASS
} from '../../constants';
import {
  render,
  camelCaseToDash,
  toNumber,
  isNeedToChangeValue,
  toBoolean,
  isNeedToChangeIfValueBoolean,
  objectFilter,
  filterViewOptions
} from '../../utils/utils';
import {
  ModelOptions,
  ViewComponents,
  ViewOptions,
  ListenersName,
  viewProps
} from '../type';
import { DEFAULT_VIEW_OPTIONS } from '../default';
import Observer from '../Observer/Observer';
import Handle from './Handle/Handle';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Track from './Track/Track';
import {
  searchStyleValue,
  findClosestHandle,
  isClickFromSecondHandlePosition,
  isRangeAndShowProgress,
  isNotRangeAndShowProgress,
  isNotRangeAndStayMergeTooltip,
  isShowTooltipAndRange,
  isHideTooltipAndRange,
  isNewValueCorrect,
  isFirstHandleRangeAndShowProgress,
  isSecondHandleRangeAndShowProgress
} from './view.function';

class View extends Observer {
  private components!: ViewComponents;
  root!: HTMLElement;
  private selector: HTMLElement;
  private modelOptions: ModelOptions;
  private viewOptions: ViewOptions;

  constructor({
    selector,
    modelOptions,
    viewOptions = DEFAULT_VIEW_OPTIONS
  }: viewProps) {
    super();
    this.selector = selector;
    this.modelOptions = modelOptions;
    this.viewOptions = viewOptions;
    this.initViewOptions();
    this.checkScalePointCount();
    this.observeAtr();
  }

  setOptions(viewOptions: Partial<ViewOptions>): void {
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.checkScalePointCount();
    this.setDataAtr();
    this.emit(ListenersName.viewChanged, this.viewOptions);
  }

  changeModelOptions(modelOptions: Partial<ModelOptions>): void {
    this.modelOptions = { ...this.modelOptions, ...modelOptions };
  }

  updateView(): void {
    const { minValue, maxValue, step, valueStart, valueEnd, range } =
      this.modelOptions;
    const {
      scalePointCount,
      showTooltip,
      isVertical,
      showProgress,
      showScale
    } = this.viewOptions;
    const { track, firstHandle, progress, secondHandle, scale } =
      this.components;

    firstHandle.setValue(valueStart);
    firstHandle.setStyle(
      searchStyleValue({ minValue, maxValue, progress: valueStart })
    );

    if (showProgress) {
      track.element.append(progress.element);
      progress.setOrientation(isVertical);
    } else {
      progress.element.remove();
    }

    if (showScale) {
      scale.setOrientation(isVertical);
      scale.setScaleOptions(maxValue, minValue, step, scalePointCount);
    } else {
      scale.deleteScalePoint();
    }

    if (range) {
      this.root.append(secondHandle!.element);

      secondHandle.setValue(valueEnd);
      secondHandle.setStyle(
        searchStyleValue({ minValue, maxValue, progress: valueEnd })
      );
      this.mergeTooltip();
    } else {
      secondHandle.element.remove();
    }

    if (isNotRangeAndStayMergeTooltip(range, firstHandle)) {
      firstHandle.setTooltipContent();
    }

    if (isRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(
        searchStyleValue({ minValue, maxValue, progress: valueStart }),
        searchStyleValue({ minValue, maxValue, progress: valueEnd })
      );
    }

    if (isNotRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(
        0,
        searchStyleValue({ minValue, maxValue, progress: valueStart })
      );
    }

    if (showTooltip) {
      firstHandle.showTooltipMethod();
    } else {
      firstHandle.hideTooltip();
    }

    if (isShowTooltipAndRange(showTooltip, range)) {
      secondHandle.showTooltipMethod();
    }

    if (isHideTooltipAndRange(showTooltip, range)) {
      secondHandle.hideTooltip();
    }

    track.setMaxMinValueAndStep(maxValue, minValue, step);
    firstHandle.updateStep(step);
    secondHandle.updateStep(step);

    const styleValueFirst = searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueStart
    });

    // when change orientation
    if (range) {
      const styleValueSecond = searchStyleValue({
        minValue: track.getMinValue(),
        maxValue: track.getMaxValue(),
        progress: valueEnd
      });
      secondHandle.setOrientation(isVertical);
      secondHandle.clearStyle();
      secondHandle.setStyle(styleValueSecond);
      this.mergeTooltip();
    }

    track.setOrientation(isVertical);
    firstHandle.setOrientation(isVertical);
    firstHandle.clearStyle();
    firstHandle.setStyle(styleValueFirst);
    if (showProgress) {
      progress!.setOrientation(isVertical);
    }

    if (isVertical) {
      this.root.classList.add(VERTICAL_CLASS);
    } else {
      this.root.classList.remove(VERTICAL_CLASS);
    }
  }

  getModel(): ModelOptions {
    return { ...this.modelOptions };
  }

  getOptions(): ViewOptions {
    return { ...this.viewOptions } as ViewOptions;
  }

  getComponents(): ViewComponents {
    return this.components;
  }

  render(): void {
    const { minValue, maxValue, step, valueStart, valueEnd, range } =
      this.modelOptions;
    const {
      isVertical,
      showTooltip,
      showProgress,
      showScale,
      scalePointCount
    } = this.viewOptions;

    const isVerticalRender = isVertical ? VERTICAL_CLASS : '';
    this.root = render(`
    <div class="range-slider ${isVerticalRender}">
    `);

    const trackInstance = new Track({
      minValue,
      maxValue,
      isVertical: isVertical!,
      step
    });

    this.components = {
      track: trackInstance,
      firstHandle: new Handle({
        handleNumber: 1,
        value: valueStart,
        showTooltip,
        isVertical,
        track: trackInstance,
        step
      }),
      secondHandle: new Handle({
        handleNumber: 2,
        value: valueEnd,
        showTooltip,
        isVertical,
        track: trackInstance,
        step
      }),
      progress: new Progress(isVertical!),
      scale: new Scale({
        minValue,
        maxValue,
        scalePointCount: scalePointCount!,
        step,
        isVertical
      })
    };

    const { track, firstHandle, secondHandle, scale, progress } =
      this.components;

    if (showProgress) {
      track.element.append(progress!.element);
    }
    this.root.append(track.element);
    this.root.append(firstHandle.element);
    if (range) {
      this.root.append(secondHandle!.element);
    }
    if (showScale) {
      this.root.append(scale!.element);
    }

    const firstHandleStyleValue = searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueStart
    });
    const secondHandleStyleValue = searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueEnd
    });

    firstHandle.setStyle(firstHandleStyleValue);
    if (range) {
      secondHandle!.setStyle(secondHandleStyleValue);
    }

    if (isRangeAndShowProgress(range, showProgress)) {
      progress!.setStyle(firstHandleStyleValue, secondHandleStyleValue);
    }

    if (isNotRangeAndShowProgress(range, showProgress)) {
      progress!.setStyle(0, firstHandleStyleValue);
    }

    this.selector.append(this.root);

    if (range) {
      this.mergeTooltip();
    }

    this.bindEventListeners();
  }

  private initViewOptions(): void {
    const optionsFromDataAtr = this.initOptionsFromDataAtr();

    this.viewOptions = {
      ...DEFAULT_VIEW_OPTIONS,
      ...this.viewOptions,
      ...optionsFromDataAtr
    };
    this.setDataAtr();
  }

  // eslint-disable-next-line consistent-return
  private checkScalePointCount(): void | Partial<ViewOptions> {
    const { scalePointCount } = this.viewOptions;
    if (scalePointCount! < MIN_SCALE_POINT_COUNT) {
      return this.setOptions({ scalePointCount: MIN_SCALE_POINT_COUNT });
    }
    if (scalePointCount! > MAX_SCALE_POINT_COUNT) {
      return this.setOptions({ scalePointCount: MAX_SCALE_POINT_COUNT });
    }
  }

  private bindEventListeners(): void {
    this.clickOnTrack();
    this.clickOnHandle();
    this.clickOnScale();
  }

  private mergeTooltip(): void {
    const { firstHandle, secondHandle } = this.components;

    const firstHandleTooltip = firstHandle.getValue();
    const secondHandleTooltip = secondHandle?.getValue();

    const firstHandleRightSide = firstHandle.getRectangleTooltip().right;
    const secondHandleLeftSide = secondHandle.getRectangleTooltip().left;

    if (firstHandleRightSide >= secondHandleLeftSide) {
      firstHandle.setTooltipContent(
        `${firstHandleTooltip}...${secondHandleTooltip}`
      );
      secondHandle.clearTooltipContent();
      secondHandle.hideTooltipContent();
    } else if (firstHandle.getTooltipContent()?.includes('...')) {
      firstHandle.setTooltipContent();
      secondHandle?.setTooltipContent();
    }
  }

  private clickOnHandle(): void {
    const { track, progress, firstHandle, secondHandle } = this.components;

    const setNewValueOnHandle = (newValue: number, handle: Handle) => {
      const { range } = this.getModel();
      const { showProgress } = this.viewOptions;

      const styleValue: number = searchStyleValue({
        minValue: track.getMinValue(),
        maxValue: track.getMaxValue(),
        progress: newValue
      });

      if (range) {
        if (
          isNewValueCorrect({ handle, newValue, firstHandle, secondHandle })
        ) {
          handle.setValue(newValue);
          handle.setStyle(styleValue);
        }
        this.mergeTooltip();
      } else {
        handle.setValue(newValue);
        handle.setStyle(styleValue);
      }

      if (isNotRangeAndShowProgress(range, showProgress)) {
        progress.setStart(0);
        progress.setEnd(styleValue);
      }

      if (handle === firstHandle) {
        this.emit(ListenersName.viewChanged, { valueStart: handle.getValue() });
      } else if (handle === secondHandle) {
        this.emit(ListenersName.viewChanged, { valueEnd: handle.getValue() });
      }
    };

    let whichHandle = 1;

    const tooltipClickCallback = (event: MouseEvent) => {
      const { range } = this.getModel();
      if (!range) {
        whichHandle = 1;
        return;
      }

      if (!firstHandle.getTooltipContent()?.includes('...')) {
        whichHandle = 1;
        return;
      }
      const firstHandleTooltipContent = firstHandle.getTooltipContent();
      const allLength = firstHandleTooltipContent!.length - 3;
      const firstValueLength = firstHandleTooltipContent!.indexOf('...');
      const secondValueLength = allLength - firstValueLength;

      const rectangle = firstHandle.getRectangleTooltip();
      const widthTooltip = rectangle.width;
      const secondValuePercent = secondValueLength / allLength;
      const clickCoord = event.pageX - rectangle.x;
      const clickPercentOfWidth = clickCoord / widthTooltip;

      if (clickPercentOfWidth > secondValuePercent) {
        whichHandle = 2;
      } else {
        whichHandle = 1;
      }
    };

    const callbackMouseUp = () => {
      whichHandle = 1;
    };

    firstHandle
      .getTooltip()
      .addEventListener('pointerdown', tooltipClickCallback);

    firstHandle.getTooltip().addEventListener('pointerup', callbackMouseUp);

    firstHandle.subscribe(ListenersName.clickOnHandle, (newValue) => {
      if (whichHandle === 1) {
        setNewValueOnHandle(newValue, firstHandle);
      } else if (whichHandle === 2) {
        setNewValueOnHandle(newValue, secondHandle);
      }
    });

    secondHandle.subscribe(ListenersName.clickOnHandle, (newValue) => {
      setNewValueOnHandle(newValue, secondHandle);
    });
  }

  private clickOnScale(): void {
    const { track, progress, firstHandle, secondHandle, scale } =
      this.components;

    scale.subscribe(ListenersName.clickOnScale, (value) => {
      const { range } = this.modelOptions;
      const { showProgress } = this.viewOptions;
      let closestHandle: Handle = firstHandle;
      if (range) {
        this.mergeTooltip();
        closestHandle = findClosestHandle({
          firstHandle,
          secondHandle: secondHandle!,
          clickValue: value
        });
      }

      closestHandle.setValue(value);

      const styleValue: number = searchStyleValue({
        minValue: track.getMinValue(),
        maxValue: track.getMaxValue(),
        progress: value
      });

      closestHandle.setStyle(styleValue);

      if (
        isFirstHandleRangeAndShowProgress({
          firstHandle,
          closestHandle,
          range,
          showProgress
        })
      ) {
        progress!.setStart(styleValue);
      }
      if (
        isSecondHandleRangeAndShowProgress({
          secondHandle,
          closestHandle,
          range,
          showProgress
        })
      ) {
        progress!.setEnd(styleValue);
      }

      if (isNotRangeAndShowProgress(range, showProgress)) {
        progress!.setStart(0);
        progress!.setEnd(styleValue);
      }

      if (closestHandle === firstHandle) {
        this.emit(ListenersName.viewChanged, {
          valueStart: closestHandle.getValue()
        });
      } else if (closestHandle === secondHandle) {
        this.emit(ListenersName.viewChanged, {
          valueEnd: closestHandle.getValue()
        });
      }
    });
  }

  private clickOnTrack(): void {
    const { track, firstHandle, secondHandle, progress } = this.components;

    track.subscribe(
      ListenersName.clickOnTrack,
      ({
        event,
        value,
        click
      }: {
        event: MouseEvent;
        value: number;
        click: number;
      }) => {
        const { showProgress } = this.viewOptions;
        const { range } = this.modelOptions;

        let closestHandle = firstHandle;
        const styleValue = searchStyleValue({
          minValue: track.getMinValue(),
          maxValue: track.getMaxValue(),
          progress: value
        });

        if (range) {
          closestHandle = findClosestHandle({
            firstHandle,
            secondHandle: secondHandle!,
            clickValue: value
          });
          this.mergeTooltip();

          if (
            isClickFromSecondHandlePosition({
              click,
              styleValue,
              firstHandle,
              secondHandle: secondHandle!
            })
          ) {
            closestHandle = secondHandle!;
          }
        }

        closestHandle.setValue(value);
        closestHandle.setStyle(styleValue);

        if (
          isFirstHandleRangeAndShowProgress({
            firstHandle,
            closestHandle,
            range,
            showProgress
          })
        ) {
          progress!.setStart(styleValue);
        }
        if (
          isSecondHandleRangeAndShowProgress({
            secondHandle,
            closestHandle,
            range,
            showProgress
          })
        ) {
          progress!.setEnd(styleValue);
        }
        if (isNotRangeAndShowProgress(range, showProgress)) {
          progress!.setStart(0);
          progress!.setEnd(styleValue);
        }
        if (closestHandle === firstHandle) {
          this.emit(ListenersName.viewChanged, {
            valueStart: closestHandle.getValue()
          });
        } else if (closestHandle === secondHandle) {
          this.emit(ListenersName.viewChanged, {
            valueEnd: closestHandle.getValue()
          });
        }

        closestHandle.handleMouseDown(event);
      }
    );
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
    this.observeScalePointCountAtr();
    this.observeShowTooltipAtr();
    this.observeIsVerticalAtr();
    this.observeShowProgressAtr();
    this.observeShowScaleAtr();
  }

  private observeScalePointCountAtr(): void {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'scalePointCount';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().scalePointCount;
      const oldValueNumber = toNumber(oldValue!, valFromOptions);
      const valNumber = toNumber(val!, valFromOptions);

      if (isNeedToChangeValue(val!)) {
        this.selector.setAttribute(
          'data-scale-point-count',
          valFromOptions.toString()
        );
      }

      if (valNumber !== oldValueNumber) {
        this.setOptions({ scalePointCount: valNumber });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-scale-point-count']
    });
  }

  private observeShowTooltipAtr(): void {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'showTooltip';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().showTooltip;
      const oldValueBoolean = toBoolean(oldValue!);
      const valBoolean = toBoolean(val!);

      if (isNeedToChangeIfValueBoolean(val!)) {
        this.selector.setAttribute(
          'data-show-tooltip',
          valFromOptions.toString()
        );
      }

      if (valBoolean !== oldValueBoolean) {
        this.setOptions({ showTooltip: valBoolean });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-show-tooltip']
    });
  }

  private observeIsVerticalAtr(): void {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'isVertical';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().isVertical;
      const oldValueBoolean = toBoolean(oldValue!);
      const valBoolean = toBoolean(val!);

      if (isNeedToChangeIfValueBoolean(val!)) {
        this.selector.setAttribute(
          'data-is-vertical',
          valFromOptions.toString()
        );
      }

      if (valBoolean !== oldValueBoolean) {
        this.setOptions({ isVertical: valBoolean });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-is-vertical']
    });
  }

  private observeShowProgressAtr(): void {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'showProgress';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().showProgress;
      const oldValueBoolean = toBoolean(oldValue!);
      const valBoolean = toBoolean(val!);

      if (isNeedToChangeIfValueBoolean(val!)) {
        this.selector.setAttribute(
          'data-show-progress',
          valFromOptions.toString()
        );
      }

      if (valBoolean !== oldValueBoolean) {
        this.setOptions({ showProgress: valBoolean });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-show-progress']
    });
  }

  private observeShowScaleAtr(): void {
    const callback: MutationCallback = (mutationRecords) => {
      const key = 'showScale';
      const val = this.selector.dataset[key];
      const oldValue = mutationRecords[0].oldValue;

      const valFromOptions = this.getOptions().showScale;
      const oldValueBoolean = toBoolean(oldValue!);
      const valBoolean = toBoolean(val!);

      if (isNeedToChangeIfValueBoolean(val!)) {
        this.selector.setAttribute(
          'data-show-scale',
          valFromOptions.toString()
        );
      }

      if (valBoolean !== oldValueBoolean) {
        this.setOptions({ showScale: valBoolean });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.selector, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-show-scale']
    });
  }

  private initOptionsFromDataAtr(): Partial<ViewOptions> {
    const objectFromDataAtr = { ...this.selector.dataset };
    const FilterObjectFromDataAtr = objectFilter(objectFromDataAtr, ([key]) =>
      filterViewOptions(key)
    );

    Object.keys(FilterObjectFromDataAtr).forEach((key) => {
      if (key === 'scalePointCount') {
        FilterObjectFromDataAtr[key] = toNumber(
          FilterObjectFromDataAtr[key],
          DEFAULT_VIEW_OPTIONS.scalePointCount
        );
      }
      if (key === 'showTooltip') {
        FilterObjectFromDataAtr[key] = toBoolean(FilterObjectFromDataAtr[key]);
      }
      if (key === 'isVertical') {
        FilterObjectFromDataAtr[key] = toBoolean(FilterObjectFromDataAtr[key]);
      }
      if (key === 'showProgress') {
        FilterObjectFromDataAtr[key] = toBoolean(FilterObjectFromDataAtr[key]);
      }
      if (key === 'showScale') {
        FilterObjectFromDataAtr[key] = toBoolean(FilterObjectFromDataAtr[key]);
      }
    });

    return FilterObjectFromDataAtr;
  }
}

export default View;
