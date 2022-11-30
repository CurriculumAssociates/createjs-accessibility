// import { Attribute, sharedAllowedAttributes, sharedRequiredAttributes } from './attributes';
// import { Role } from '../roles';
// import { AccessibilityAdapter } from '../adapter';

// export type EventHandler<E extends Event> = (event: E) => E | void;

// export interface AccessibleNodeDescriptor {
//   allowedChildren?: (keyof typeof Role)[];
//   allowedAttributes?: Attribute[];
//   events?: string[];
//   eventHandlers?: Record<string, EventHandler<Event>>;
//   requiredAttributes: Attribute[];
//   tag:
//     | string
//     | ((
//         attributes: { [key in Attribute]: string },
//         parentElement: HTMLElement
//       ) => string);
// }

// export abstract class BaseDescriptor
//   implements Partial<AccessibleNodeDescriptor>
// {
//   allowedAttributes = [...sharedAllowedAttributes];
//   requiredAttributes = [...sharedRequiredAttributes];
//   enableKeyEvents?: boolean;
// }