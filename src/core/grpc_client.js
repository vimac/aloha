const grpc = require('grpc');
const EventEmitter = require('events');

const remoteMethodWrapper = {

  get(target, propKey, receiver) {
    const origMethod = target[propKey];
    return (remoteParams, remoteOptions) => {
      let {metadata = {}, options = {}} = remoteOptions || {};

      //FIXME add default metadata
      metadata = Object.assign({}, {}, metadata);

      let metadataFromClient = new grpc.Metadata();
      Object.keys(metadata).forEach(
        k => metadataFromClient.set(k, metadata[k])
      );

      //FIXME add default options
      options = Object.assign({}, {}, options);

      const promise = new Promise((resolve, reject) => {
        try {

          let metadata;
          const callback = (err, response) => {
            if (err != null) {
              err.metadata = metadata;
              reject(err);
            } else {
              resolve({response, metadata});
            }
          };
          const callEvent = origMethod.apply(target, 
            [remoteParams, metadataFromClient, options, callback]
          );

          if (callEvent instanceof EventEmitter) {
            callEvent.on('metadata', (metadataFromServer) => {
              metadata = metadataFromServer;
            });
          }

        } catch (ex) {
          reject(ex);
        }
      });

      return promise;
    };
  }
};

function createGRPCClient(host, port, proto) {
    if (null == proto || null == proto.service) {
      throw new error('proto is not available');
    }

    let client = new proto(host + ':' + port, grpc.credentials.createInsecure());

    return new Proxy(client, remoteMethodWrapper);
}

module.exports = createGRPCClient;