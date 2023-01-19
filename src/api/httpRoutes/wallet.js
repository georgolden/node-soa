/**@typedef {import('../router').HttpRoute} HttpRoute */

/**@type {HttpRoute} */
const deposit = {
  method: 'POST',
  url: 'deposit',
  command: 'wallet.deposit',
  dataSource: 'JSONBody',
  hooks: {
    beforeRequest: [

    ],
  },
};

export default [deposit];
