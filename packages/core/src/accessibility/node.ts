import {
  Attributes,
  EventListener,
  EventListeners,
  EventListenerWithOptions,
  getElement,
  updateElementEventListeners,
  updateElementProperties,
  updateElementTree,
} from '../dom';

import { createElementFromRole, Role } from './roles';
import { AriaRole } from './roles/mapping';

export type ViewportPixelBounds = {
  height: number;
  width: number;
  top: number;
  left: number;
};

export type AccessibleTreeNodeDOMView = {
  styles: Partial<CSSStyleDeclaration>;
  bounds: ViewportPixelBounds;
};

export type InferableAccessibleTreeNodeState = {
  hidden?: boolean;
  disabled?: boolean;
};

export const Infer = {
  All: ['disabled', 'visible'],
  Disabled: ['disabled'],
  Visible: ['visible'],
} as const;

export interface AccessibleTreeNodeOptions<ViewObjectType> {
  attributes?: Attributes;
  element?: HTMLElement | string;
  eventListeners?: EventListeners;
  infer?: keyof typeof Infer[];
  parent?: AccessibleTreeNode<ViewObjectType>;
  role: AriaRole;
  viewObject?: ViewObjectType;
}

export class AccessibleTreeNode<ViewObjectType = any> {
  #attributes: Attributes;
  #bounds?: ViewportPixelBounds;
  #children: AccessibleTreeNode<ViewObjectType>[] = [];
  #element: HTMLElement;
  #eventListeners: {
    [eventType: string]: Array<
      EventListenerWithOptions & { add?: boolean; remove?: boolean }
    >;
  } = {};

  #inferred: Array<keyof typeof Infer>;
  #markedForUpdate: boolean = false;
  #parent?: AccessibleTreeNode<ViewObjectType>;
  #role: AriaRole;
  #viewObject?: ViewObjectType;

  constructor(options: AccessibleTreeNodeOptions<ViewObjectType>) {
    const {
      attributes = {},
      element,
      eventListeners = {},
      parent,
      role,
      viewObject,
    } = options;

    this.#role = role;
    this.#viewObject = viewObject;

    this.#attributes = attributes;

    if (element) {
      this.#element = getElement(element);
    } else {
      if (!this.#attributes.id) {
        this.#attributes.id = `acc_${Math.floor(Math.random() * 100000)}`;
      }

      this.#element = createElementFromRole({
        nodeRole: this.#role,
        nodeAttributes: this.#attributes,
        nodeEventListeners: this.#eventListeners,
      });
    }

    Object.entries(eventListeners).forEach(([eventType, listeners]) => {
      for (const { listener, options } of Array.isArray(listeners)
        ? listeners
        : [listeners]) {
        this.addEventListener(eventType, listener, options);
      }
    });

    if (parent) {
      this.#parent = parent;
    }
  }

  get element(): HTMLElement {
    return this.#element;
  }

  get attributes(): Attributes {
    return this.#attributes;
  }

  get bounds(): Readonly<ViewportPixelBounds> {
    return this.#bounds;
  }

  set bounds(bounds: ViewportPixelBounds) {
    this.#bounds = bounds;
  }

  get children(): Readonly<AccessibleTreeNode<ViewObjectType>[]> {
    return this.#children;
  }

  get id(): string {
    return this.#element.id;
  }

  get inferred(): Array<keyof typeof Infer> {
    return [...this.#inferred];
  }

  set inferred(infer: keyof typeof Infer | Array<keyof typeof Infer>) {
    this.#inferred = [...(Array.isArray(infer) ? infer : [infer])];
  }

  get markedForUpdate() {
    return this.#markedForUpdate;
  }

  protected set parent(node: AccessibleTreeNode<ViewObjectType>) {
    this.#parent = node;
  }

  get parent(): AccessibleTreeNode<ViewObjectType> {
    return this.#parent;
  }

  get role(): AriaRole {
    return this.#role;
  }

  get viewObject(): ViewObjectType {
    return this.#viewObject;
  }

  addChild(node: AccessibleTreeNode<ViewObjectType>) {
    this.#children.push(node);
  }

  addEventListener(
    type,
    listener: EventListener,
    options?: boolean | EventListenerOptions
  ) {
    this.#eventListeners[type].push({ listener, options, add: true });
  }

  removeEventListener(
    type,
    listener: EventListener,
    options?: boolean | EventListenerOptions
  ) {
    this.#eventListeners[type].push({ listener, options, remove: true });
  }

  setInferredAccessibleState(
    inferredAccessibleState: InferableAccessibleTreeNodeState
  ) {
    const {
      ariaDisabled: prevAriaDisabled,
      disabled: prevDisabled,
      ariaHidden: prevAriaHidden,
      hidden: prevHidden,
    } = this.#attributes;

    const { disabled, hidden } = inferredAccessibleState;

    if (
      (disabled !== undefined && prevAriaDisabled !== String(disabled)) ||
      prevDisabled !== disabled
    ) {
      Object.assign(this.attributes, {
        ariaDisabled: disabled.toString(),
        disabled,
      });
    }

    if (prevAriaHidden !== String(hidden) || prevHidden !== hidden) {
      Object.assign(this.attributes, {
        ariaHidden: disabled.toString(),
        hidden,
      });
    }
  }

  requestFocus() {
    this.#element?.focus();
  }

  markForUpdate() {
    this.#markedForUpdate = true;
    if (this.#parent) {
      this.#parent.markForUpdate();
    }
  }

  syncrhonizeElementWithAccessibleTreeNode(domView: AccessibleTreeNodeDOMView) {
    Object.assign(this.#element.style, domView.styles);

    if (this.#markedForUpdate) {
      updateElementTree(
        this.#element,
        this.#parent.element,
        this.#children.map((child) => child.element)
      );
      updateElementProperties(this.#element, this.#attributes);
      // updateElementEventListeners(this.#element, this.#eventListeners);

      this.#markedForUpdate = false;
    }
  }
}

export function wrapForUpdates(node: AccessibleTreeNode) {
  return new Proxy(node, {
    get(target, prop, receiver) {
      switch (prop) {
        case 'attributes':
          console.log(
            `Marking for update ${target}.${prop} accessed by ${receiver}`
          );
          node.markForUpdate();

        default:
          break;
      }

      // Workaround to access private fields from a Proxy by supplying the reciever as the o
      const value = target[prop];
      if (value instanceof Function) {
        return function (...args) {
          return value.apply(this === receiver ? target : this, args);
        };
      }

      return value;
    },
    set(target, prop, newValue, receiver) {
      switch (prop) {
        case 'attributes':
        case 'children':
        case 'parent':
          console.log(
            `Marking for update ${target}.${prop} set to ${newValue} by ${receiver}`
          );
          node.markForUpdate();

        default:
          break;
      }

      // Workaround to access private fields from a Proxy by supplying the reciever as the o
      const original = target[prop];
      if (original instanceof Function) {
        original.apply(this === receiver ? target : this, newValue);
      } else {
        target[prop] = newValue;
        return true;
      }
    },
  });
}
