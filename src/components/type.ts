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

type sliderOptions = {
  minValue?: number;
  maxValue?: number;
  step?: number;
  valueStart?: number;
  valueEnd?: number;
  range?: boolean;
  scalePointCount?: number;
  showTooltip?: boolean;
  isVertical?: boolean;
  showProgress?: boolean;
  showScale?: boolean;
};

type Slider = {
  getContainer(): Element;
  getViewRoot(): HTMLElement;
  getOptions(): sliderOptions;
  setOptions(options: sliderOptions): void;
  getFirstValue(): number;
  getSecondValue(): number;
  addControlPanel(): Panel;
  getModel(): Model;
  getView(): View;
  setDataAtr(): void;
};

type panelElements = {
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

type panelInputs = {
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

type handleProps = {
  handleNumber: number;
  value: number;
  showTooltip: boolean;
  isVertical: boolean;
  track: Track;
  step: number;
};

type scaleProps = {
  minValue: number;
  maxValue: number;
  scalePointCount: number;
  step: number;
  isVertical: boolean;
};

type trackProps = {
  minValue: number;
  maxValue: number;
  isVertical: boolean;
  step: number;
};

type viewProps = {
  selector: HTMLElement;
  modelOptions: ModelOptions;
  viewOptions?: ViewOptions;
};

type panelProps = {
  selector: HTMLElement;
  slider: Slider;
  model: Model;
  view: View;
};

type ListenersFunction<T> = <K extends keyof T>(args: T[K]) => void;
type ListenersFunctionUnsub = () => void;

// eslint-disable-next-line no-shadow
enum ListenersName {
  check = 'check',
  check1 = 'check1',
  viewChanged = 'viewChanged',
  modelValueChange = 'modelValueChange',
  clickOnTrack = 'clickOnTrack',
  clickOnScale = 'clickOnScale',
  clickOnHandle = 'clickOnHandle'
}

type Listeners<T> = Record<keyof T, ListenersFunction<T>[]>;

type PrepareModelOptionsFromDataFtr = {
  minValue: string;
};

export {
  ModelOptions,
  ViewOptions,
  ViewComponents,
  sliderOptions,
  Slider,
  panelElements,
  panelInputs,
  Listeners,
  ListenersFunction,
  ListenersName,
  PrepareModelOptionsFromDataFtr,
  handleProps,
  scaleProps,
  trackProps,
  viewProps,
  panelProps,
  ListenersFunctionUnsub
};
