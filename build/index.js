'use strict';

var node_events = require('node:events');
var express = require('express');

class Events {
    static Create = "create"
    static Rename = "rename"
    static Priority = "priority"
    static Close = "close"
    static Ready = "ready"
    static Debug = "debug"
}

class Priorities {
    static High = "high"
    static Medium = "medium"
    static Low = "low"
}

/*
    {
        "customURL":"https://ticketywebhook.requestcatcher.com",
        "guildId":"1161743005082992731",
        "guildName":"Tickety Training",
        "channelId":"1161743005082992734",
        "userId":"503282932241268736",
        "userName":"notdemonix",
        "panel":"Support",
        "type":"create",
        "openDate":1706717176563
    }
*/


class Parser {
    data;
    parsed = {};

    constructor(data) {
        this.data = data;
        if(!data.type) return new Error("Unable to parse data because type is unexistant.");
    }

    work () {
        this.defaultParse();
        switch(this.data.type) {
            case Events.Create: this.parseCreate(); break;
            case Events.Close: this.parseClose(); break;
            case Events.Priority: this.parsePriority(); break;
            case Events.Rename: this.parseRename(); break;
        }

        return this.parsed
    }

    defaultParse() {
        this.parsed = {
            guild: {
                id: this.data["guildId"],
                name: this.data["guildName"]
            },
            channel: {
                id: this.data["channelId"]
            },
            user: {
                id: this.data["userId"],
                name: this.data["userName"]
            },
            panel: this.data["panel"]
        };
    }

    parseCreate () {
        this.parsed["type"] = Events.Create;
        this.parsed["openTimestamp"] = this.data["openDate"];
    }

    parseClose () {
        this.parsed["type"] = Events.Close;
    }

    parseRename () {
        this.parsed["type"] = Events.Rename;
        this.parsed["newName"] = this.data["newName"];
    }

    parsePriority () {
        this.parsed["type"] = Events.Priority;
        this.parsed["priority"] = this.data["priority"] === 1 ?
            Priorities.High : this.data["priority"] === 2 ?
                    Priorities.Medium : Priorities.Low;
    }
}

/**
 * @typedef {object} ClientConfig;
 * @property {number?} port;
 */


let TicketyClient$1 = class TicketyClient extends node_events.EventEmitter {
    /** @type {ClientConfig} */
    config;
    /** @type {import("express").Express} */
    app;

    /**
     * Creates a new Tickety Client !
     * @param {ClientConfig} config
     */
    constructor(config) {
        super();
        this.config = config;
    }


    listen () {
        if(!this.config.port) this.config.port = 3000;

        this.app = express();
        this.app.use(express.json());

        this.app.post("/tickety", (req, res) => {
            if(!req.body) return res.status(400).json({ code: 400, error: true, message: "Invalid form body" });
            
            const parsed = new Parser(req.body).work();
            this.emit(parsed.type, parsed);
            this.emit(Events.Debug, req.body, parsed);
            res.status(200).json({ code: 200, error: false });
        });

        this.app.listen(this.config.port, () => {
            this.emit(Events.Ready, this.config.port);
        });
    }
};

const TicketyClient = TicketyClient$1;

exports.TicketyClient = TicketyClient;
