import { track, trigger } from "./effect";

export function ref(value) {
  return createRef(value);
}

function createRef(rawValue) {
  return new RefImpl(rawValue);
}

class RefImpl {
  constructor(_rawValue) {
    this._value = _rawValue;
  }

  get value() {
    track(this, "get", "value");
    return this._value;
  }

  set value(newVal) {
    if (newVal !== this._value) {
      this._value = newVal;
      trigger(this, "set", "value", newVal);
    }
  }
}
