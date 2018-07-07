const grpc = require('grpc');
const createServiceHandler = require('./service_handler')

class GRPCServer {

  constructor(address, port) {
    this._server = new grpc.Server();
    this._server.bind(address + ':' + port, grpc.ServerCredentials.createInsecure())
  }

  bind(service, impl) {
    if (!service || !impl) {
      throw new Error("Error parameter");
    }
    this._server.addService(service, createServiceHandler(service, impl));
  }

  start(...args) {
    this._server.start(...args);
  }

  tryShutdown(...args) {
    this._server.tryShutdown(...args);
  }

  forceShutdown() {
    this._server.forceShutdown();
  }

}

module.exports = GRPCServer;