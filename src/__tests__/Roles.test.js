import { doesRoleUseSemanticallyInteractiveTag } from '../utils/roleUtils';

describe('Roles', () => {
  describe('doesRoleUseSemanticallyInteractiveTag', () => {
    it('returns true for interactive tags', () => {
      expect(doesRoleUseSemanticallyInteractiveTag('link')).toEqual(true);
      expect(
        doesRoleUseSemanticallyInteractiveTag('multiselectlistbox')
      ).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('checkbox')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('radio')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('searchbox')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('slider')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('spinbutton')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('multilinetextbox')).toEqual(
        true
      );
      expect(doesRoleUseSemanticallyInteractiveTag('button')).toEqual(true);
      expect(doesRoleUseSemanticallyInteractiveTag('switch')).toEqual(true);
    });

    it('returns false for non-interactive tags', () => {
      expect(doesRoleUseSemanticallyInteractiveTag('article')).toEqual(false);
      expect(doesRoleUseSemanticallyInteractiveTag('img')).toEqual(false);
      expect(doesRoleUseSemanticallyInteractiveTag('span')).toEqual(false);
      expect(doesRoleUseSemanticallyInteractiveTag('table')).toEqual(false);
    });
  });
});
