const grpc = require('grpc')
const {getCurrentApplication} = require('./application')

module.exports = class Context {

  constructor() {
    this.metadata = new grpc.Metadata();
    this.app = getCurrentApplication();
  }


}
