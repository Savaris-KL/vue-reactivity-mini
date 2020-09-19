const targetMap = new WeakMap();

let activeEffect;
let effectStack = [];

export function track(target, type, key) {
  if (activeEffect === undefined) {
    return; // 初始化
  }

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect); // 属性依赖收集
    activeEffect.deps.push(dep); // 双向存储，查询优化
  }
}

export function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    // nevet been tracked
    return;
  }

  const effects = new Set();
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        if (effect !== activeEffect) {
          effects.add(effect);
        }
      });
    }
  };

  if (key != void 0 /* undefined */) {
    add(depsMap.get(key)); // 统计需要触发的effects
  }

  const run = (effect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler(); // computed属性
    } else {
      effect();
    }
  };

  effects.forEach(run);
}

export function effect(fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();
  }
  return effect;
}

let uid = 0;

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effect.active) {
      return options.scheduler ? undefined : fn();
    }
    if (!effectStack.includes(effect)) {
      cleanup(effect); // 清除旧的依赖
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid++;
  effect._isEffect = true;
  effect.active = true;
  effect.raw = fn;
  effect.deps = [];
  effect.options = options;
  return effect;
}

function cleanup(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
