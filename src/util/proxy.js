
const createProxy = function(target, mapper) {

  let handler = {
    get: (target, name, receiver) => {

      if (typeof mapper[name] == 'undefined' || mapper[name] === null) {
        return target[name];
      }

      if (typeof target[name] == 'function') {
        return function(...args) {
          return mapper[name](Reflect.get(target, name, receiver), args);
        };
      } else {
        return target[name];
      }

    }
  };

  return new Proxy(target, handler)
};

module.exports = createProxy;
