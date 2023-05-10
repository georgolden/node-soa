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

export const createDomainService = (source, deps, config) => {
  console.dir({ source, deps, config });
  const [cmds, eHanlers] = source;
  /** @type {*} { commands, eventHanlers } */
  const service = {};
  if (cmds === null) {
    service.commands === null;
  } else {
    service.commands = {};
    for (const [cmdName, cmdFn] of Object.entries(cmds)) {
      const domainFunction = createDomainFunction(cmdFn, deps, config);
      service.commands[cmdName] = domainFunction;
    }
  }
  if (eHanlers === null) {
    service.eventHandlers === null;
  } else {
    service.eventHandlers = {};
    for (const [eHanlerName, eHandlerFn] of Object.entries(eHanlers)) {
      const domainFunction = createDomainFunction(eHandlerFn, deps, config);
      service.commands[eHanlerName] = domainFunction;
    }

  }
  return service;
};
