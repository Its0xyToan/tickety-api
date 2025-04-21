import Events from "../objects/Events.js";
import { priorityChange } from "../objects/Priorities.js";

export default class Parserv3 {
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
