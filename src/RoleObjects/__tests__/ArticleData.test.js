import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('ArticleData', () => {
  describe('register role', () => {
    let cjsArticle;
    let articleEl;
    let positionVal;
    let sizeVal;

    beforeEach(() => {
      cjsArticle = new createjs.Shape(); // dummy object
      positionVal = 7;
      sizeVal = 99;

      AccessibilityModule.register({
        accessibleOptions: {
          position: positionVal,
          size: sizeVal,
        },
        displayObject: cjsArticle,
        parent: container,
        role: AccessibilityModule.ROLES.ARTICLE,
      });

      stage.accessibilityTranslator.update();
      articleEl = parentEl.querySelector('article');
    });

    describe('rendering', () => {
      it('creates article element', () => {
        expect(articleEl).not.toBeNull();
      });

      it('sets "aria-posinset" attribute', () => {
        expect(parseInt(articleEl.getAttribute('aria-posinset'), 10)).toEqual(
          positionVal
        );
      });

      it('sets "aria-setsize" attribute', () => {
        expect(parseInt(articleEl.getAttribute('aria-setsize'), 10)).toEqual(
          sizeVal
        );
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "size" property [for "aria-setsize"]', () => {
        expect(cjsArticle.accessible.size).toEqual(sizeVal);

        const newVal = -1;
        cjsArticle.accessible.size = newVal;
        expect(cjsArticle.accessible.size).toEqual(newVal);
      });

      it('can read and set "position" property [for "aria-posinset"]', () => {
        expect(cjsArticle.accessible.position).toEqual(positionVal);

        const newVal = -1;
        cjsArticle.accessible.position = newVal;
        expect(cjsArticle.accessible.position).toEqual(newVal);
      });
    });
  });
});
