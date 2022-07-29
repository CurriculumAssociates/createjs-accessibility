import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TreeGridData', () => {
  describe('register role', () => {
    let cjsTreeGrid;
    let tableEl;
    let isRequired;
    let orientationVal;

    beforeEach(() => {
      cjsTreeGrid = new createjs.Shape(); // dummy object
      isRequired = false;
      orientationVal = 'horizontal';

      AccessibilityModule.register({
        accessibleOptions: {
          orientation: orientationVal,
          required: isRequired,
        },
        displayObject: cjsTreeGrid,
        parent: container,
        role: AccessibilityModule.ROLES.TREEGRID,
      });

      stage.accessibilityTranslator.update();
      tableEl = parentEl.querySelector('table[role=treegrid]');
    });

    describe('rendering', () => {
      it('creates table[role=treegrid] element', () => {
        expect(tableEl).not.toBeNull();
      });

      it('sets "aria-orientation" attribute', () => {
        expect(tableEl.getAttribute('aria-orientation')).toEqual(
          orientationVal
        );
      });

      it('sets "aria-required" attribute', () => {
        const ariaRequired = tableEl.getAttribute('aria-required') === 'true';
        expect(ariaRequired).toEqual(isRequired);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsTreeGrid.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsTreeGrid.accessible.orientation = newVal;
        expect(cjsTreeGrid.accessible.orientation).toEqual(newVal);
      });

      it('can read and set "required" property [for "aria-required"]', () => {
        expect(cjsTreeGrid.accessible.required).toEqual(isRequired);

        const newVal = true;
        cjsTreeGrid.accessible.required = newVal;
        expect(cjsTreeGrid.accessible.required).toEqual(newVal);
      });
    });
  });
});
