import { effect, reactive, ref } from "../../libs/vue-reactivity";

describe("reactivity/effect", () => {
  it("should run the passed function once (wrapped by a effect)", () => {
    const fnSpy = jest.fn(() => {});
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it("should observe ref properties", () => {
    let dummy;
    const num = ref(0);
    effect(() => (dummy = num.value));

    expect(dummy).toBe(0);
    num.value = 7;
    expect(dummy).toBe(7);
  });

  it("should observe basic properties", () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));

    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  });
});
