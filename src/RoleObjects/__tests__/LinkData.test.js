import AccessibilityModule from '../../index';

describe('LinkData', () => {
  describe('register role', () => {
    let cjsInput;
    let anchorEl;
    let downloadVal;
    let hrefVal;
    let hrefLangVal;
    let mediaVal;
    let relVal;
    let targetVal;
    let typeVal;

    beforeEach(() => {
      cjsInput = new createjs.Shape(); // dummy object
      downloadVal = 'filename';
      hrefVal = 'page.html';
      hrefLangVal = 'EN';
      mediaVal = 'print';
      relVal = 'alternate';
      targetVal = '_blank';
      typeVal = 'application/xhtml+xml';

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          download: downloadVal,
          href: hrefVal,
          hrefLang: hrefLangVal,
          media: mediaVal,
          rel: relVal,
          target: targetVal,
          type: typeVal,
        },
        displayObject: cjsInput,
        parent: container,
        role: AccessibilityModule.ROLES.LINK,
      });

      stage.accessibilityTranslator.update();
      anchorEl = parentEl.querySelector('a');
    });

    describe('rendering', () => {
      it('creates <a /> [anchor] element', () => {
        expect(anchorEl).not.toBeNull();
      });

      it('sets "download" attribute', () => {
        expect(anchorEl.download).toEqual(downloadVal);
      });

      it('sets "href" attribute', () => {
        expect(anchorEl.getAttribute('href')).toEqual(hrefVal);
      });

      it('sets "hreflang" attribute', () => {
        expect(anchorEl.hreflang).toEqual(hrefLangVal);
      });

      it('sets "media" attribute', () => {
        expect(anchorEl.getAttribute('media')).toEqual(mediaVal);
      });

      it('sets "rel" attribute', () => {
        expect(anchorEl.rel).toEqual(relVal);
      });

      it('sets "target" attribute', () => {
        expect(anchorEl.target).toEqual(targetVal);
      });

      it('sets "type" attribute', () => {
        expect(anchorEl.type).toEqual(typeVal);
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "download" property', () => {
        expect(cjsInput.accessible.download).toEqual(downloadVal);

        const newVal = 'file2';
        cjsInput.accessible.download = newVal;
        expect(cjsInput.accessible.download).toEqual(newVal);
      });

      it('can read and set "href" property', () => {
        expect(cjsInput.accessible.href).toEqual(hrefVal);

        const newVal = 'newpage.html';
        cjsInput.accessible.href = newVal;
        expect(cjsInput.accessible.href).toEqual(newVal);
      });

      it('can read and set "hrefLang" property', () => {
        expect(cjsInput.accessible.hrefLang).toEqual(hrefLangVal);

        const newVal = 'ES';
        cjsInput.accessible.hrefLang = newVal;
        expect(cjsInput.accessible.hrefLang).toEqual(newVal);
      });

      it('can read and set "media" property', () => {
        expect(cjsInput.accessible.media).toEqual(mediaVal);

        const newVal = 'screen';
        cjsInput.accessible.media = newVal;
        expect(cjsInput.accessible.media).toEqual(newVal);
      });

      it('can read and set "rel" property', () => {
        expect(cjsInput.accessible.rel).toEqual(relVal);

        const newVal = 'search';
        cjsInput.accessible.rel = newVal;
        expect(cjsInput.accessible.rel).toEqual(newVal);
      });

      it('can read and set "target" property', () => {
        expect(cjsInput.accessible.target).toEqual(targetVal);

        const newVal = '_new';
        cjsInput.accessible.target = newVal;
        expect(cjsInput.accessible.target).toEqual(newVal);
      });

      it('can read and set "type" property', () => {
        expect(cjsInput.accessible.type).toEqual(typeVal);

        const newVal = 'application/csvm+json';
        cjsInput.accessible.type = newVal;
        expect(cjsInput.accessible.type).toEqual(newVal);
      });
    });
  });
});
