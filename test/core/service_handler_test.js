const createServiceHandler = require('../../src/core/service_handler');

const assert = require('assert');

const fakeServiceDef = {
  'hello' : {}
}
const fakeMetadata = {
  getMap: () => {
    return {'fake': 'fameMetadata'}
  }
}
const fakeRequest = {
  fake: 'fakeRequest'
}
const callStub = {
  request: fakeRequest, 
  metadata: fakeMetadata,
  sendMetadata: () => {}
}

describe('service handler test', () => {

  it('normal', () => {
    const fakeServiceImpl = {
      'hello' : async (request, context, metadata) => {
        return {'keyTest': 'valueTest'}
      }
    }
    const container = createServiceHandler(fakeServiceDef, fakeServiceImpl); 
    container.hello(callStub, (error, result) => {
      assert(result['keyTest'], 'valueTest', 'result should equal to fakeServiceImpl return value');
    });
  });


  it('error handler', () => {
    const fakeServiceImpl = {
      'hello' : async (request, context, metadata) => {
        throw new Error('nothing')
      }
    }
    const container = createServiceHandler(fakeServiceDef, fakeServiceImpl); 
    container.hello(callStub, (error, result) => {
      assert(error.message, 'nothing', 'error.message should be "nothing"');
    });
  });

})

