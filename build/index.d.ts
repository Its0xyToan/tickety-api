import { TypedEmitter } from 'tiny-typed-emitter';

export type ClientConfig = {
    port: number | null;
};

interface baseTicket {
    guild: {
        id: string,
        name: string
    },
    channel: {
        id: string
    },
    user: {
        id: string,
        name: string
    },
    panel: string
}

interface create extends baseTicket {
    openTimestamp: number
    type: "create"
}

interface close extends baseTicket {
    type: "close"
}

interface rename extends baseTicket {
    newName: string,
    type: "rename"
}

interface priority extends baseTicket {
    priority: "high" | "medium" | "low",
    type: "priority"
}

interface ClientEvents {
    'create': (ticket: create) => void;
    'close': (ticket: close) => void;
    'rename': (ticket: rename) => void;
    'priority': (ticket: priority) => void;
    'ready': (port: number) => void;
}


export class TicketyClient extends TypedEmitter<ClientEvents> {
    constructor(config: ClientConfig)
    listen(): void;
}