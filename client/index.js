(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rax = {}));
})(this, (function (exports) { 'use strict';

    var domOperations = {
      createElment: function createElment(tagName) {
        return document.createElement(tagName);
      },
      setTextContent: function setTextContent(element, text) {
        element.textContent = text;
      },
      insert: function insert(element, container) {
        container.appendChild(element);
      },
      remove: function remove(element, container) {
        container.removeChild(element);
      }
    };
    var pathProps = function pathProps(element, oldProps, newProps) {
      if (!newProps) {
        return;
      }
      for (var _i = 0, _a = Object.keys(newProps); _i < _a.length; _i++) {
        var key = _a[_i];
        element[key] = newProps[key];
      }
    };
    var mountElement = function mountElement(fiber, container) {
      var element = fiber.element = domOperations.createElment(fiber.type);
      if (typeof fiber.children === 'string') {
        domOperations.setTextContent(element, fiber.children);
      } else {
        for (var _i = 0, _a = fiber.children; _i < _a.length; _i++) {
          var child = _a[_i];
          patch(null, child, element);
        }
      }
      pathProps(element, null, fiber.props);
      domOperations.insert(element, container);
    };
    var reconcileChildren = function reconcileChildren(oldFiber, newFiber) {
      if (oldFiber.children) {
        if (typeof oldFiber.children === 'string') {
          domOperations.setTextContent(oldFiber.element, '');
        } else {
          for (var _i = 0, _a = oldFiber.children; _i < _a.length; _i++) {
            var child = _a[_i];
            unmount(child);
          }
        }
      }
      if (newFiber.children) {
        if (typeof newFiber.children === 'string') {
          domOperations.setTextContent(newFiber.element, newFiber.children);
        } else {
          for (var _b = 0, _c = newFiber.children; _b < _c.length; _b++) {
            var child = _c[_b];
            patch(null, child, newFiber.element);
          }
        }
      }
    };
    var pacthElement = function pacthElement(oldFiber, newFiber, container) {
      var element = newFiber.element = oldFiber.element;
      pathProps(element, oldFiber.props, newFiber.props);
      reconcileChildren(oldFiber, newFiber);
    };
    var unmount = function unmount(fiber) {
      domOperations.remove(fiber.element, fiber.element.parentNode);
    };
    var patch = function patch(oldFiber, newFiber, container) {
      if (oldFiber && oldFiber.type !== newFiber.type) {
        unmount(oldFiber);
        oldFiber = null;
      }
      if (!oldFiber) {
        mountElement(newFiber, container);
      } else {
        pacthElement(oldFiber, newFiber);
      }
    };
    function render(fiber, container) {
      var oldFiber = container._fiber;
      if (fiber) {
        patch(oldFiber, fiber, container);
      } else {
        if (oldFiber) {
          unmount(oldFiber);
        }
      }
      container._fiber = fiber;
    }
    // TODO: props 处理
    // TODO: 事件冒泡 & 事件处理

    var root = document.getElementById("root");
    var fiberTree = {
      type: "div",
      props: {
        id: "box"
      },
      children: [{
        type: "span",
        props: {
          id: "box_span"
        },
        children: "hi there"
      }, {
        type: "ul",
        props: {
          id: "box_ul"
        },
        children: [{
          type: "li",
          props: {
            id: "box_ul_li_1"
          },
          children: "i am one list"
        }, {
          type: "li",
          props: {
            id: "box_ul_li_2"
          },
          children: "i am two lists"
        }]
      }, {
        type: "h1",
        props: {
          id: "box_h1"
        },
        children: "a header"
      }]
    };
    var fiberTree2 = {
      type: "div",
      props: {
        id: "box"
      },
      children: [{
        type: "ul",
        props: {
          id: "box_ul"
        },
        children: [{
          type: "li",
          props: {
            id: "box_ul_li_2"
          },
          children: "i am two lists"
        }]
      }, {
        type: "h1",
        props: {
          id: "box_h1"
        },
        children: "a header"
      }, {
        type: "h2",
        children: "a second header"
      }]
    };
    render(fiberTree, root);
    // setTimeout(() => {
    //     render(null, root);
    // }, 3000);
    setTimeout(function () {
      render(fiberTree2, root);
    }, 1000);

    exports.render = render;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
