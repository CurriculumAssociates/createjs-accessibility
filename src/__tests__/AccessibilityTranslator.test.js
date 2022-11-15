import * as createjs from 'createjs-module';
import AccessibilityTranslator from '../AccessibilityTranslator';

describe('AccessibilityTranslator', () => {
  let stage;
  let instance;
  let rootObj;

  beforeEach(() => {
    stage = new createjs.Stage('stage');
    instance = new AccessibilityTranslator(stage);
    rootObj = { accessible: {} };
  });

  it('should throw error when root setter called without accessible property', () => {
    expect(() => {
      instance.root = {};
    }).toThrowError(/root of the accessibility tree/);
  });

  it('should not throw error when root setter called with accessible property', () => {
    expect(() => {
      instance.root = rootObj;
    }).not.toThrowError(/root of the accessibility tree/);
  });

  it('should get and set root', () => {
    instance.root = rootObj;
    expect(instance.root).toEqual(rootObj);
  });
});
