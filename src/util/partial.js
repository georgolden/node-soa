export const partial =
  (fn, ctx) =>
    (...args) =>
      fn(ctx, ...args);
