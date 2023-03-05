/*
 * @Date: 2023-03
 * @LastEditors: wfj
 * @LastEditTime: 2023-03
 * @Description:
 */
import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      // 依赖收集
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const r = Reflect.set(target, key, value);
      // 触发依赖
      trigger(target, key);

      return r;
    },
  });
}
