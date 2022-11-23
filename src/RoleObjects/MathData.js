import SectionData from './SectionData';

export default class MathData extends SectionData {
  set mathML(mathML) {
    this.text = mathML;
  }

  get mathML() {
    return this.text;
  }
}
