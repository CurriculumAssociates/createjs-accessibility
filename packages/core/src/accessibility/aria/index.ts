import { Role, RoleTagMapping } from "./roles";

// TODO Replace the below with explicit interface for AriaAttributes with specific allowed values
export type AriaAttributes = Omit<Partial<ARIAMixin>, "role">;

export { Role, RoleTagMapping };