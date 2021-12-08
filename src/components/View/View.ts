import {
  MIN_SCALE_POINT_COUNT,
  MAX_SCALE_POINT_COUNT,
  VERTICAL_CLASS
} from '../../constants';
import { render } from '../../utils/utils';
import {
  ModelOptions,
  ViewComponents,
  ViewOptions,
  ListenersName
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
  private el: Element;
  constructor(
    selector: Element,
    private modelOptions: ModelOptions,
    private viewOptions: ViewOptions = DEFAULT_VIEW_OPTIONS
  ) {
    super();
    this.el = selector;
    this.initViewOptions();
    this.checkScalePointCount();
  }

  setOptions(viewOptions: Partial<ViewOptions>): void {
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.checkScalePointCount();
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
    firstHandle.setStyle(searchStyleValue(minValue, maxValue, valueStart));

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
      secondHandle.setStyle(searchStyleValue(minValue, maxValue, valueEnd));
      this.mergeTooltip();
    } else {
      secondHandle.element.remove();
    }

    if (isNotRangeAndStayMergeTooltip(range, firstHandle)) {
      firstHandle.setTooltipContent();
    }

    if (isRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(
        searchStyleValue(minValue, maxValue, valueStart),
        searchStyleValue(minValue, maxValue, valueEnd)
      );
    }

    if (isNotRangeAndShowProgress(range, showProgress)) {
      progress.setStyle(0, searchStyleValue(minValue, maxValue, valueStart));
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

    const styleValueFirst = searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      valueStart
    );

    // when change orientation
    if (range) {
      const styleValueSecond = searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        valueEnd
      );
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

    const trackInstance = new Track(minValue, maxValue, isVertical!, step);

    this.components = {
      track: trackInstance,
      firstHandle: new Handle(
        1,
        valueStart,
        showTooltip,
        isVertical,
        trackInstance,
        step
      ),
      secondHandle: new Handle(
        2,
        valueEnd,
        showTooltip,
        isVertical,
        trackInstance,
        step
      ),
      progress: new Progress(isVertical!),
      scale: new Scale(minValue, maxValue, scalePointCount!, step, isVertical!)
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

    const firstHandleStyleValue = searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      valueStart
    );
    const secondHandleStyleValue = searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      valueEnd
    );

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

    this.el.append(this.root);

    this.bindEventListeners();
  }

  private initViewOptions(): void {
    this.viewOptions = { ...DEFAULT_VIEW_OPTIONS, ...this.viewOptions };
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
    this.countOfSteps();
  }

  private mergeTooltip(): void {
    const { firstHandle, secondHandle } = this.components;
    const deltaStyle =
      secondHandle!.getStyleValue() - firstHandle.getStyleValue();
    const firstHandleTooltip = firstHandle.getValue();
    const secondHandleTooltip = secondHandle?.getValue();
    if (deltaStyle <= 5) {
      firstHandle.setTooltipContent(
        `${firstHandleTooltip}...${secondHandleTooltip}`
      );
      secondHandle?.clearTooltipContent();
    } else if (firstHandle.getTooltipContent()?.includes('...')) {
      firstHandle.setTooltipContent();
      secondHandle?.setTooltipContent();
    }
  }

  private countOfSteps(): void {
    const { scale } = this.components;
    scale.subscribe(ListenersName.countOfSteps, (count: number) => {
      if (this.getOptions().scalePointCount !== count) {
        return this.setOptions({ scalePointCount: count });
      }
      return null;
    });
  }

  private clickOnHandle(): void {
    const { track, progress, firstHandle, secondHandle } = this.components;

    const setNewValueOnHandle = (newValue: number, handle: Handle) => {
      const { range } = this.modelOptions;
      const { showProgress } = this.viewOptions;

      const styleValue: number = searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        newValue
      );

      if (range) {
        if (isNewValueCorrect(handle, newValue, firstHandle, secondHandle)) {
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

    firstHandle.subscribe(ListenersName.clickOnHandle, (newValue) => {
      setNewValueOnHandle(newValue, firstHandle);
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
      let closetHandle: Handle = firstHandle;
      if (range) {
        this.mergeTooltip();
        closetHandle = findClosestHandle(firstHandle, secondHandle!, value);
      }

      closetHandle.setValue(value);

      const styleValue: number = searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        value
      );

      closetHandle.setStyle(styleValue);

      if (
        isFirstHandleRangeAndShowProgress(
          firstHandle,
          closetHandle,
          range,
          showProgress
        )
      ) {
        progress!.setStart(styleValue);
      }
      if (
        isSecondHandleRangeAndShowProgress(
          secondHandle,
          closetHandle,
          range,
          showProgress
        )
      ) {
        progress!.setEnd(styleValue);
      }

      if (isNotRangeAndShowProgress(range, showProgress)) {
        progress!.setStart(0);
        progress!.setEnd(styleValue);
      }

      if (closetHandle === firstHandle) {
        this.emit(ListenersName.viewChanged, {
          valueStart: closetHandle.getValue()
        });
      } else if (closetHandle === secondHandle) {
        this.emit(ListenersName.viewChanged, {
          valueEnd: closetHandle.getValue()
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

        let closetHandle = firstHandle;
        const styleValue = searchStyleValue(
          track.getMinValue(),
          track.getMaxValue(),
          value
        );

        if (range) {
          closetHandle = findClosestHandle(firstHandle, secondHandle!, value);
          this.mergeTooltip();

          if (
            isClickFromSecondHandlePosition(
              click,
              styleValue,
              firstHandle,
              secondHandle!
            )
          ) {
            closetHandle = secondHandle!;
          }
        }

        closetHandle.setValue(value);
        closetHandle.setStyle(styleValue);

        if (
          isFirstHandleRangeAndShowProgress(
            firstHandle,
            closetHandle,
            range,
            showProgress
          )
        ) {
          progress!.setStart(styleValue);
        }
        if (
          isSecondHandleRangeAndShowProgress(
            secondHandle,
            closetHandle,
            range,
            showProgress
          )
        ) {
          progress!.setEnd(styleValue);
        }
        if (isNotRangeAndShowProgress(range, showProgress)) {
          progress!.setStart(0);
          progress!.setEnd(styleValue);
        }
        if (closetHandle === firstHandle) {
          this.emit(ListenersName.viewChanged, {
            valueStart: closetHandle.getValue()
          });
        } else if (closetHandle === secondHandle) {
          this.emit(ListenersName.viewChanged, {
            valueEnd: closetHandle.getValue()
          });
        }

        closetHandle.handleMouseDown(event);
      }
    );
  }
}

export default View;
