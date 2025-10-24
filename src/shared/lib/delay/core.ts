export class Delay {
  // private static debounceTimeout: NodeJS.Timeout;
  // private static debounceTimeout: NodeJS.Timeout;

  static debounce<T extends Array<any>>(fn: (...args: T) => void, delay = 200) {
    // let timer: NodeJS.Timeout;
    return (...args: T) => {
      // if (timer) {
      //   clearTimeout(timer);
      // }
      // timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  static throttle<T extends Array<any>>(
    timer: NodeJS.Timeout | null,
    callback: (...args: T) => void,
    delay = 200
  ) {
    return (...args: T) => {
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        callback.apply(this, args);
        timer = null;
      }, delay);
    };
  }

  static run(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
