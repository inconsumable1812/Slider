import {
  ModelOptions,
  ModelListeners,
  ViewListeners,
  ListenersFunctionUnsub,
  ListenersFunction,
  SliderOptions
} from '../type';
import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  private unsubView!: ListenersFunctionUnsub;
  private unsubViewChangeModel!: ListenersFunctionUnsub;
  private unsubModel!: ListenersFunctionUnsub;
  constructor(private model: Model, private view: View) {
    this.render();
  }

  public getModelOptions(): ModelOptions {
    return this.model.getOptions();
  }

  public setModelOptions(modelOptions: Partial<ModelOptions>): void {
    this.model.setOptions(modelOptions);
  }

  public calculateValueFromView([valueStartOrEnd, percent]: [
    string,
    number
  ]): void {
    this.model.calculateValueFromView([valueStartOrEnd, percent]);
  }

  public updateView(modelOptions: Partial<ModelOptions>): void {
    this.view.changeModelOptions(modelOptions);
    this.view.updateView();
  }

  public unsubscribe(): void {
    this.unsubView();
    this.unsubModel();
    this.unsubViewChangeModel();
  }

  private render(): void {
    this.view.render();
    this.connect();
  }

  private connect(): void {
    this.unsubView = this.view.subscribe(
      ViewListeners.viewChanged,
      this.setModelOptions.bind(this) as ListenersFunction<{
        viewChanged: Partial<SliderOptions>;
      }>
    );
    this.unsubViewChangeModel = this.view.subscribe(
      ViewListeners.viewChangeModel,
      this.calculateValueFromView.bind(this) as ListenersFunction<{
        viewChangeModel: [string, number];
      }>
    );
    this.unsubModel = this.model.subscribe(
      ModelListeners.modelValueChange,
      this.updateView.bind(this)
    );
  }
}

export default Presenter;
