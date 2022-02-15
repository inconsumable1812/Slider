import {
  MIN_SCALE_POINT_COUNT,
  MAX_SCALE_POINT_COUNT,
  VERTICAL_CLASS,
  MERGED_TOOLTIP_CLASS
} from '../../constants';
import {
  render,
  camelCaseToDash,
  toNumber,
  toBoolean,
  objectFilter,
  filterViewOptions,
  roundToRequiredNumber
} from '../../utils/utils';
import {
  ModelOptions,
  ViewComponents,
  ViewOptions,
  ViewListeners,
  ViewProps,
  SliderOptions
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
  isFirstHandleRangeAndShowProgress,
  isSecondHandleRangeAndShowProgress,
  isNewValueStartBiggerValueEnd,
  isNotRangeAndContainsClassListMerged,
  isNewValueEndLessValueStart
} from './view.function';

class View extends Observer<{
  viewChanged: Partial<SliderOptions>;
}> {
  private components!: ViewComponents;
  root!: HTMLElement;
  private selector: HTMLElement;
  private modelOptions: ModelOptions;
  private viewOptions: ViewOptions = DEFAULT_VIEW_OPTIONS;
  private options?: Partial<ViewOptions>;

  constructor({ selector, modelOptions, options }: ViewProps) {
    super();
    this.selector = selector;
    this.modelOptions = modelOptions;
    this.options = options;
    this.initViewOptions();
    this.checkScalePointCount();
  }

  setOptions(viewOptions: Partial<ViewOptions>): void {
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.checkScalePointCount();
    this.setDataAtr();
    this.emit(ViewListeners.viewChanged, this.viewOptions);
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

    this.mergeTooltip();

    if (range) {
      this.root.append(secondHandle!.element);

      secondHandle.setValue(valueEnd);
      secondHandle.setStyle(
        searchStyleValue({ minValue, maxValue, progress: valueEnd })
      );
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

    this.bindEventListeners();

    setTimeout(() => {
      if (range) {
        this.mergeTooltip();
      }
    }, 80);
  }

  private initViewOptions(): void {
    const optionsFromDataAtr = this.initOptionsFromDataAtr();

    this.viewOptions = {
      ...this.viewOptions,
      ...this.options,
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
    const { isVertical } = this.getOptions();
    const { range } = this.getModel();

    if (isNotRangeAndContainsClassListMerged(range, firstHandle)) {
      firstHandle.getTooltip().classList.remove(MERGED_TOOLTIP_CLASS);
      return;
    }

    if (!range) {
      return;
    }

    const firstHandleTooltip = firstHandle.getValue();
    const secondHandleTooltip = secondHandle?.getValue();

    const firstHandleRightSideOrBottom = isVertical
      ? firstHandle.getRectangleTooltip().bottom
      : firstHandle.getRectangleTooltip().right;
    const secondHandleLeftSideOrTop = isVertical
      ? secondHandle.getRectangleTooltip().top
      : secondHandle.getRectangleTooltip().left;

    if (firstHandleRightSideOrBottom >= secondHandleLeftSideOrTop) {
      firstHandle.setTooltipContent(
        `${firstHandleTooltip}...${secondHandleTooltip}`
      );
      firstHandle.getTooltip().classList.add(MERGED_TOOLTIP_CLASS);
      secondHandle.clearTooltipContent();
      secondHandle.hideTooltipContent();
    } else if (firstHandle.getTooltipContent()?.includes('...')) {
      firstHandle.setTooltipContent();
      firstHandle.getTooltip().classList.remove(MERGED_TOOLTIP_CLASS);
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
        handle.setValue(newValue);
        handle.setStyle(styleValue);

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
        this.emit(ViewListeners.viewChanged, { valueStart: handle.getValue() });
      } else if (handle === secondHandle) {
        this.emit(ViewListeners.viewChanged, { valueEnd: handle.getValue() });
      }
    };

    let whichHandle = 1;

    const callbackMouseUp = () => {
      whichHandle = 1;
      document.removeEventListener('pointerup', callbackMouseUp);
    };

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

      if (whichHandle !== 1) {
        document.addEventListener('pointerup', callbackMouseUp);
      }
    };

    firstHandle
      .getTooltip()
      .addEventListener('pointerdown', tooltipClickCallback);

    firstHandle.subscribe(ViewListeners.clickOnHandle, (newValue: number) => {
      const { step, range, valueEnd, valueStart, maxValue } = this.getModel();
      if (whichHandle === 1) {
        if (
          isNewValueStartBiggerValueEnd({
            newValue,
            secondHandle,
            step,
            range,
            maxValue
          })
        ) {
          setNewValueOnHandle(
            roundToRequiredNumber(valueEnd - step),
            firstHandle
          );

          return;
        }

        setNewValueOnHandle(newValue, firstHandle);
      } else if (whichHandle === 2) {
        if (
          isNewValueEndLessValueStart({
            newValue,
            firstHandle,
            step
          })
        ) {
          setNewValueOnHandle(
            roundToRequiredNumber(valueStart + step),
            secondHandle
          );
          return;
        }
        setNewValueOnHandle(newValue, secondHandle);
      }
    });

    secondHandle.subscribe(ViewListeners.clickOnHandle, (newValue) => {
      const { step, valueStart } = this.getModel();

      if (
        isNewValueEndLessValueStart({
          newValue,
          firstHandle,
          step
        })
      ) {
        setNewValueOnHandle(
          roundToRequiredNumber(valueStart + step),
          secondHandle
        );
        return;
      }
      setNewValueOnHandle(newValue, secondHandle);
    });
  }

  private clickOnScale(): void {
    const { track, progress, firstHandle, secondHandle, scale } =
      this.components;

    scale.subscribe(ViewListeners.clickOnScale, (value) => {
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
        this.emit(ViewListeners.viewChanged, {
          valueStart: closestHandle.getValue()
        });
      } else if (closestHandle === secondHandle) {
        this.emit(ViewListeners.viewChanged, {
          valueEnd: closestHandle.getValue()
        });
      }
    });
  }

  private clickOnTrack(): void {
    const { track, firstHandle, secondHandle, progress } = this.components;

    track.subscribe(
      ViewListeners.clickOnTrack,
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
          this.emit(ViewListeners.viewChanged, {
            valueStart: closestHandle.getValue()
          });
        } else if (closestHandle === secondHandle) {
          this.emit(ViewListeners.viewChanged, {
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
