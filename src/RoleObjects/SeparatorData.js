import AccessibilityObject from './AccessibilityObject';

export default class SeparatorData extends AccessibilityObject {
  set orientation(value) {
    this._reactProps['aria-orientation'] = value;
  }

  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  set valueMax(value) {
    this._reactProps['aria-valuemax'] = value;
  }

  get valueMax() {
    return this._reactProps['aria-valuemax'];
  }

  set valueMin(value) {
    this._reactProps['aria-valuemin'] = value;
  }

  get valueMin() {
    return this._reactProps['aria-valuemin'];
  }

  set valueNow(value) {
    this._reactProps['aria-valuenow'] = value;
  }

  get valueNow() {
    return this._reactProps['aria-valuenow'];
  }

  set valueText(value) {
    this._reactProps['aria-valuetext'] = value;
  }

  get valueText() {
    return this._reactProps['aria-valuetext'];
  }
}
