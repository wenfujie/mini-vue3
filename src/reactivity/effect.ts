/*
 * @Date: 2023-03
 * @LastEditors: wfj
 * @LastEditTime: 2023-03
 * @Description:
 */

interface OptionModel {
  scheduler?: Function;
}

class ReactiveEffect {
  private _fn: any;
  private scheduler: any;

  constructor(_fn, { scheduler }: OptionModel) {
    this._fn = _fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

// 依赖收集
const targetMap = new Map();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);

  for (const effect of dep) {
    if (typeof effect.scheduler === "function") {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn, option = {}) {
  const _effect = new ReactiveEffect(fn, option);
  _effect.run();
  return _effect.run.bind(_effect);
}
