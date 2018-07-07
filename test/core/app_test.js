const createTestServerAndClient = require('./test_server_client');
const assert = require('assert');
const {Application} = require('../../src/core/application')

describe('application test', () => {
  it('normal', (done) => {
    (async () => {
      let app = new Application({
        host: '127.0.0.1',
        port: 10240
      });
      done();
    })();
  });

});