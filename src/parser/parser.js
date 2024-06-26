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

import Events from "../objects/Events.js";
import Priorities from "../objects/Priorities.js";

export default class Parser {
    data;
    parsed = {};

    constructor(data) {
        this.data = data;
        if(!data.type) return new Error("Unable to parse data because type is unexistant.");
    }

    work () {
        this.defaultParse()
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
        }
    }

    parseCreate () {
        this.parsed["type"] = Events.Create
        this.parsed["openTimestamp"] = this.data["openDate"]
    }

    parseClose () {
        this.parsed["type"] = Events.Close
    }

    parseRename () {
        this.parsed["type"] = Events.Rename
        this.parsed["newName"] = this.data["newName"]
    }

    parsePriority () {
        this.parsed["type"] = Events.Priority
        this.parsed["priority"] = this.data["priority"] === 1 ?
            Priorities.High : this.data["priority"] === 2 ?
                    Priorities.Medium : Priorities.Low;
    }
}


