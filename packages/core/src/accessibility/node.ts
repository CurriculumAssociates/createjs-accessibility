import { AriaAttributes, Role, RoleTagMapping } from "./aria";

export type NodeOptions<NodeType> = {
  aria?: AriaAttributes;
  element?: HTMLElement;
  node?: NodeType;
  parent?: Node<NodeType>;
  role?: Role;
};

export class Node<NodeType> {
  #aria: AriaAttributes;
  #element: HTMLElement;
  #node: NodeType | undefined;
  #parent: Node<NodeType> | undefined;
  #role: Role;

  constructor(opts: NodeOptions<NodeType>) {
    const { aria = {}, element, node, parent, role = Role.NONE } = opts;

    this.#aria = aria;
    this.#element =
      element || document.createElement(RoleTagMapping[this.#role]);

    this.#node = node;

    if (parent) {
      this.#parent = parent;
      this.#parent.element.appendChild(this.#element);
    }

    this.#role = role;
  }

  get aria() {
    return this.#aria;
  }

  get element() {
    return this.#element;
  }

  get node() {
    return this.#node;
  }

  get parent() {
    return this.#parent;
  }

  get role() {
    return this.#role;
  }
}
