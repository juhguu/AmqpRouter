"use strict";

const { expect } = require("chai");
const { AmqpRouter, Routes } = require("../../index");

describe("AmqpRouter - Functional", () => {
  beforeEach(function() {
    Routes.length = 0;
  });

  describe("#add()", () => {
    it("add an AmqpRoute Object to the Routes array", () => {
      AmqpRouter.add("foo.bar", (message, channel) => {});

      expect(Routes).to.be.an("array");
      expect(Routes.length).to.equal(1);
    });

    it("return an error with invalid router", () => {
      expect(() => AmqpRouter.add(1, (message, channel) => {})).to.throw(
        "Cannot instantiate a route without a valid action path."
      );
    });

    it("return an error with invalid handler", () => {
      expect(() => AmqpRouter.add("foo.bar", 1)).to.throw(
        "Cannot instantiate route without route handler."
      );
    });
  });

  describe("#resolve()", () => {
    it("execute handler with callback function as handler", () => {
      const message = {
        properties: {
          headers: {
            action: "foo.bar"
          }
        }
      };

      const channel = {};

      AmqpRouter.add("foo.bar", (message, channel) => {
        return "FooBar";
      });

      AmqpRouter.resolve(message, channel);

      expect(AmqpRouter.resolve(message, channel)).to.be.a("string");
      expect(AmqpRouter.resolve(message, channel)).to.equal("FooBar");
    });

    it("execute handler with named controller as handler", () => {});
  });
});
