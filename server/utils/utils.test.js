const proxyquire = require("proxyquire").noPreserveCache();

describe("server utils", () => {
  describe("loggerdef config", () => {
    it("should use a base bunyan logger without a logentriesToken", () => {
      const { loggerDef } = require("./index");

      expect(loggerDef).to.deep.equal({ name: "bkmrkd" });
    });

    it("should use a logentries.com bunyan logger with a logentriesToken", () => {
      const stub = { name: "logentries" };
      const { loggerDef } = proxyquire("./index", {
        config: {
          logentriesToken: "1234567890"
        },
        le_node: {
          bunyanStream: () => stub
        }
      });

      expect(loggerDef).to.deep.equal(stub);
    });
  });
});
