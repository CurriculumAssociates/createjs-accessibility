import _ from 'lodash';
import SectionData from './SectionData';

export default class MathData extends SectionData {
  set mathML(mathML) {
    this._reactProps.dangerouslySetInnerHTML = { __html: mathML };
  }

  get mathML() {
    return _.get(this._reactProps.dangerouslySetInnerHTML, '__html');
  }
}
