const GRPCServer = require('../../src/core/grpc_server');
const createGRPCClient = require('../../src/core/grpc_client');

const grpc = require('grpc');

const assert = require('assert');


const createTestServerAndClient = (serverImpl) => {

  assert.notEqual(serverImpl.doSomeTest, null, 'serverImpl should implement the method "doSomeTest"');

  let port = parseInt(Math.random() * 2000 + 63000);
  let proto = grpc.load(__dirname + '/../share/test.proto');

  let server = new GRPCServer('127.0.0.1', port);
  server.bind(proto['TestService'].service, serverImpl);

  let clientWrapper = createGRPCClient('127.0.0.1', port, proto['TestService']);

  return {proto, server, clientWrapper};

}

module.exports = createTestServerAndClient;