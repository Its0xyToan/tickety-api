import { EventEmitter } from 'node:events';
import express from 'express';

class Events {
    static Create = "create"
    static Rename = "rename"
    static Priority = "priority"
    static Close = "close"
    static Ready = "ready"
    static Debug = "debug"
}

const priorityChange = (priority) => {
  return {
    number: priority,
    toString: () => {
      if (priority === 1) {
        return "high";
      } else if (priority === 2) {
        return "medium";
      } else if (priority === 3) {
        return "low";
      }
      return "none";
    },
  };
};

class Parserv3 {
  body;

  constructor(body) {
    this.body = body;
  }

  eventRegistry = {
    "ticket.create": Events.Create,
    "ticket.close": Events.Close,
    "ticket.rename": Events.Rename,
    "ticket.priority": Events.Priority,
  };

  work() {
    const event = this.body["event"];
    const payload = this.body["payload"];

    if (!event || !payload) {
      throw new Error("Invalid body (Using v3)");
    }

    let internalEvent = this.eventRegistry[event];
    if (!internalEvent) {
      throw new Error(`Unknown event: ${event}`);
    }

    switch (internalEvent) {
      case Events.Priority:
        return {
          type: internalEvent,
          payload: this.parsePriority(payload),
        };
      default:
        return {
          type: internalEvent,
          payload: payload,
        };
    }
  }

  parsePriority = (payload) => {
    payload["newPriority"] = priorityChange(payload["newPriority"]);
    payload["oldPriority"] = priorityChange(payload["oldPriority"]);
    return payload;
  };
}

/**
 * @type {import("./index.d.ts").TicketyClient}
 */
let TicketyClient$1 = class TicketyClient extends EventEmitter {
  config;
  /** @type {import("express").Express} */
  app;

  /**
   * Creates a new Tickety Client !
   * @param {import("./index.d.ts").Config} config
   */
  constructor(config) {
    super();
    this.config = config;
  }

  listen() {
    if (!this.config.port) this.config.port = 3000;

    this.app = express();
    this.app.use(express.json());

    this.app.post(`/${this.config.route ?? ""}`, (req, res) => {
      if (!req.body)
        return res
          .status(400)
          .json({ error: true, message: "Invalid form body, nice try bud" });

      if (req.headers.authorization !== this.config.key) {
        return res
          .status(401)
          .json({ error: true, message: "Unauthorized, still nice try bud" });
      }

      const parsed = new Parserv3(req.body).work();

      this.emit(parsed.type, parsed.payload);
      this.emit(Events.Debug, req.body, parsed.payload);

      res.status(200).json({
        error: false,
        message: "Hey from Tickety JS wrapper !",
      });
    });

    this.app.listen(this.config.port, () => {
      this.emit(Events.Ready, {
        port: this.config.port || 3000,
        route: "0.0.0.0/" + this.config.route ?? "",
      });
    });
  }
};

const TicketyClient = TicketyClient$1;

export { TicketyClient };
