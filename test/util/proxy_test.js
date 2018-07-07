
const createProxy = require("../../src/util/proxy");
const assert = require("assert");
const sinon = require("sinon");

describe("test method proxy", function() {
  it("testMethod", function() {
    let testObj = {'testMethod' : () => {return 1024}};
    assert.equal(1024, testObj.testMethod());

    let proxiedObj = createProxy(testObj, {
      'testMethod': function(reflectFunc, originalArgs){
        return reflectFunc(...originalArgs) * 2;
      }
    });

    assert.equal(2048, proxiedObj.testMethod());
  });
});
