/*
 * @Date: 2023-03
 * @LastEditors: wfj
 * @LastEditTime: 2023-03
 * @Description:
 */

import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age++;

    expect(nextAge).toBe(12);
  });

  it("should return runner, when call effect", () => {
    let page = 1;
    const runner = effect(() => {
      return ++page;
    });

    expect(page).toBe(2);
    expect(runner()).toBe(3);
    expect(page).toBe(3);
  });
});
