import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('CellData', () => {
  describe('register role', () => {
    let cjsTable;
    let cjsTableBody;
    let cjsRow;
    let cjsCell;
    let tdEl;
    let colIndexVal;
    let colSpanVal;
    let rowIndexVal;
    let rowSpanVal;

    beforeEach(() => {
      cjsTable = new createjs.Shape(); // dummy object
      cjsTableBody = new createjs.Shape(); // dummy object
      cjsRow = new createjs.Shape(); // dummy object
      cjsCell = new createjs.Shape(); // dummy object
      colIndexVal = 10;
      colSpanVal = 20;
      rowIndexVal = 30;
      rowSpanVal = 40;

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
          colIndex: colIndexVal,
          colSpan: colSpanVal,
          rowIndex: rowIndexVal,
          rowSpan: rowSpanVal,
        },
        displayObject: cjsCell,
        parent: cjsRow,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
      tdEl = parentEl.querySelector('td');
    });

    describe('rendering', () => {
      it('creates form element', () => {
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-colindex" attribute', () => {
        expect(parseInt(tdEl.getAttribute('aria-colindex'), 10)).toEqual(
          colIndexVal
        );
      });

      it('sets "aria-rowindex" attribute', () => {
        expect(parseInt(tdEl.getAttribute('aria-rowindex'), 10)).toEqual(
          rowIndexVal
        );
      });

      it('sets "colspan" attribute', () => {
        expect(tdEl.colSpan).toEqual(colSpanVal);
      });

      it('sets "rowspan" attribute', () => {
        expect(tdEl.rowSpan).toEqual(rowSpanVal);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "colIndex" property [for "aria-colindex"]', () => {
        expect(cjsCell.accessible.colIndex).toEqual(colIndexVal);

        const newVal = 111;
        cjsCell.accessible.colIndex = newVal;
        expect(cjsCell.accessible.colIndex).toEqual(newVal);
      });

      it('can read and set "rowIndex" property [for "aria-rowindex"]', () => {
        expect(cjsCell.accessible.rowIndex).toEqual(rowIndexVal);

        const newVal = 222;
        cjsCell.accessible.rowIndex = newVal;
        expect(cjsCell.accessible.rowIndex).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "colSpan" property', () => {
        expect(cjsCell.accessible.colSpan).toEqual(colSpanVal);

        const newVal = 333;
        cjsCell.accessible.colSpan = newVal;
        expect(cjsCell.accessible.colSpan).toEqual(newVal);
      });

      it('can read and set "rowspan" property', () => {
        expect(cjsCell.accessible.rowSpan).toEqual(rowSpanVal);

        const newVal = 444;
        cjsCell.accessible.rowSpan = newVal;
        expect(cjsCell.accessible.rowSpan).toEqual(newVal);
      });
    });
  });
});
