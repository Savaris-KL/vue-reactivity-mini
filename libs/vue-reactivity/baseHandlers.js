import { reactive } from "./reactive";
import { trigger, track } from "./effect";

const get = /*#__PURE__*/ createGetter();
const set = /*#__PURE__*/ createSetter();

export const mutableHandlers = {
  get,
  set,
};

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, "get", key);
    if (res !== null && typeof val === "object") {
      reactive(res);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    const hadKey = Object.prototype.hasOwnProperty.call(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else {
      trigger(target, "add", key, value, oldValue);
    }
    return result;
  };
}
