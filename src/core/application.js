
const {addMiddleware} = require("./middleware");

let currentApplication = null;

const getCurrentApplication = () => {
  return currentApplication;
}

class Application {

  constructor(options) {
    const {host, port} = options;
    this._server = new (require('./grpc_server'))(host, port);
    currentApplication = this;
  }

  getServer() {
    return this._server;
  }

  use (middleware) {
    addMiddleware(middleware);
  }

  start() {
    this._server.start();
  }

}

module.exports = {Application, getCurrentApplication};