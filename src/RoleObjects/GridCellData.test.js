import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('GridCellData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsGridCell;
    let tdEl;
    let isReadOnly;
    let isRequired;
    let isSelected;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsGridCell = new createjs.Shape(); // dummy object
      isReadOnly = false;
      isRequired = false;
      isSelected = false;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
          required: isRequired,
          selected: isSelected,
        },
        displayObject: cjsGridCell,
        parent: container,
        role: AccessibilityModule.ROLES.GRIDCELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates td[role=gridcell] element', () => {
        tdEl = parentEl.querySelector('td[role=gridcell]');
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-readonly" attribute', () => {
        tdEl = parentEl.querySelector(`td[role=gridcell][aria-readonly='${isReadOnly}']`);
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-required" attribute', () => {
        tdEl = parentEl.querySelector(`td[role=gridcell][aria-required='${isRequired}']`);
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-required" attribute', () => {
        tdEl = parentEl.querySelector(`td[role=gridcell][aria-selected='${isSelected}']`);
        expect(tdEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsGridCell.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsGridCell.accessible.readOnly = newVal;
        expect(cjsGridCell.accessible.readOnly).toEqual(newVal);
      });

      it('can read and set "required" property [for "aria-required"]', () => {
        expect(cjsGridCell.accessible.required).toEqual(isRequired);

        const newVal = true;
        cjsGridCell.accessible.required = newVal;
        expect(cjsGridCell.accessible.required).toEqual(newVal);
      });

      it('can read and set "selected" property [for "aria-selected"]', () => {
        expect(cjsGridCell.accessible.selected).toEqual(isSelected);

        const newVal = true;
        cjsGridCell.accessible.selected = newVal;
        expect(cjsGridCell.accessible.selected).toEqual(newVal);
      });
    });
  });
});
