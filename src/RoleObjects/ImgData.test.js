import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ImgData', () => {
  describe('register role', () => {
    let cjsImg;
    let imgEl;
    let altVal;
    let crossOriginVal;
    let heightVal;
    let isIsMap;
    let longDescVal;
    let sizesVal;
    let srcVal;
    let srcSetVal;
    let useMapVal;
    let widthVal;

    beforeEach(() => {
      cjsImg = new createjs.Shape(); // dummy object
      altVal = 'an image';
      crossOriginVal = 'anonymous';
      heightVal = 99;
      isIsMap = true;
      longDescVal = 'url.html';
      sizesVal = '(max-height = 500px) 1000px';
      srcVal = 'img.jpg';
      srcSetVal = 'img480.jpg 480w; img800.jpg 800w';
      useMapVal = '#map';
      widthVal = 999;

      AccessibilityModule.register({
        accessibleOptions: {
          alt: altVal,
          crossOrigin: crossOriginVal,
          height: heightVal,
          isMap: isIsMap,
          longDesc: longDescVal,
          sizes: sizesVal,
          src: srcVal,
          srcSet: srcSetVal,
          useMap: useMapVal,
          width: widthVal,
        },
        displayObject: cjsImg,
        parent: container,
        role: AccessibilityModule.ROLES.IMG,
      });

      stage.accessibilityTranslator.update();
      imgEl = parentEl.querySelector('img');
    });

    describe('rendering', () => {
      it('creates img element', () => {
        expect(imgEl).not.toBeNull();
      });

      it('sets "alt" attribute', () => {
        expect(imgEl.alt).toEqual(altVal);
      });

      it('sets "crossOrigin" attribute', () => {
        expect(imgEl.crossOrigin).toEqual(crossOriginVal);
      });

      it('sets "height" attribute', () => {
        expect(imgEl.height).toEqual(heightVal);
      });

      it('sets "isMap" attribute', () => {
        expect(imgEl.isMap).toEqual(isIsMap);
      });

      it('sets "longDesc" attribute', () => {
        expect(imgEl.getAttribute('longDesc')).toEqual(longDescVal);
      });

      it('sets "sizes" attribute', () => {
        expect(imgEl.sizes).toEqual(sizesVal);
      });

      it('sets "src" attribute', () => {
        expect(imgEl.getAttribute('src')).toEqual(srcVal);
      });

      it('sets "srcSet" attribute', () => {
        expect(imgEl.srcset).toEqual(srcSetVal);
      });

      it('sets "useMap" attribute', () => {
        expect(imgEl.useMap).toEqual(useMapVal);
      });

      it('sets "width" attribute', () => {
        expect(imgEl.width).toEqual(widthVal);
      });
    });

    describe('children checking', () => {
      const cjsChild = new createjs.Shape(); // dummy object
      AccessibilityModule.register({
        displayObject: cjsChild,
        role: AccessibilityModule.ROLES.CELL,
      });

      it('throws error attempting addChild()', () => {
        expect(() => {
          cjsImg.accessible.addChild(cjsChild);
        }).toThrowError(/img cannot have children/);
      });

      it('throws error attempting addChildAt()', () => {
        expect(() => {
          cjsImg.accessible.addChildAt(cjsChild);
        }).toThrowError(/img cannot have children/);
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "alt" property', () => {
        expect(cjsImg.accessible.alt).toEqual(altVal);

        const newVal = 'a new image';
        cjsImg.accessible.alt = newVal;
        expect(cjsImg.accessible.alt).toEqual(newVal);
      });

      it('can read and set "crossOrigin" property', () => {
        expect(cjsImg.accessible.crossOrigin).toEqual(crossOriginVal);

        const newVal = 'use-credentials';
        cjsImg.accessible.crossOrigin = newVal;
        expect(cjsImg.accessible.crossOrigin).toEqual(newVal);
      });

      it('can read and set "height" property', () => {
        expect(cjsImg.accessible.height).toEqual(heightVal);

        const newVal = 100;
        cjsImg.accessible.height = newVal;
        expect(cjsImg.accessible.height).toEqual(newVal);
      });

      it('can read and set "isMap" property', () => {
        expect(cjsImg.accessible.isMap).toEqual(isIsMap);

        const newVal = false;
        cjsImg.accessible.isMap = newVal;
        expect(cjsImg.accessible.isMap).toEqual(newVal);
      });

      it('can read and set "longDesc" property', () => {
        expect(cjsImg.accessible.longDesc).toEqual(longDescVal);

        const newVal = 'new_url.html';
        cjsImg.accessible.longDesc = newVal;
        expect(cjsImg.accessible.longDesc).toEqual(newVal);
      });

      it('can read and set "sizes" property', () => {
        expect(cjsImg.accessible.sizes).toEqual(sizesVal);

        const newVal = '(max-height = 999px) 9999px';
        cjsImg.accessible.sizes = newVal;
        expect(cjsImg.accessible.sizes).toEqual(newVal);
      });

      it('can read and set "src" property', () => {
        expect(cjsImg.accessible.src).toEqual(srcVal);

        const newVal = 'img_new.jpg';
        cjsImg.accessible.src = newVal;
        expect(cjsImg.accessible.src).toEqual(newVal);
      });

      it('can read and set "srcSet" property', () => {
        expect(cjsImg.accessible.srcSet).toEqual(srcSetVal);

        const newVal = 'img960.jpg 960w; img1920.jpg 1920w';
        cjsImg.accessible.srcSet = newVal;
        expect(cjsImg.accessible.srcSet).toEqual(newVal);
      });

      it('can read and set "useMap" property', () => {
        expect(cjsImg.accessible.useMap).toEqual(useMapVal);

        const newVal = '#newmap';
        cjsImg.accessible.useMap = newVal;
        expect(cjsImg.accessible.useMap).toEqual(newVal);
      });

      it('can read and set "width" property', () => {
        expect(cjsImg.accessible.width).toEqual(widthVal);

        const newVal = 1000;
        cjsImg.accessible.width = newVal;
        expect(cjsImg.accessible.width).toEqual(newVal);
      });
    });
  });
});
