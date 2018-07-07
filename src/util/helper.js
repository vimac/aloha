function isPlainObject(obj) {
  return  typeof obj === 'object' 
      && obj !== null
      && obj.constructor === Object 
      && Object.prototype.toString.call(obj) === '[object Object]';
}

function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}

module.exports = {
  isPlainObject, isConstructor
};