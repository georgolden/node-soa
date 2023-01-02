var partial =
  (fn, ctx) =>
  (...args) =>
    fn(ctx, ...args);

export default partial;
