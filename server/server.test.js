const { knex } = require("config/db");
const proxyquire = require("proxyquire").noPreserveCache();

const handlerFunc = (req, res, next) => next();
const errorHandlerStub = sinon.stub().returns(handlerFunc);
const requestHandlerStub = sinon.stub().returns(handlerFunc);
const stubs = {
  raven: {
    config: sinon.stub().returnsThis(),
    install: sinon.stub(),
    errorHandler: errorHandlerStub,
    requestHandler: requestHandlerStub
  }
};
const bookmark = {
  title: "index test bookmark",
  url: "https://duckduckgo.com"
};
const bookmarks = Array.apply(null, { length: 26 }).map(() => bookmark);

before(done => {
  knex
    .batchInsert("bookmarks", bookmarks)
    .then(() => done())
    .catch(err => {
      throw new Error("There was a problem seeding the test db: ", err);
    });
});

after(done => {
  knex("bookmarks")
    .truncate()
    .then(() => done());
});

describe("server", () => {
  afterEach(() => {
    stubs.raven.errorHandler.reset();
    stubs.raven.requestHandler.reset();
    stubs.raven.config.reset();
    stubs.raven.install.reset();

    stubs.raven.config.returnsThis();
    stubs.raven.errorHandler.returns(handlerFunc);
    stubs.raven.requestHandler.returns(handlerFunc);
  });

  it("should not use raven if no token exists", () => {
    proxyquire(
      "./index",
      Object.assign({}, stubs, {
        config: {
          ravenUrl: ""
        }
      })
    );

    expect(stubs.raven.config.calledOnce).to.be.false;
    expect(stubs.raven.install.calledOnce).to.be.false;
    expect(stubs.raven.errorHandler.calledOnce).to.be.false;
    expect(stubs.raven.requestHandler.calledOnce).to.be.false;
  });

  it("should use raven if a token exists", () => {
    proxyquire(
      "./index",
      Object.assign({}, stubs, {
        config: {
          ravenUrl: "1234567890"
        }
      })
    );

    expect(stubs.raven.config.calledOnce).to.be.true;
    expect(stubs.raven.install.calledOnce).to.be.true;
    expect(stubs.raven.errorHandler.calledOnce).to.be.true;
    expect(stubs.raven.requestHandler.calledOnce).to.be.true;
    expect(stubs.raven.config.firstCall.args).to.deep.equal(["1234567890"]);
    expect(stubs.raven.install.firstCall.args).to.deep.equal([]);
    expect(stubs.raven.errorHandler.firstCall.args).to.deep.equal([]);
    expect(stubs.raven.requestHandler.firstCall.args).to.deep.equal([]);
  });
});
