"use strict";

const { expect } = require("chai");
const { AmqpRouter } = require("../../index");

describe("AmqpRouter - Unit", () => {
  describe("#validateRoute()", () => {
    it("return an error for non string routes", () => {
      expect(() => AmqpRouter.validateRoute(1)).to.throw(
        "Cannot instantiate a route without a valid action path."
      );
    });

    it("return void with a valid route path", () => {
      expect(AmqpRouter.validateRoute("foo.bar")).to.be.undefined;
    });
  });

  describe("#validateMessage()", () => {
    it("return an error with message without action header property", () => {
      const message = {
        properties: {
          headers: {}
        }
      };

      expect(() => AmqpRouter.validateMessage(message)).to.throw(
        "Action key in header is required."
      );
    });

    it("return an error with message invalid headers action", () => {
      const message = {
        properties: {
          headers: {
            action: 1
          }
        }
      };

      expect(() => AmqpRouter.validateMessage(message)).to.throw(
        "Action key in header must be a string."
      );
    });

    it("return void with a valid message object", () => {
      const message = {
        properties: {
          headers: {
            action: "foo.bar"
          }
        }
      };

      expect(AmqpRouter.validateMessage(message)).to.be.undefined;
    });
  });

  describe("#validateHandler()", () => {
    it("return an error with an invalid handler for router", () => {
      expect(() => AmqpRouter.validateHandler(1)).to.throw(
        "Cannot instantiate route without route handler."
      );
    });

    it("return void with a handler as a string", () => {
      expect(AmqpRouter.validateHandler("FooBarController")).to.be.undefined;
    });

    it("return void with a handler as a function", () => {
      expect(
        AmqpRouter.validateHandler(() => {
          return "Foo bar";
        })
      ).to.be.undefined;
    });
  });

  describe("#controllerName()", () => {
    it("return a controller name", () => {
      expect(AmqpRouter.controllerName("FooBarController.create")).to.equal(
        "FooBarController"
      );
    });
  });

  describe("#controllerAction()", () => {
    it("return a controller action name", () => {
      expect(AmqpRouter.controllerAction("FooBarController.create")).to.equal(
        "create"
      );
    });
  });
});
