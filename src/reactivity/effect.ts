/*
 * @Date: 2023-03
 * @LastEditors: wfj
 * @LastEditTime: 2023-03
 * @Description:
 */

interface OptionModel {
  scheduler?: Function;
  onStop?: Function;
}

class ReactiveEffect {
  private _fn: any;
  private scheduler: any;
  private onStop: any;
  deps = [];

  constructor(_fn, { scheduler, onStop }: OptionModel) {
    this._fn = _fn;
    this.scheduler = scheduler;
    this.onStop = onStop;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    cleanupEffect(this);
    this.onStop && this.onStop();
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
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

  if (!activeEffect) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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

  const runner: any = _effect.run.bind(_effect);
  runner._effect = _effect;
  return runner;
}

export function stop(runner) {
  runner._effect.stop();
}
