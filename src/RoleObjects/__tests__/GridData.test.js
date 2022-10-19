import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('GridData', () => {
  describe('register role', () => {
    let cjsGrid;
    let tableEl;
    let shouldEnableKeyEvents;
    let levelVal;
    let isMultiselectable;
    let isReadOnly;

    beforeEach(() => {
      cjsGrid = new createjs.Shape(); // dummy object
      shouldEnableKeyEvents = false;
      levelVal = 99;
      isMultiselectable = false;
      isReadOnly = false;

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
      tableEl = parentEl.querySelector('table[role=grid]');
    });

    describe('rendering', () => {
      it('creates table[role=grid] element', () => {
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-level" attribute', () => {
        expect(parseInt(tableEl.getAttribute('aria-level'), 10)).toEqual(
          levelVal
        );
      });

      it('sets "aria-multiselectable" attribute', () => {
        const ariaMultiselectable =
          tableEl.getAttribute('aria-multiselectable') === 'true';
        expect(ariaMultiselectable).toEqual(isMultiselectable);
      });

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly = tableEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
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
        expect(cjsGrid.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsGrid.accessible.enableKeyEvents = newVal;
        expect(cjsGrid.accessible.enableKeyEvents).toEqual(newVal);
      });
    });
  });
});
