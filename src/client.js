import { EventEmitter } from "node:events";
import express from "express";
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
   * @throws {Error} If the required key parameter is missing
   */
  constructor(config) {
    super();
    if (!config.key) {
      throw new Error("The 'key' parameter is required in the configuration");
    }
    this.config = config;
  }

  /**
   * Handles incoming Tickety webhook requests
   * @param {Object} options - Request handling options
   * @param {any} options.body - The request body
   * @param {Object} options.headers - The request headers
   * @returns {Object} Response object with status and payload
   */
  handleRequest({ body, headers }) {
    if (!body) {
      return {
        status: 400,
        payload: { error: true, message: "Invalid form body" }
      };
    }

    if (headers.authorization !== this.config.key) {
      return {
        status: 401,
        payload: { error: true, message: "Unauthorized" }
      };
    }

    const parsed = new Parserv3(body).work();

    this.emit(parsed.type, parsed.payload);
    this.emit(Events.Debug, body, parsed.payload);

    return {
      status: 200,
      payload: {
        error: false,
        message: "Hey from Tickety JS wrapper!"
      }
    };
  }

  /**
   * Creates an Express route handler for Tickety webhooks
   * @returns {Function} Express middleware function
   */
  createExpressHandler() {
    return (req, res) => {
      const response = this.handleRequest({
        body: req.body,
        headers: req.headers
      });
      
      return res.status(response.status).json(response.payload);
    };
  }

  /**
   * Creates a handler function that can be used with any HTTP framework
   * @returns {Function} Generic handler that takes request data and returns a response
   */
  createHandler() {
    return ({ body, headers }) => this.handleRequest({ body, headers });
  }

  /**
   * Start listening for Tickety webhook events using Express
   * @returns {Object} Server information
   */
  listen() {
    if (!this.config.port) this.config.port = 3000;

    this.app = express();
    this.app.use(express.json());

    const route = this.config.route ?? "tickety";
    this.app.post(`/${route}`, this.createExpressHandler());

    this.app.listen(this.config.port, () => {
      this.emit(Events.Ready, {
        port: this.config.port || 3000,
        route: `0.0.0.0/${route}`,
      });
    });
    
    return this.app;
  }
}
