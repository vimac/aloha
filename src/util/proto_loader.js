const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');


module.exports = (protoFilePath) => {
  if (!fs.existsSync(protoFilePath)) {
    throw new Error("Protofile " + protoFilePath + " not exists.");
  }
  const basename = path.basename(protoFilePath);
  const dirname = path.dirname(protoFilePath);
  let proto = protoLoader.loadSync(basename, {includeDirs: [dirname]});
  return grpc.loadPackageDefinition(proto);
}