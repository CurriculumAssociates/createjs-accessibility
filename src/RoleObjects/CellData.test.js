import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('CellData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsCell;
    let tdEl;
    let colIndexVal;
    let colSpanVal;
    let rowIndexVal;
    let rowSpanVal;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsCell = new createjs.Shape(); // dummy object
      colIndexVal = 10;
      colSpanVal = 20;
      rowIndexVal = 30;
      rowSpanVal = 40;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          colIndex: colIndexVal,
          colSpan: colSpanVal,
          rowIndex: rowIndexVal,
          rowSpan: rowSpanVal,
        },
        displayObject: cjsCell,
        parent: container,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates form element', () => {
        tdEl = parentEl.querySelector('td');
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-colindex" attribute', () => {
        tdEl = parentEl.querySelector(`td[aria-colindex='${colIndexVal}']`);
        expect(tdEl).not.toBeNull();
      });

      it('sets "aria-rowindex" attribute', () => {
        tdEl = parentEl.querySelector(`td[aria-rowindex='${rowIndexVal}']`);
        expect(tdEl).not.toBeNull();
      });

      it('sets "colspan" attribute', () => {
        tdEl = parentEl.querySelector(`td[colspan='${colSpanVal}']`);
        expect(tdEl).not.toBeNull();
      });

      it('sets "rowspan" attribute', () => {
        tdEl = parentEl.querySelector(`td[rowspan='${rowSpanVal}']`);
        expect(tdEl).not.toBeNull();
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
