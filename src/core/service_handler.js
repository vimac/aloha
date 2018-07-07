const Context = require('./context')
const {getMiddlewares} = require('./middleware')

const createRealImplementionMethodForService = (serviceImpl, methodName) => {
  return (call, callback) => {
    try {
      const context = new Context();
      let middlewares = getMiddlewares().slice(0);
      let currentIndex = 0;
      const next = () => {
        let middleware = middlewares.shift();
        if (middleware) {
          new Promise(
            (resolve, reject) => {
              try {
                resolve(middleware.apply(serviceImpl, [call.request, context, call.metadata, next]));
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
          resolve(serviceImpl[methodName].apply(serviceImpl, [call.request, context, call.metadata]));
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

const createServiceHandler = (service, serviceImpl) => {

  let container = {};

  Object.keys(service).forEach(methodName => {

    if (typeof serviceImpl[methodName] != 'function') {
      // method not impl
      return;
    }

    container[methodName] = createRealImplementionMethodForService(serviceImpl, methodName);

  });

  return container;
}

module.exports = createServiceHandler;