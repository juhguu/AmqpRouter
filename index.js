"use strict";

const path = require("path");

const _routes = [];

class AmqpRouter {
  constructor(route, handler, message = null, channel = null) {
    this.route = route;
    this.handler = handler;
    this.message = message;
    this.channel = channel;
  }

  /**
   * Create a new route.
   *
   * @method add
   *
   * @param  {String}                  route
   *
   * @param  {Function|String}         handler
   *
   * @return {void}
   *
   * @static
   *
   * @example with named controller
   * AmqpRouter.add('patient.create', 'PatientController.create');
   *
   * @example with callback function
   * AmqpRouter.add('patient.store', (message, channel) => {});
   */
  static add(route, handler) {
    this.validateRoute(route);
    this.validateHandler(handler);
    _routes.push(new AmqpRouter(route, handler));
  }

  /**
   * Resolve a route and execute the respective
   * handler.
   *
   * @method resolve
   *
   * @param  {Array}                   routes Array of AmqpRoute objects
   *
   * @param  {Message}                 message AMQP Message Object
   *
   * @param  {Channel}                 channel AMQP Channel Object
   *
   * @return {void}
   *
   * @static
   */
  static resolve(message, channel) {
    this.validateMessage(message);

    const routerMatch = _routes.filter(e => {
      return e.route === message.properties.headers.action;
    });

    if (!routerMatch.length) {
      throw new Error(
        `Route: ${message.properties.headers.action} doesn't match.`
      );
    }

    routerMatch[0].message = message;
    routerMatch[0].channel = channel;

    if (typeof routerMatch[0].handler === "function") {
      return routerMatch[0].handler(message, channel);
    }

    const controllerInstance = this.instantiateController(
      routerMatch[0].handler
    );
    const action = this.controllerAction(routerMatch[0].handler);

    return controllerInstance[action](routerMatch[0]);
  }

  static instantiateController(handler) {
    const constrollerName = this.controllerName(handler);
    const rootPath = path.dirname(require.main.filename);
    const controllerPath = path.join(
      rootPath,
      "app",
      "Controllers",
      "Amqp",
      constrollerName
    );
    const Controller = require(controllerPath);

    return new Controller();
  }

  static controllerName(controller) {
    return controller.split(".")[0];
  }

  static controllerAction(controller) {
    return controller.split(".")[1];
  }

  /**
   * Validates the path to make sure it is string.
   *
   * @method validateMessage
   *
   * @param  {String}         path
   *
   * @return {void}
   *
   * @static
   */
  static validateRoute(route) {
    if (typeof route !== "string") {
      throw new Error(
        "Cannot instantiate a route without a valid action path."
      );
    }
  }

  /**
   * Validates the message to make sure it has
   * 'action' in headers and if it is a string.
   *
   * @method validateMessage
   *
   * @param  {Object}         message
   *
   * @return {void}
   *
   * @static
   */
  static validateMessage(message) {
    if (!("action" in message.properties.headers)) {
      throw new Error("Action key in header is required.");
    }

    if (typeof message.properties.headers.action !== "string") {
      throw new Error("Action key in header must be a string.");
    }
  }

  /**
   * Validates the handler to make sure it is a function
   * or a string.
   *
   * @method validateHandler
   *
   * @param  {Function|String}         handler
   *
   * @return {void}
   *
   * @static
   */
  static validateHandler(handler) {
    if (["string", "function"].indexOf(typeof handler) === -1) {
      throw new Error("Cannot instantiate route without route handler.");
    }
  }
}

module.exports.AmqpRouter = AmqpRouter;
module.exports.Routes = _routes;
