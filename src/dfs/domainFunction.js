/**
 * @typedef {import('./types').AnyFunc} AnyFunc
 * @typedef {import('./types').ServiceConfig} ServiceConfig
 */
import { partialOne } from '@oldbros/shiftjs';

const applyMetaToDeps = (meta, deps) => {
  const metaDeps = {};
  for (const [prop, dep] of Object.entries(deps)) {
    if (dep.withMeta) metaDeps[prop] = dep.withMeta(meta);
    else metaDeps[prop] = dep;
  }
  return metaDeps;
};

/**
 * @param {AnyFunc} sourceFn
 * @param {Object} deps
 * @param {ServiceConfig} config
 * @returns {AnyFunc}
*/
export const createDomainFunction = (sourceFn, deps, config) => {
  if (config.hideMeta) {
    return ({ meta, data }) => {
      const metaDeps = applyMetaToDeps(meta, deps);
      return sourceFn(metaDeps, { data });
    };
  } else {
    return partialOne(sourceFn, deps);
  }
};
