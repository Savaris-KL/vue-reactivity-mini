import { mutableHandlers } from "./baseHandlers";

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

function createReactiveObject(target, isReadonly, baseHandlers) {
  const reactiveFlag = "__v_reactive";

  if (target.reactiveFlag === reactiveFlag) {
    return target;
  }

  const observed = new Proxy(target, baseHandlers);
  def(target, reactiveFlag, observed);
  return observed;
}

const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value,
  });
};
