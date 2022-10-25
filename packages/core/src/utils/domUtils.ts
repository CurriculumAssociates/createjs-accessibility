
/**
 * Normalizes using a passed element or retrieving it from the DOM
 * @param element
 * @returns 
 */
export function getElement(element: HTMLElement | string): HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return document.getElementById(element) || document.querySelector(element);
  } else {
    return element;
  }
}
