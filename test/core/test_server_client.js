const {ServerWrapper} = require('../../src/core/server_wrapper');
const createGRPCClient = require('../../src/core/client_wrapper');

const loadProto = require('../../src/util/proto_loader');

const assert = require('assert');


const createTestServerAndClient = (serverImpl) => {

  assert.notEqual(serverImpl.doSomeTest, null, 'serverImpl should implement the method "doSomeTest"');

  let port = parseInt(Math.random() * 2000 + 63000);
  let proto = loadProto(__dirname + '/../share/test.proto');

  let server = new ServerWrapper('127.0.0.1', port);
  server.bind(proto['TestService'].service, serverImpl);

  let clientWrapper = createGRPCClient('127.0.0.1', port, proto['TestService']);

  return {proto, server, clientWrapper};

}

module.exports = createTestServerAndClient;