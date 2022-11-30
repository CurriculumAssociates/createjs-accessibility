// import {
//   Attribute,
//   sharedAllowedAttributes,
//   sharedRequiredAttributes,
// } from './attributes';
// import { AccessibleNodeDescriptor } from './descriptor';
// import { BaseInputDescriptor } from './input';

// export class SliderDescriptor
//   extends BaseInputDescriptor
//   implements AccessibleNodeDescriptor
// {
//   requiredAttributes = [...sharedRequiredAttributes];
//   allowedAttributes = [...sharedAllowedAttributes];
//   allowedChildren = [];
//   tag = 'input';
//   pageStep: number | undefined;
//   // need to replace with proper aria-valuemin, aria-valuemax, aria-valuenow
//   min: number;
//   max: number;
//   eventHandlers = {
//     onChange: (evt: Event) => {
//       // figure out the "this" problem below
//       // return super.eventHandlers.onChange(evt);
//       return evt;
//     },
//     onKeyDown: (evt: KeyboardEvent) => {
//       if (this.enableKeyEvents) {
//         super['eventHandlers']['onKeyDown'](evt);
//         if (evt.defaultPrevented) {
//           return;
//         }
//       }

//       if (
//         typeof this.pageStep !== 'undefined' &&
//         (evt.key === 'PageUp' || evt.key === 'PageDown')
//       ) {
//         const multiplier = evt.key === 'PageUp' ? 1 : -1;
//         const delta = multiplier * this.pageStep;
//         const value = parseFloat(this.value);
//         this.value = (value + delta).toString();

//         if (typeof this.min !== 'undefined') {
//           this.value = Math.max(value, this.min).toString();
//         }

//         if (typeof this.max !== 'undefined') {
//           this.value = Math.min(value, this.max).toString();
//         }

//         evt.stopPropagation();
//         evt.preventDefault();

//         return evt;
//       }
//     },
//   };
// }
