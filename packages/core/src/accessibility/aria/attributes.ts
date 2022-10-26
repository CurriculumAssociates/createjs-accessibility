
// TODO Replace the below with explicit interface for AriaAttributes with specific allowed values
export type Attributes = Omit<Partial<ARIAMixin>, "role">;
