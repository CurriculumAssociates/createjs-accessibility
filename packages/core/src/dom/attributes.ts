import { EventListener } from "./events";

// Use built-in type for CSSStyles but exclude the iterator and other uneeded CSSStyleDeclaration implementation details;
export type CSSStyles = Partial<CSSStyleDeclaration> &
  Record<string, string | number | boolean | null>;

export type AriaAttributes = Omit<ARIAMixin, 'role'> & {
  ariaControls?: string | null;
  ariaOwns?: string | null;
  ariaColCount?: string | null;
};

export type GlobalAttributes = {
  autocapitalize?: string;
  dir?: string;
  draggable?: boolean;
  hidden?: boolean;
  id?: string;
  lang?: string;
  role: string;
  spellcheck?: boolean;
  tabIndex?: number;
  title?: string;
  translate?: boolean;
};

export interface InputAttributes {
  disabled?: boolean;
  value?: string | number;
  type?: string;
}

export interface TextAttributes {
  text?: string;
}

export type AttributeName =
  | keyof AriaAttributes
  | keyof GlobalAttributes
  | keyof InputAttributes
  | keyof TextAttributes;

export type AttributeValue = string | boolean | number | EventListener;

export type Attributes = Partial<
  AriaAttributes & GlobalAttributes & InputAttributes & TextAttributes
>;