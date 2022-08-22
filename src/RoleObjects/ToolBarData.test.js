import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ToolBarData', () => {
  describe('register role', () => {
    let cjsToolBar;
    let divEl;
    let orientationVal;

    beforeEach(() => {
      cjsToolBar = new createjs.Shape(); // dummy object
      orientationVal = 'horizontal';

      AccessibilityModule.register({
        accessibleOptions: {
          orientation: orientationVal,
        },
        displayObject: cjsToolBar,
        parent: container,
        role: AccessibilityModule.ROLES.TOOLBAR,
      });

      stage.accessibilityTranslator.update();
      divEl = parentEl.querySelector('div[role=toolbar]');
    });

    describe('rendering', () => {
      it('creates div[role=toolbar] element', () => {
        expect(divEl).not.toBeNull();
      });

      it('sets "aria-orientation" attribute', () => {
        expect(divEl.getAttribute('aria-orientation')).toEqual(orientationVal);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsToolBar.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsToolBar.accessible.orientation = newVal;
        expect(cjsToolBar.accessible.orientation).toEqual(newVal);
      });
    });
  });
});
