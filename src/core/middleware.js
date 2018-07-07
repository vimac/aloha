
let middlewareStacks = [];

function addMiddleware(middleware) {
  middlewareStacks.push(middleware)
}

function getMiddlewares() {
  return middlewareStacks;
}

module.exports = {addMiddleware, getMiddlewares};

