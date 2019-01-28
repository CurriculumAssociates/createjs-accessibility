import RangeData from './RangeData';

export default class ProgressData extends RangeData {
  set valueMax(value) {
    this._reactProps.max = value;
  }

  get valueMax() {
    this._reactProps.max;
  }

  set valueNow(value) {
    this._reactProps.value = value;
  }

  get valueNow() {
    this._reactProps.value;
  }
}
