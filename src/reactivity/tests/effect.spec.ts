/*
 * @Date: 2023-03
 * @LastEditors: wfj
 * @LastEditTime: 2023-03
 * @Description:
 */

import { effect, stop } from "../effect";
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

  it("scheduler", () => {
    const user = reactive({ age: 10 });
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });

    let nextAge;
    const runner = effect(
      () => {
        nextAge = user.age + 1;
      },
      { scheduler }
    );

    expect(nextAge).toBe(11);
    expect(scheduler).not.toHaveBeenCalled();

    user.age++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(nextAge).toBe(11);

    run();
    expect(nextAge).toBe(12);
  });

  it("stop", () => {
    const user = reactive({ age: 1 });

    let currAge;
    const runner = effect(() => {
      currAge = user.age;
    });

    expect(currAge).toBe(1);

    user.age = 2;
    expect(currAge).toBe(2);

    stop(runner);
    user.age = 3;
    expect(currAge).toBe(2);

    runner();
    expect(currAge).toBe(3);
  });

  it("onStop", () => {
    const user = reactive({ age: 1 });
    const onStop = jest.fn();

    let currAge;
    const runner = effect(
      () => {
        currAge = user.age;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
