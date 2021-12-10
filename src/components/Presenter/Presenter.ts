import { ModelOptions, ListenersName } from '../type';
import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  constructor(private model: Model, private view: View) {
    this.render();
  }

  private render(): void {
    this.view.render();
    this.connect();
  }

  private getModelOptions(): ModelOptions {
    return this.model.getOptions();
  }

  private setModelOptions(modelOptions: Partial<ModelOptions>): void {
    this.model.setOptions(modelOptions);
  }

  private updateView(): void {
    this.view.changeModelOptions(this.getModelOptions());
    this.view.updateView();
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
