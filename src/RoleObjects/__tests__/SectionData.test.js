import AccessibilityModule from '../../index';

describe('SectionData', () => {
  describe('register role', () => {
    let cjsSection;
    let sectionEl;
    let isExpanded;

    beforeEach(() => {
      cjsSection = new createjs.Shape(); // dummy object
      isExpanded = false;

      AccessibilityModule.register({
        accessibleOptions: {
          expanded: isExpanded,
        },
        displayObject: cjsSection,
        parent: container,
        role: AccessibilityModule.ROLES.HEADING1,
      });

      stage.accessibilityTranslator.update();
      sectionEl = parentEl.querySelector('h1');
    });

    describe('rendering', () => {
      it('creates h1 element', () => {
        expect(sectionEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        const ariaExpanded = sectionEl.getAttribute('aria-expanded') === 'true';
        expect(ariaExpanded).toEqual(isExpanded);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "expanded" property [for "aria-expanded"]', () => {
        expect(cjsSection.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsSection.accessible.expanded = newVal;
        expect(cjsSection.accessible.expanded).toEqual(newVal);
      });
    });
  });
});
