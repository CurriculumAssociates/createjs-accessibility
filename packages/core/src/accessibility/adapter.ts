import { getElement } from "../utils/domUtils";
import { AriaAttributes, Role } from "./aria";
import { Node } from "./node";
import { View } from "./view";

export type ViewSetupOptions<ViewType> = {
  done?: Function;
  root: HTMLElement | string;
  view: ViewType;
};

export type ViewReleaseOptions<ViewType> = {
  done?: Function;
  view: ViewType;
};

export type ViewUpdateOptions<ViewType> = {
  done?: Function;
  view: ViewType;
};

export type NodeRegisterOptions<NodeType> = {
  aria?: AriaAttributes;
  node: NodeType;
  parentNode?: NodeType;
  role: Role;
};

export type BoundingRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type NodeBoundOptions = {};

export type ViewBoundOptions = {
  /**
   * Allows for additional styles to be applied to the root HTMLElement that's
   * registered with the View determining the View's bounds (e.g., transforms)
   */
  additionalStyles?: Partial<CSSStyleDeclaration>;
};

export abstract class Adapter<NodeType, ViewType> {
  #registeredRoots: Map<View<ViewType>, Node<NodeType>> = new Map();

  abstract getBoundingRect<NodeType, ViewType>(
    node: Node<NodeType>,
    view: ViewType,
    opts: NodeBoundOptions
  ): BoundingRect;

  abstract getViewBoundingRect<ViewType>(
    view: ViewType,
    opts: ViewBoundOptions
  ): BoundingRect;

  setupView<ViewType, T extends NodeType>(
    opts: ViewSetupOptions<ViewType>
  ): Node<T> {
    const { done, root, view } = opts;

    const rootNode = new Node<T>({
      element: getElement(root),
    });

    this.#registeredRoots.set(view, rootNode);
    done(rootNode);

    return rootNode;
  }

  releaseView<T extends ViewType>(opts: ViewReleaseOptions<T>) {
    const { done, view } = opts;
    this.#registeredRoots.delete(view);
    done();
  }

  registerNode<NodeType>() {}

  updateAccessibilityNodes<ViewType, NodeType>(
    opts: ViewUpdateOptions<ViewType>
  ) {
    // ...
  }
}
