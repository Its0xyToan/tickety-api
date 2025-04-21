import { EventEmitter } from "node:events";
import express from "express";
import Parser from "./parser/parser.js";
import Events from "./objects/Events.js";
import Parserv3 from "./parser/parser.js";

/**
 * @type {import("./index.d.ts").TicketyClient}
 */
export default class TicketyClient extends EventEmitter {
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
}
