import { EventListeners } from './events';

export type ElementProperties = {
  [key: string]: string | number | null | boolean | undefined;
};

export type CreateElementOptions = {
  tagName: string;
  attributes?: { [key: string]: string };
  properties?: ElementProperties;
  eventListeners?: EventListeners;
};

export function createElement(options: CreateElementOptions): HTMLElement {
  const {
    tagName,
    attributes = {},
    eventListeners = {},
    properties = {},
  } = options;

  const element = document.createElement(tagName);

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  updateElementProperties(element, properties);
  updateElementEventListeners(element, eventListeners);

  return element;
}

export function updateElementProperties(
  element: HTMLElement,
  properties: ElementProperties
) {
  for (const [name, value] of Object.entries(properties)) {
    if (element[name] && (value === undefined || value === null)) {
      delete this.element[name];
    } else {
      element[name] = value;
    }
  }
}

export function updateElementTree(
  element: HTMLElement,
  parent: HTMLElement,
  children: HTMLElement[]
) {
  for (const child of children) {
    element.contains(child) || element.appendChild(child);
  }
  parent?.appendChild(element);
}

export function updateElementEventListeners(
  element: HTMLElement,
  eventListeners: EventListeners
) {
  // for (const [eventType, { listener, options }] of Object.entries(
  //   eventListeners
  // )) {
  //   element.addEventListener(eventType, listener, options);
  // }
}

/**
 * Normalizes using a passed element or retrieving it from the DOM
 * @param element
 * @returns
 */
export function getElement(
  element: HTMLElement | string,
  document: Document = window.document
): HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return document.getElementById(element) || document.querySelector(element);
  } else {
    return element;
  }
}
