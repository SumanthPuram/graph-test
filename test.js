#!/usr/bin/env node
const rp = require('request-promise');
const _ = require('lodash');

const tokens = ['BTC', 'ETH', 'BCH'];

async function run() {
  const responses = _.map(tokens, token => {
    const options = {
      uri: `https://cryptofin-sharer.herokuapp.com/ogImage/${token}`,
      headers: {
        'User-Agent': 'Request-Promise',
      },
    };
    return rp(options);
  });
  await Promise.all(responses);
}

run();
