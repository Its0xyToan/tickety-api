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

interface Config {
  route?: string;
  key: string;
  port?: number;
}

/**
 * Request options for handleRequest method
 */
interface RequestOptions {
  body: any;
  headers: Record<string, string>;
}

/**
 * Response from handleRequest method
 */
interface RequestResponse {
  status: number;
  payload: Record<string, any>;
}

/**
 * TicketyClient listens to ticket-related events on a specific port
 */
export class TicketyClient extends EventEmitter {
  private app: Application;
  private port: number;
  public config: Config;

  constructor(config: Config);

  /**
   * Handles incoming Tickety webhook requests
   * @param options - Request handling options
   * @returns Response object with status and payload
   */
  public handleRequest(options: RequestOptions): RequestResponse;

  /**
   * Creates an Express route handler for Tickety webhooks
   * @returns Express middleware function
   */
  public createExpressHandler(): (req: any, res: any) => any;

  /**
   * Creates a handler function that can be used with any HTTP framework
   * @returns Generic handler that takes request data and returns a response
   */
  public createHandler(): (options: RequestOptions) => RequestResponse;

  /**
   * Start an Express server to listen for incoming ticket events
   * @returns Express application instance
   */
  public listen(): Application;
}

declare module "node:events" {
  interface EventEmitter {
    emit(event: string | symbol, ...args: any[]): boolean;

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
