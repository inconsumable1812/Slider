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
  filterViewOptions
} from '../../utils/utils';
import {
  ModelOptions,
  ViewComponents,
  ViewOptions,
  ViewListeners,
  ViewProps,
  SliderOptions
} from '../type';
import {
  NEW_VAL_BIGGER_VALUE_END,
  NEW_VAL_LESS_VALUE_START,
  VALUE_END,
  VALUE_START
} from '../constants';
import { DEFAULT_VIEW_OPTIONS } from '../default';
import Observer from '../Observer/Observer';
import Handle from './Handle/Handle';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Track from './Track/Track';
import * as Fn from './view.function';

class View extends Observer<{
  viewChanged: Partial<SliderOptions>;
  viewChangeModel: [string, number];
}> {
  private components!: ViewComponents;
  private root!: HTMLElement;
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

  getRoot(): HTMLElement {
    return this.root;
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
      Fn.searchStyleValue({ minValue, maxValue, progress: valueStart })
    );

    if (showProgress) {
      track.getElement().append(progress.getElement());
      progress.setOrientation(isVertical);
    } else {
      progress.getElement().remove();
    }

    if (showScale) {
      scale.setOrientation(isVertical);
      scale.setScaleOptions(maxValue, minValue, step, scalePointCount);
    } else {
      scale.deleteScalePoint();
    }

    this.mergeTooltip();

    if (range) {
      this.root.append(secondHandle.getElement());

      secondHandle.setValue(valueEnd);
      secondHandle.setStyle(
        Fn.searchStyleValue({ minValue, maxValue, progress: valueEnd })
      );
    } else {
      secondHandle.getElement().remove();
    }

    if (Fn.isNotRangeAndStayMergeTooltip(range, firstHandle)) {
      firstHandle.setTooltipContent();
    }

    if (Fn.isRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(
        Fn.searchStyleValue({ minValue, maxValue, progress: valueStart }),
        Fn.searchStyleValue({ minValue, maxValue, progress: valueEnd })
      );
    }

    if (Fn.isNotRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(
        0,
        Fn.searchStyleValue({ minValue, maxValue, progress: valueStart })
      );
    }

    if (showTooltip) {
      firstHandle.showTooltipMethod();
    } else {
      firstHandle.hideTooltip();
    }

    if (Fn.isShowTooltipAndRange(showTooltip, range)) {
      secondHandle.showTooltipMethod();
    }

    if (Fn.isHideTooltipAndRange(showTooltip, range)) {
      secondHandle.hideTooltip();
    }

    track.setMaxMinValueAndStep(maxValue, minValue, step);
    firstHandle.updateStep(step);
    secondHandle.updateStep(step);

    const styleValueFirst = Fn.searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueStart
    });

    // when change orientation
    if (range) {
      const styleValueSecond = Fn.searchStyleValue({
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
      progress.setOrientation(isVertical);
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
      isVertical,
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
      progress: new Progress(isVertical),
      scale: new Scale({
        minValue,
        maxValue,
        scalePointCount,
        step,
        isVertical
      })
    };

    const { track, firstHandle, secondHandle, scale, progress } =
      this.components;

    if (showProgress) {
      track.getElement().append(progress.getElement());
    }
    this.root.append(track.getElement());
    this.root.append(firstHandle.getElement());
    if (range) {
      this.root.append(secondHandle.getElement());
    }
    if (showScale) {
      this.root.append(scale.getElement());
    }

    const firstHandleStyleValue = Fn.searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueStart
    });

    const secondHandleStyleValue = Fn.searchStyleValue({
      minValue: track.getMinValue(),
      maxValue: track.getMaxValue(),
      progress: valueEnd
    });

    firstHandle.setStyle(firstHandleStyleValue);
    if (range) {
      secondHandle.setStyle(secondHandleStyleValue);
    }

    if (Fn.isRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(firstHandleStyleValue, secondHandleStyleValue);
    }

    if (Fn.isNotRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(0, firstHandleStyleValue);
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

  private checkScalePointCount(): void | null {
    const { scalePointCount } = this.viewOptions;
    if (scalePointCount < MIN_SCALE_POINT_COUNT) {
      return this.setOptions({ scalePointCount: MIN_SCALE_POINT_COUNT });
    }
    if (scalePointCount > MAX_SCALE_POINT_COUNT) {
      return this.setOptions({ scalePointCount: MAX_SCALE_POINT_COUNT });
    }
    return null;
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

    if (Fn.isNotRangeAndContainsClassListMerged(range, firstHandle)) {
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
    const { firstHandle, secondHandle } = this.components;

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
      if (firstHandleTooltipContent === null) return;
      const allLength = firstHandleTooltipContent.length - 3;
      const firstValueLength = firstHandleTooltipContent.indexOf('...');
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

    firstHandle.subscribe(ViewListeners.clickOnHandle, (percent: number) => {
      const { step, range, maxValue, minValue } = this.getModel();
      if (whichHandle === 1) {
        if (
          Fn.isNewValueStartBiggerValueEnd({
            percent,
            secondHandle,
            range,
            step,
            maxValue,
            minValue
          })
        ) {
          this.emit(ViewListeners.viewChangeModel, [
            NEW_VAL_BIGGER_VALUE_END,
            percent
          ]);
          return;
        }

        this.emit(ViewListeners.viewChangeModel, [VALUE_START, percent]);
      } else if (whichHandle === 2) {
        if (
          Fn.isNewValueEndLessValueStart({
            percent,
            firstHandle,
            step,
            maxValue,
            minValue
          })
        ) {
          this.emit(ViewListeners.viewChangeModel, [
            NEW_VAL_LESS_VALUE_START,
            percent
          ]);
          return;
        }
        this.emit(ViewListeners.viewChangeModel, [VALUE_END, percent]);
      }
    });

    secondHandle.subscribe(ViewListeners.clickOnHandle, (percent) => {
      const { step, maxValue, minValue } = this.getModel();

      if (
        Fn.isNewValueEndLessValueStart({
          percent,
          firstHandle,
          step,
          maxValue,
          minValue
        })
      ) {
        this.emit(ViewListeners.viewChangeModel, [
          NEW_VAL_LESS_VALUE_START,
          percent
        ]);

        return;
      }
      this.emit(ViewListeners.viewChangeModel, [VALUE_END, percent]);
    });
  }

  private clickOnScale(): void {
    const { firstHandle, secondHandle, scale } = this.components;

    scale.subscribe(ViewListeners.clickOnScale, (value) => {
      const { range } = this.modelOptions;

      let closestHandle: Handle = firstHandle;
      if (range) {
        this.mergeTooltip();
        closestHandle = Fn.findClosestHandle({
          firstHandle,
          secondHandle,
          clickValue: value
        });
      }

      if (closestHandle === firstHandle) {
        this.emit(ViewListeners.viewChanged, {
          valueStart: value
        });
      } else if (closestHandle === secondHandle) {
        this.emit(ViewListeners.viewChanged, {
          valueEnd: value
        });
      }
    });
  }

  private clickOnTrack(): void {
    const { track, firstHandle, secondHandle } = this.components;

    track.subscribe(
      ViewListeners.clickOnTrack,
      ({
        event,
        progressPercent
      }: {
        event: MouseEvent;
        progressPercent: number;
      }) => {
        const { range } = this.modelOptions;
        let closestHandle = firstHandle;

        if (range) {
          closestHandle = Fn.findClosestHandleFromPercent({
            firstHandle,
            secondHandle,
            percent: progressPercent
          });
          this.mergeTooltip();

          if (
            Fn.isClickFromSecondHandlePosition({
              percent: progressPercent,
              firstHandle,
              secondHandle
            })
          ) {
            closestHandle = secondHandle;
          }
        }

        if (closestHandle === firstHandle) {
          this.emit(ViewListeners.viewChangeModel, [
            VALUE_START,
            progressPercent
          ]);
        } else if (closestHandle === secondHandle) {
          this.emit(ViewListeners.viewChangeModel, [
            VALUE_END,
            progressPercent
          ]);
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
