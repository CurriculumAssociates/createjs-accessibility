export type DOMEvent = MouseEvent | KeyboardEvent | Event;

export type EventListener = (event: DOMEvent) => DOMEvent | void;

export type EventOptions = boolean | EventListenerOptions;

export type EventListenerWithOptions = {
  listener: EventListener;
  options?: EventOptions;
};

export type EventListeners = {
  [eventType: string]: EventListenerWithOptions | EventListenerWithOptions[];
};
