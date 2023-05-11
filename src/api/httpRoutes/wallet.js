/**@typedef {import('../typesForRouter').HttpRoute} HttpRoute */

/**@type {HttpRoute} */
const deposit = {
  method: 'POST',
  url: 'deposit',
  command: 'wallet.deposit',
  dataSource: 'JSONBody',
};

export default [deposit];
