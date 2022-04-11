import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('ArticleData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsArticle;
    let articleEl;
    let positionVal;
    let sizeVal;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsArticle = new createjs.Shape(); // dummy object
      positionVal = 7;
      sizeVal = 99;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

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
    });

    describe('rendering', () => {
      it('creates article element', () => {
        articleEl = parentEl.querySelector('article');
        expect(articleEl).not.toBeNull();
      });

      it('sets "aria-position" attribute', () => {
        articleEl = parentEl.querySelector(`article`);
        expect(articleEl.ariaPosInSet).toEqual(positionVal);
      });

      it('sets "aria-setsize" attribute', () => {
        articleEl = parentEl.querySelector(`article[aria-setsize='${sizeVal}']`);
        expect(articleEl).not.toBeNull();
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
