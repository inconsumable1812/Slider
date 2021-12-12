import { ModelOptions, ListenersName } from '../type';
import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  constructor(private model: Model, private view: View) {
    this.render();
  }

  public getModelOptions(): ModelOptions {
    return this.model.getOptions();
  }

  public setModelOptions(modelOptions: Partial<ModelOptions>): void {
    this.model.setOptions(modelOptions);
  }

  public updateView(): void {
    this.view.changeModelOptions(this.getModelOptions());
    this.view.updateView();
  }

  private render(): void {
    this.view.render();
    this.connect();
  }

  private connect(): void {
    this.view.subscribe(
      ListenersName.viewChanged,
      this.setModelOptions.bind(this)
    );
    this.model.subscribe(
      ListenersName.modelValueChange,
      this.updateView.bind(this)
    );
  }
}

export default Presenter;
