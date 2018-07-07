const {ServerWrapper} = require('../../src/core/server_wrapper');
const createGRPCClient = require('../../src/core/client_wrapper');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const assert = require('assert');


const createTestServerAndClient = (serverImpl) => {

  assert.notEqual(serverImpl.doSomeTest, null, 'serverImpl should implement the method "doSomeTest"');

  let port = parseInt(Math.random() * 2000 + 63000);
  let proto = protoLoader.loadSync('test.proto', {includeDirs: [__dirname + '/../share/']});
  let package = grpc.loadPackageDefinition(proto);

  let server = new ServerWrapper('127.0.0.1', port);
  server.bind(package['TestService'].service, serverImpl);

  let clientWrapper = createGRPCClient('127.0.0.1', port, package['TestService']);

  return {package, server, clientWrapper};

}

module.exports = createTestServerAndClient;