# AmqpRouter

A simple route system made with Node to use with Amqp protocol.

## How to use ?

```javascript
const { AmqpRouter } = require("AmqpRouter");
```

#### Routes with callback functions

```javascript
AmqpRouter.add("your.route", (message, channel) => {
  // your handler here
});
```

#### Routes with named controllers

```javascript
AmqpRouter.add("your.route", "YourController.yourAction");
```

> On your controller, you have access to the message and channel object. Example:

```javascript
"use strict";

class YourController {
  async yourAction({ message, channel }) {
    // your handler here
  }
}

module.exports = YourController;
```

In your AMQP (RabbitMQ) Server, enter the following code:

```javascript
AmqpRouter.resolve(msg, channel);
```
