const {getCurrentApplication} = require('./application')

class Service {

  constructor(ctx) {
    this.app = getCurrentApplication();
    this.ctx = ctx;
  }

}