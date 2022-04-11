import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('GridData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsGrid;
    let tableEl;
    let shouldEnableKeyEvents;
    let levelVal;
    let isMultiselectable;
    let isReadOnly;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsGrid = new createjs.Shape(); // dummy object
      shouldEnableKeyEvents = false;
      levelVal = 99;
      isMultiselectable = false;
      isReadOnly = false;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
          level: levelVal,
          multiselectable: isMultiselectable,
          readOnly: isReadOnly,
        },
        displayObject: cjsGrid,
        parent: container,
        role: AccessibilityModule.ROLES.GRID,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates table[role=grid] element', () => {
        tableEl = parentEl.querySelector('table[role=grid]');
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-level" attribute', () => {
        tableEl = parentEl.querySelector(`table[role=grid][aria-level='${levelVal}']`);
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-multiselectable" attribute', () => {
        tableEl = parentEl.querySelector(`table[role=grid][aria-multiselectable='${isMultiselectable}']`);
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-readonly" attribute', () => {
        tableEl = parentEl.querySelector(`table[role=grid][aria-readonly='${isReadOnly}']`);
        expect(tableEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "level" property [for "aria-level"]', () => {
        expect(cjsGrid.accessible.level).toEqual(levelVal);

        const newVal = -1;
        cjsGrid.accessible.level = newVal;
        expect(cjsGrid.accessible.level).toEqual(newVal);
      });

      it('can read and set "multiselectable" property [for "aria-multiselectable"]', () => {
        expect(cjsGrid.accessible.multiselectable).toEqual(isMultiselectable);

        const newVal = true;
        cjsGrid.accessible.multiselectable = newVal;
        expect(cjsGrid.accessible.multiselectable).toEqual(newVal);
      });

      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsGrid.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsGrid.accessible.readOnly = newVal;
        expect(cjsGrid.accessible.readOnly).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsGrid.accessible.enableKeyEvents).toEqual(shouldEnableKeyEvents);

        const newVal = true;
        cjsGrid.accessible.enableKeyEvents = newVal;
        expect(cjsGrid.accessible.enableKeyEvents).toEqual(newVal);
      });
    });
  });
});
