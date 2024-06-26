import { EventEmitter } from "node:events"
import express from "express"
import Parser from "./parser/parser.js";
import Events from "./objects/Events.js";

/**
 * @typedef {object} ClientConfig;
 * @property {number?} port;
 */


export default class TicketyClient extends EventEmitter {
    /** @type {ClientConfig} */
    config;
    /** @type {import("express").Express} */
    app;

    /**
     * Creates a new Tickety Client !
     * @param {ClientConfig} config
     */
    constructor(config) {
        super()
        this.config = config
    }


    listen () {
        if(!this.config.port) this.config.port = 3000

        this.app = express()
        this.app.use(express.json())

        this.app.post("/tickety", (req, res) => {
            if(!req.body) return res.status(400).json({ code: 400, error: true, message: "Invalid form body" });
            
            const parsed = new Parser(req.body).work()
            this.emit(parsed.type, parsed)
            this.emit(Events.Debug, req.body, parsed)
            res.status(200).json({ code: 200, error: false })
        })

        this.app.listen(this.config.port, () => {
            this.emit(Events.Ready, this.config.port)
        })
    }
}