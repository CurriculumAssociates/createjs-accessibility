import _ from 'lodash';
import SectionData from './SectionData.js';

export default class MathData extends SectionData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
  }
  set mathML(mathML){
    this._reactProps.dangerouslySetInnerHTML = {__html:mathML};
  }
  get mathML(){
    return _.get(this._reactProps.dangerouslySetInnerHTML, '__html');
  }
}
