import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('GridCellData', () => {
  describe('register role', () => {
    let cjsTable;
    let cjsTableBody;
    let cjsRow;
    let cjsGridCell;
    let tdEl;
    let isReadOnly;
    let isRequired;
    let isSelected;

    beforeEach(() => {
      cjsTable = new createjs.Shape(); // dummy object
      cjsTableBody = new createjs.Shape(); // dummy object
      cjsRow = new createjs.Shape(); // dummy object
      cjsGridCell = new createjs.Shape(); // dummy object
      isReadOnly = false;
      isRequired = false;
      isSelected = false;

      AccessibilityModule.register({
        displayObject: cjsTable,
        parent: container,
        role: AccessibilityModule.ROLES.TABLE,
      });

      AccessibilityModule.register({
        displayObject: cjsTableBody,
        parent: cjsTable,
        role: AccessibilityModule.ROLES.TABLEBODY,
      });

      AccessibilityModule.register({
        displayObject: cjsRow,
        parent: cjsTableBody,
        role: AccessibilityModule.ROLES.ROW,
      });

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
          required: isRequired,
          selected: isSelected,
        },
        displayObject: cjsGridCell,
        parent: cjsRow,
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
        const ariaReadOnly = tdEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
      });

      it('sets "aria-required" attribute', () => {
        const ariaRequired = tdEl.getAttribute('aria-required') === 'true';
        expect(ariaRequired).toEqual(isRequired);
      });

      it('sets "aria-selected" attribute', () => {
        const ariaSelected = tdEl.getAttribute('aria-selected') === 'true';
        expect(ariaSelected).toEqual(isSelected);
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
