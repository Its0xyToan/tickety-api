import { Application } from "express";
import { EventEmitter } from "events";

export enum Events {
  Ready = "ready",
  Create = "create",
  Rename = "rename",
  Priority = "priority",
  Close = "close",
  Debug = "debug",
}

type Priority = {
  number: number;
  toString: () => string;
};

/**
 * The default tickety payload
 */
interface BasePayload {
  ticketId: string;
  guildId: string;
  panelId: string;
  channelId: string;

  createdBy: string;
  createdAt: number;
}

interface CreatePayload extends BasePayload {
  answers: {
    question: string;
    answer: string;
  }[];
}

interface RenamePayload extends BasePayload {
  oldName: string;
  newName: string;
}

type ClosePayload = BasePayload;

interface PriorityUpdatePayload extends BasePayload {
  oldPriority: Priority;
  newPriority: Priority;
}

export type TicketEvent =
  | CreatePayload
  | ClosePayload
  | RenamePayload
  | PriorityUpdatePayload;

/**
 * Event payload mapping for TicketyClient
 */
export interface ClientEvents {
  ready: [connectUrl: string, port: number];
  create: [ticket: CreatePayload];
  rename: [ticket: RenamePayload];
  priority: [ticket: PriorityUpdatePayload];
  close: [ticket: ClosePayload];
}

/**
 * TicketyClient listens to ticket-related events on a specific port
 */
export class TicketyClient extends EventEmitter {
  private app: Application;
  private port: number;

  constructor(config?: { route?: string });

  /**
   * Start an Express server to listen for incoming ticket events
   * @param port - Port number to listen on
   * @returns true if the server started successfully
   */
  public listen(port: number): Promise<boolean>;
}

declare module "node:events" {
  interface EventEmitter {
    /**
     * Await a single occurrence of a typed event from TicketyClient
     */
    once<E extends EventEmitter, K extends keyof ClientEvents>(
      emitter: E,
      event: E extends TicketyClient ? K : string,
    ): Promise<E extends TicketyClient ? ClientEvents[K] : any[]>;

    /**
     * Iterate over all occurrences of a typed event from TicketyClient
     */
    on<E extends EventEmitter, K extends keyof ClientEvents>(
      emitter: E,
      event: E extends TicketyClient ? K : string,
    ): AsyncIterableIterator<E extends TicketyClient ? ClientEvents[K] : any>;
  }
}
