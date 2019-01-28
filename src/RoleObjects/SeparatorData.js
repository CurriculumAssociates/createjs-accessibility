import AccessibilityObject from './AccessibilityObject.js';

export default class SeparatorData extends AccessibilityObject {
  set orientation(value) {
    this._reactProps['aria-orientation'] = value;
  }

  get orientation() {
    this._reactProps['aria-orientation'];
  }

  set valueMax(value) {
    this._reactProps['aria-valuemax'] = value;
  }

  get valueMax() {
    this._reactProps['aria-valuemax'];
  }

  set valueMin(value) {
    this._reactProps['aria-valuemin'] = value;
  }

  get valueMin() {
    this._reactProps['aria-valuemin'];
  }

  set valueNow(value) {
    this._reactProps['aria-valuenow'] = value;
  }

  get valueNow() {
    this._reactProps['aria-valuenow'];
  }

  set valueText(value) {
    this._reactProps['aria-valuetext'] = value;
  }

  get valueText() {
    this._reactProps['aria-valuetext'];
  }
}
