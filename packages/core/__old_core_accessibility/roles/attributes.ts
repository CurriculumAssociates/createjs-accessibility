
// export type AriaAttributes = Omit<Partial<ARIAMixin>, 'role'> & {
//   ariaControls: string | null;
//   ariaOwns: string | null;
//   ariaColCount: string | null;
// };

// export type GlobalAttributes = {
//   accesskey?: string;
//   autocapitalize?: string;
//   dir?: string;
//   id: string;
//   lang?: string;
//   role: string;
//   spellcheck?: boolean;
//   tabIndex?: number;
//   title?: string;
// }

// export interface InputAttributes {
//   value?: string | number;
//   type?: string;
// }

// export type Attributes =
//   | keyof AriaAttributes
//   | keyof GlobalAttributes
//   | keyof InputAttributes;

// export const sharedRequiredAttributes = ['id', 'role', 'ariaAtomic', 'ariaBusy', 'ariaOwn', 'ariaD'] as Attributes[];
// export const sharedAllowedAttributes = ['dir', 'lang', 'tabIndex', 'title'] as Attributes[];
