import Model from './Model/Model';
import Panel from './Panel/Panel';
import Handle from './View/Handle/Handle';
import Progress from './View/Progress/Progress';
import Scale from './View/Scale/Scale';
import Track from './View/Track/Track';
import View from './View/View';

type ModelOptions = {
  minValue: number;
  maxValue: number;
  step: number;
  valueStart: number;
  valueEnd: number;
  range: boolean;
};

type ViewOptions = {
  scalePointCount: number;
  showTooltip: boolean;
  isVertical: boolean;
  showProgress: boolean;
  showScale: boolean;
};

type ViewComponents = {
  track: Track;
  firstHandle: Handle;
  secondHandle: Handle;
  progress: Progress;
  scale: Scale;
};

type SliderOptions = {
  minValue: number;
  maxValue: number;
  step: number;
  valueStart: number;
  valueEnd: number;
  range: boolean;
  scalePointCount: number;
  showTooltip: boolean;
  isVertical: boolean;
  showProgress: boolean;
  showScale: boolean;
};

type ListenersFunction<T> = <K extends keyof T>(args: T[K]) => void;
type ListenersFunctionUnsub = () => void;

type Slider = {
  getContainer(): Element;
  getViewRoot(): HTMLElement;
  getOptions(): SliderOptions;
  setOptions(options: Partial<SliderOptions>): void;
  getFirstValue(): number;
  getSecondValue(): number;
  addControlPanel(): Panel;
  getModel(): Model;
  getView(): View;
  setDataAtr(): void;
  observeDataAtr(): void;
  updateModelOptions(
    fn: ListenersFunction<{ modelValueChange: Partial<ModelOptions> }>
  ): void;
  updateViewOptions(
    fn: ListenersFunction<{ viewChanged: Partial<ViewOptions> }>
  ): void;
};

type PanelElements = {
  maxValueEl: HTMLElement;
  minValueEl: HTMLElement;
  firstValueEl: HTMLElement;
  secondValueEl: HTMLElement;
  showTooltipEL: HTMLElement;
  rangeEl: HTMLElement;
  stepEl: HTMLElement;
  showScaleEl: HTMLElement;
  scalePointEl: HTMLElement;
  progressEl: HTMLElement;
  verticalEl: HTMLElement;
};

type PanelInputs = {
  maxValue: HTMLInputElement;
  minValue: HTMLInputElement;
  valueStart: HTMLInputElement;
  valueEnd: HTMLInputElement;
  showTooltip: HTMLInputElement;
  range: HTMLInputElement;
  step: HTMLInputElement;
  showScale: HTMLInputElement;
  scalePointCount: HTMLInputElement;
  showProgress: HTMLInputElement;
  isVertical: HTMLInputElement;
};

type HandleProps = {
  handleNumber: number;
  value: number;
  showTooltip: boolean;
  isVertical: boolean;
  track: Track;
  step: number;
};

type ScaleProps = {
  minValue: number;
  maxValue: number;
  scalePointCount: number;
  step: number;
  isVertical: boolean;
};

type TrackProps = {
  minValue: number;
  maxValue: number;
  isVertical: boolean;
  step: number;
};

type ViewProps = {
  selector: HTMLElement;
  modelOptions: ModelOptions;
  options?: Partial<ViewOptions>;
};

type PanelProps = {
  selector: HTMLElement;
  slider: Slider;
  model: Model;
  view: View;
};

enum ModelListeners {
  modelValueChange = 'modelValueChange'
}

enum ViewListeners {
  viewChanged = 'viewChanged',
  clickOnTrack = 'clickOnTrack',
  viewChangeModel = 'viewChangeModel',
  clickOnScale = 'clickOnScale',
  clickOnHandle = 'clickOnHandle'
}

type Listeners<T> = Record<keyof T, ListenersFunction<T>[]>;

type JQueryMethod =
  | 'getContainer'
  | 'getOptions'
  | 'setOptions'
  | 'getFirstValue'
  | 'getSecondValue'
  | 'addControlPanel';

type JQResult = number | void | Element | SliderOptions | Panel | null;

export {
  ModelOptions,
  ViewOptions,
  ViewComponents,
  SliderOptions,
  Slider,
  PanelElements,
  PanelInputs,
  Listeners,
  ListenersFunction,
  ModelListeners,
  ViewListeners,
  HandleProps,
  ScaleProps,
  TrackProps,
  ViewProps,
  PanelProps,
  ListenersFunctionUnsub,
  JQueryMethod,
  JQResult
};
