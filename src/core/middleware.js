
let middlewareStacks = [];

function addMiddleware(middleware) {
  middlewareStacks.push(middleware)
}

function getMiddlewares() {
  return middlewareStacks;
}

function clearMiddlewares() {
  middlewareStacks = [];
}

module.exports = {addMiddleware, getMiddlewares, clearMiddlewares};

