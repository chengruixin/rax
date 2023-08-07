type SuperHTMLElement = HTMLElement & {
    _fiber?: Fiber;
}

export type Fiber = {
    type: string;
    children?: Fiber[] | string;
    props?: Record<string, any>;
    element?: SuperHTMLElement;
}

const domOperations = {
    createElment: (tagName: string) => {
        return document.createElement(tagName)
    },
    setTextContent: (element: SuperHTMLElement, text: string) => {
        element.textContent = text;
    },
    insert: (element: SuperHTMLElement, container: SuperHTMLElement) => {
        container.appendChild(element);
    },
    remove: (element: SuperHTMLElement, container: SuperHTMLElement) => {
        container.removeChild(element);
    }
}

const pathProps = (element: SuperHTMLElement, oldProps: Record<string, any>, newProps: Record<string, any>) => {
    if (!newProps) {
        return 
    }

    for (const key of Object.keys(newProps)) {
        element[key] = newProps[key];
    }
}

const mountElement = (fiber: Fiber, container: SuperHTMLElement) => {
    const element = fiber.element = domOperations.createElment(fiber.type);

    if (typeof fiber.children === 'string') {
        domOperations.setTextContent(element, fiber.children);
    } else {
        for (const child of fiber.children) {
            patch(null, child, element);
        }
    }

    pathProps(element, null, fiber.props);

    domOperations.insert(element, container);
}

const reconcileChildren = (oldFiber: Fiber, newFiber: Fiber) => {
    if (oldFiber.children) {
        if (typeof oldFiber.children === 'string') {
            domOperations.setTextContent(oldFiber.element, '')
        } else {
            for (const child of oldFiber.children) {
                unmount(child)
            }
        }

    }

    if (newFiber.children) {
        if (typeof newFiber.children === 'string') {
            domOperations.setTextContent(newFiber.element, newFiber.children)
        } else {
            for (const child of newFiber.children) {
                patch(null, child, newFiber.element)
            }
        }
    }

}

const pacthElement = (oldFiber: Fiber, newFiber: Fiber, container: SuperHTMLElement) => {
    const element = newFiber.element = oldFiber.element
    pathProps(element, oldFiber.props, newFiber.props)
    reconcileChildren(oldFiber, newFiber)
}

const unmount = (fiber: Fiber) => {
    domOperations.remove(fiber.element, fiber.element.parentNode as SuperHTMLElement);
}

const patch = (oldFiber: Fiber, newFiber: Fiber, container: SuperHTMLElement) => {
    if (oldFiber && oldFiber.type !== newFiber.type) {
        unmount(oldFiber)
        oldFiber = null
    }
    if (!oldFiber) {
        mountElement(newFiber, container);
    } else {
        pacthElement(oldFiber, newFiber, container)
    }
}

export function render(fiber: Fiber, container: SuperHTMLElement) {
    const oldFiber = container._fiber;

    if (fiber) {
        patch(oldFiber, fiber, container);
    } else {
        if (oldFiber) {
            unmount(oldFiber);
        }
    }

    container._fiber = fiber
}

// TODO: props 处理
// TODO: 事件冒泡 & 事件处理