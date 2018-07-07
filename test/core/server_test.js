const createTestServerAndClient = require('./test_server_client');
const assert = require('assert');

describe('test server and client', () => {
  it('normal', (done) => {
    (async () => {
      let {proto, server, clientWrapper} = createTestServerAndClient({
        'doSomeTest' : async (request, context, metadata) => {
          context.metadata.set('test', 'hello,world');
          return {'message': 'ok'};
        }
      });
      server.start();

      let result = await clientWrapper.doSomeTest({});
      assert.notEqual(result.response, null, 'result.response should not be null');
      assert.equal(result.response.message, 'ok', 'result.response.message should be ok');
      assert.notEqual(result.metadata, null, 'result.metadata should not be null');
      assert.equal(result.metadata.get('test'), 'hello,world', 'result.metadata.test should be "hello,world"');

      server.tryShutdown(done);
    })();
  });

  it('normal client metadata', (done) => {
    (async () => {
      let {proto, server, clientWrapper} = createTestServerAndClient({
        'doSomeTest' : async (request, context, metadata) => {
          assert.equal(metadata.get('test'), 'metadata test', 'metadata "test" should be "metadata test"');
          context.metadata.set('test', 'hello,world');
          return {'message': 'ok'};
        }
      });
      server.start();

      let result = await clientWrapper.doSomeTest({}, {
        metadata: {
          'test': 'metadata test'
        }
      });
      assert.notEqual(result.response, null, 'result.response should not be null');
      assert.equal(result.response.message, 'ok', 'result.response.message should be ok');
      assert.notEqual(result.metadata, null, 'result.metadata should not be null');
      assert.equal(result.metadata.get('test'), 'hello,world', 'result.metadata.test should be "hello,world"');

      server.tryShutdown(done);
    })();
  });

  it('exception', (done) => {
    (async () => {
      let {proto, server, clientWrapper} = createTestServerAndClient({
        'doSomeTest' : async (request, context, metadata) => {
          context.metadata.set('test', 'hello,world');
          return {'message': 'ok', "field_not_exists_in_proto_file": "1234"};
        }
      });
      server.start();

      try {
        let result = await clientWrapper.doSomeTest({});
      } catch (e) {
        assert.equal(/field_not_exists_in_proto_file/i.test(e.message), true, 'e.message should contain "field_not_exists_in_proto_file"');
        assert.notEqual(e.metadata, null, 'e.metadata should not be null');
        assert.equal(e.metadata.get('test'), 'hello,world', 'e.metadata.test should be "hello,world"');
      } finally {
        server.tryShutdown(done);
      }
    })()
  });

  it('timeout', (done) => {
    (async () => {
      let {proto, server, clientWrapper} = createTestServerAndClient({
        'doSomeTest' : async (request, cotnext, metadata) => {
          let start = new Date().getTime();
          let costTime;
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(new Date().getTime());
            }, 100);
          }).then((end) => {
            costTime = end - start;
          })
          context.metadata.set('cost', costTime)
          return {'message': 'ok'};
        }
      });
      server.start();
      try {
        let result = await clientWrapper.doSomeTest({}, {options: 
          {deadline: (new Date().getTime() + 10)}
        });
      } catch (e) {
        assert.equal(e.metadata['cost'], null, 'metadata should not be sent before timeout');
        assert.equal(/deadline/i.test(e.message), true, 'e.message should contain deadline information');
      }
      server.tryShutdown(done);
    })();
  });

  it('costTime', (done) => {
    (async () => {
      let {proto, server, clientWrapper} = createTestServerAndClient({
        'doSomeTest' : async (request, context, metadata) => {
          let start = new Date().getTime();
          let costTime;
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(new Date().getTime());
            }, 10);
          }).then((end) => {
            costTime = end - start;
          }).catch(eee => {
            console.error(eee);
          })
          context.metadata.set('cost', costTime.toString())
          return {'message': 'ok'};
        }
      });
      server.start();
      let result = await clientWrapper.doSomeTest({}, {options: 
        {deadline: (new Date().getTime() + 100)}
      });
      assert.notEqual(result.metadata.get('cost'), null, 'cost should not be null');
      assert.notEqual(parseInt(result.metadata.get('cost')), NaN, 'cost should not be NaN');

      server.tryShutdown(done);
    })();
  });
});