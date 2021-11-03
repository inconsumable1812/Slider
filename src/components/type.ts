/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
import Panel from './panel/Panel';
import Handle from './views/handle/Handle';
import Progress from './views/progress/Progress';
import Scale from './views/Scale/Scale';
import Track from './views/Track/Track';

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
  getContainer(): HTMLElement;
  getViewRoot(): HTMLElement;
  getOptions(): sliderOptions;
  setOptions(options: sliderOptions): void;
  getFirstValue(): number;
  getSecondValue(): number;
  addControlPanel(): Panel;
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

type ListenersFunction = (...args: any) => void;

enum ListenersName {
  check = 'check',
  check1 = 'check1',
  viewChanged = 'viewChanged',
  modelValueChange = 'modelValueChange',
  clickOnTrack = 'clickOnTrack'
}

type Listeners = {
  [key in ListenersName]?: ListenersFunction[];
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
  ListenersName
};
