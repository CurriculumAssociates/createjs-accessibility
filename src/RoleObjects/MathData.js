import SectionData from './SectionData.js';
import React from 'react';

/**
 * Base class for role objects that use the math HTML tag.  This contains only setters/getters for fields that are common to all math tags regardless of the type attribute.
 */
export default class MathData extends SectionData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    this._mathML;
  }
  set mathML(mathML){
    this._mathML = mathML;
    this._reactProps.dangerouslySetInnerHTML = {__html:mathML};
  }
  get mathML(){
    return this._mathML;
  }
}
