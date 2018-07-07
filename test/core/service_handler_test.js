const createServiceHandler = require('../../src/core/service_handler');
const {addMiddleware} = require('../../src/core/middleware');
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
      assert.equal(result['keyTest'], 'valueTest', 'result should equal to fakeServiceImpl return value');
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
      assert.equal(error.message, 'nothing', 'error.message should be "nothing"');
    });
  });

  it('test middlewares', () => {
    addMiddleware(async(request, context, metadata, next) => {
      assert.notEqual(request['fake'], 'modified');
      request['fake'] = 'modified';
      await next();
    });

    addMiddleware(async(request, context, metadata, next) => {
      assert.equal(request['fake'], 'modified');
      await next();
    });

    const fakeServiceImpl = {
      'hello' : async (request, context, metadata) => {
        return {'keyTest': request['fake']}
      }
    }

    const container = createServiceHandler(fakeServiceDef, fakeServiceImpl); 
    container.hello(callStub, (error, result) => {
      assert.equal(result['keyTest'], 'modified', 'result should equal to modified data');
    });
  });

})

