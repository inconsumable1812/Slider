import { ModelOptions } from '../type';

import Model from '../model/Model';
import View from '../views/View';

class Presenter {
  constructor(private model: Model, private view: View) {
    this.render();
  }
  private render(): void {
    this.view.render();
    this.connect();
  }

  getModelOptions(): ModelOptions {
    return this.model.getOptions();
  }

  setModelOptions(modelOptions: Partial<ModelOptions>): void {
    // console.log(modelOptions);
    this.model.setOptions(modelOptions);
    // this.view.updateView();
  }
  updateView(modelOptions: Partial<ModelOptions>): void {
    // console.log('modelOptions', modelOptions);
    this.view.changeModelOptions(modelOptions);
    // this.view.updateView();
  }

  private connect(): void {
    this.view.subscribe('viewChanged', this.setModelOptions.bind(this));
    this.model.subscribe('modelValueChange', this.updateView.bind(this));
  }
}

export default Presenter;
