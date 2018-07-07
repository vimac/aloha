const {getMiddlewares} = require('./middleware');
const GRPCMetadata = require('grpc').Metadata;
const {isConstructor} = require('../util/helper');
const Service = require('./service');

class RequestContext {

  constructor() {
    this.metadata = new GRPCMetadata();
  }

}

const createRealImplementionMethodForService = (serviceImplInstance, methodName) => {
  return (call, callback) => {
    try {
      const context = new RequestContext();
      let middlewares = getMiddlewares().slice(0);
      let currentIndex = 0;
      const next = () => {
        let middleware = middlewares.shift();
        if (middleware) {
          new Promise(
            (resolve, reject) => {
              try {
                resolve(middleware.apply(serviceImplInstance, [call.request, context, call.metadata, next]));
              } catch (e) {
                reject(e);
              }
            }
          ).then(resultFromImpl => {
          }).catch(e => {
            callback(e, null);
          })
        }
      }
      next();
      new Promise((resolve, reject) => {
        try {
          resolve(serviceImplInstance[methodName].apply(serviceImplInstance, [call.request, context, call.metadata]));
        } catch (e) {
          reject(e);
        }
      }).then((resultFromImpl) => {
        call.sendMetadata(context.metadata);
        callback(null, resultFromImpl);
      }).catch((errorFromImpl) => {
        call.sendMetadata(context.metadata);
        callback(errorFromImpl, null);
      });
    } catch (e) {
      callback(e, null);
    }
  };
}

const createServiceHandler = (service, serviceImpl, appContext) => {

  let container = {};
  let serviceImplInstance;

  if (serviceImpl.prototype && serviceImpl.prototype instanceof Service) {
    serviceImplInstance = new serviceImpl(appContext);
  } else if (isConstructor(serviceImpl)) {
    serviceImplInstance = new serviceImpl();
  } else {
    serviceImplInstance = serviceImpl;
  }
  if (serviceImplInstance.ctx == null) {
    serviceImplInstance.ctx = appContext;
  }

  Object.keys(service).forEach(methodName => {

    if (typeof serviceImplInstance[methodName] != 'function') {
      // method not impl
      return;
    }

    container[methodName] = createRealImplementionMethodForService(serviceImplInstance, methodName);
  });

  return container;
}

module.exports = createServiceHandler;