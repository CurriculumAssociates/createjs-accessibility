import SectionData from './SectionData';

export default class MathData extends SectionData {
  set mathML(mathML) {
    this._htmlString = mathML;
  }

  get mathML() {
    return this._htmlString;
  }
}
