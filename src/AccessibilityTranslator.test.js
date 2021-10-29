import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import * as createjs from 'createjs-module';
import { configure, mount } from 'enzyme';
import AccessibilityTranslator from './AccessibilityTranslator';

configure({ adapter: new Adapter() });

describe('AccessibilityTranslator', () => {
  it('should throw error when root setter called without accessible property', () => {
    const stage = new createjs.Stage('stage');
    const wrapper = mount(<AccessibilityTranslator stage={stage} />);
    const instance = wrapper.instance();
    expect(() => {
      instance.root = {};
    }).toThrowError(/root of the accessibility tree/);
    expect(() => {
      instance.root = { accessible: {} };
    }).not.toThrowError(/root of the accessibility tree/);
  });
});
