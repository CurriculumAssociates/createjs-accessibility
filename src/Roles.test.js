import { doesRoleUseSemanticallyInteractiveTag } from './Roles';

describe('doesRoleUseSemanticallyInteractiveTag', () => {
  it('returns true', () => {
    expect(doesRoleUseSemanticallyInteractiveTag('article')).toEqual(false);
  });
});
