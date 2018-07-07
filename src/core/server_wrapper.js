const grpc = require('grpc');
const createServiceHandler = require('./service_handler')
const {addMiddleware} = require("./middleware");
const Service = require('./service');

let currentInstance = null;

const getCurrentServerInstance = () => {
  return currentInstance;
}

class ServerWrapper {

  constructor(address, port) {
    this._server = new grpc.Server();
    this._server.bind(address + ':' + port, grpc.ServerCredentials.createInsecure())

    this.Service = Service;
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

  use (middleware) {
    addMiddleware(middleware);
  }

}

module.exports = {ServerWrapper, getCurrentServerInstance};
