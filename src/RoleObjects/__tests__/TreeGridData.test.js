import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';

const { container, parentEl, stage } = global;

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

    describe('private methods not called locally', () => {
      let cjsTableBody;
      let cjsRow;

      beforeEach(() => {
        cjsTableBody = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: cjsTableBody,
          parent: cjsTreeGrid,
          role: AccessibilityModule.ROLES.TABLEBODY,
        });

        [1, 2].forEach((level) => {
          cjsRow = new createjs.Shape(); // dummy object
          AccessibilityModule.register({
            accessibleOptions: {
              level,
              tabIndex: level,
            },
            displayObject: cjsRow,
            parent: cjsTableBody,
            role: AccessibilityModule.ROLES.ROW,
          });
        });
        stage.accessibilityTranslator.update();
      });

      it('should return true for _updateTargetDataLeft with role ROW unless expanded', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataLeft({
            displayObject: cjsRow,
          })
        ).toEqual(true);

        cjsRow.accessible.expanded = true;
        expect(
          cjsTreeGrid.accessible._updateTargetDataLeft({
            displayObject: cjsRow,
          })
        ).toEqual(false);
      });

      it('should return false for _updateTargetDataLeft with role TABLEBODY', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataLeft({
            colIndex: 0,
            displayObject: cjsTableBody,
          })
        ).toEqual(false);
      });

      it('should return true for _updateTargetDataRight with role ROW when expanded', () => {
        cjsRow.accessible.expanded = true;
        expect(
          cjsTreeGrid.accessible._updateTargetDataRight({
            displayObject: cjsRow,
          })
        ).toEqual(true);

        cjsRow.accessible.expanded = false;
        expect(
          cjsTreeGrid.accessible._updateTargetDataRight({
            displayObject: cjsRow,
          })
        ).toEqual(false);
      });

      it('should return true for _updateTargetDataRight with role TABLEBODY', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataRight({
            displayObject: cjsTableBody,
          })
        ).toEqual(true);
      });

      it('should return true for _updateTargetDataUp with role ROW with tabIndex', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataUp({
            displayObject: cjsRow,
            sectionIndex: 0,
          })
        ).toEqual(true);
      });

      it('should return false for _updateTargetDataUp when target ROW and siblings are hidden', () => {
        const rows = cjsTreeGrid.accessible.children[0].accessible.children;
        rows[0].accessible.visible = false;
        rows[1].accessible.visible = false;
        expect(
          cjsTreeGrid.accessible._updateTargetDataUp({
            displayObject: cjsRow,
            sectionIndex: 0,
          })
        ).toEqual(false);
      });

      it('should return true for _updateTargetDataUp with role TABLEBODY', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataUp({
            displayObject: cjsTableBody,
          })
        ).toEqual(true);
      });

      it('should return false for _updateTargetDataDown when target ROW and siblings are hidden', () => {
        const rows = cjsTreeGrid.accessible.children[0].accessible.children;
        rows[0].accessible.visible = false;
        rows[1].accessible.visible = false;
        expect(
          cjsTreeGrid.accessible._updateTargetDataDown({
            displayObject: cjsRow,
            sectionIndex: 0,
          })
        ).toEqual(false);
      });

      it('should return true for _updateTargetDataDown with role TABLEBODY', () => {
        expect(
          cjsTreeGrid.accessible._updateTargetDataDown({
            displayObject: cjsTableBody,
            sectionIndex: 0,
          })
        ).toEqual(true);
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
