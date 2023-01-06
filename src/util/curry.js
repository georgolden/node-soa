export const curry =
  (fn) =>
    (...args) => {
      if (fn.length > args.length) {
        const f = fn.bind(null, ...args);
        return curry(f);
      } else {
        return fn(...args);
      }
    };
