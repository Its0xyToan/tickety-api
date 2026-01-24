import { Application } from "express";
import { EventEmitter } from "events";

/**
 * Priority type definition
 */
export type Priority = {
    number: number;
    toString: () => string;
};

/**
 * Event names enum
 */
export const enum Events {
    // Client / System
    Ready = "ready",

    // Ticket Events
    TicketCreate = "ticket.create",
    TicketClose = "ticket.close",
    TicketRename = "ticket.rename",
    TicketPriority = "ticket.priority",
    TicketMove = "ticket.move",
    TicketTransfer = "ticket.transfer",
    TicketClaim = "ticket.claim",
    TicketUnclaim = "ticket.unclaim",
    TicketAdd = "ticket.add",
    TicketRemove = "ticket.remove",

    // Application Events
    ApplicationSubmit = "application.submit",
    ApplicationAccept = "application.accept",
    ApplicationDeny = "application.deny",

    // Verification Events
    VerificationPass = "verification.pass",
    VerificationFail = "verification.fail",
}

// Payloads Interfaces

// --- Client System ---

export interface ClientReadyPayload {
    connectUrl: string;
    port: number;
}

// --- Ticket Category ---

export interface TicketPayload {
    ticketId: string;
    panelId: string;
    creatorId: string;
    channel: {
        id: string;
        name: string;
    };
    createdAt: Date;
}

interface Question {
    question: string;
    answer: string;
}

export interface TicketCreatePayload extends TicketPayload {
    questions: Question[];
}

export interface TicketClosePayload extends TicketPayload {
    closedBy: string; // User ID
    reason?: string;
    transcriptUrl?: string;
    closedAt: Date;
}

export interface TicketRenamePayload extends TicketPayload {
    oldName: string;
    newName: string;
}

export interface TicketPriorityPayload extends TicketPayload {
    oldPriority: Priority;
    newPriority: Priority;
}

export interface TicketMovePayload extends TicketPayload {
    oldCategoryId: string;
    newCategoryId: string;
}

export interface TicketTransferPayload extends TicketPayload {
    oldPanelId: string;
    newPanelId: string;
    oldCategoryId: string;
    newCategoryId: string;
}

export interface TicketClaimPayload extends TicketPayload {
    staffId: string; // User ID of the claimer
}

export interface TicketUnclaimPayload extends TicketPayload {
    staffId: string; // User ID who unclaimed
}

export interface TicketAddPayload extends TicketPayload {
    addedUserId: string; // User being added
}

export interface TicketRemovePayload extends TicketPayload {
    removedUserId: string; // User being removed
}

export type AnyTicketPayload =
    TicketCreatePayload |
    TicketClosePayload |
    TicketRenamePayload |
    TicketPriorityPayload |
    TicketMovePayload |
    TicketTransferPayload |
    TicketClaimPayload |
    TicketUnclaimPayload |
    TicketAddPayload |
    TicketRemovePayload

// --- Application Category ---

export interface ApplicationPayload {
    applicationId: string;
    panelId: string;
    submitterId: string;
    submittedAt: Date;
}

export interface ApplicationSubmitPayload extends ApplicationPayload {
}

export interface ApplicationAcceptPayload extends ApplicationPayload {
    reviewedBy: string; // User ID
    reason?: string;
    reviewedAt: Date;
}

export interface ApplicationDenyPayload {
    reviewedBy: string; // User ID
    reason?: string;
    reviewedAt: Date;
}

export type AnyApplicationPayload =
    ApplicationSubmitPayload |
    ApplicationAcceptPayload |
    ApplicationDenyPayload

// --- Verification Category ---

export interface VerificationPassPayload {
    userId: string;
    verificationId: string;
    status: "VERIFIED";
}

export interface VerificationFailPayload {
    userId: string;
    verificationId: string;
    status: "FAILED";
}

export type AnyVerificationPayload =
    VerificationPassPayload |
    VerificationFailPayload

// ClientEvents Interface

/**
 * Event payload mapping for TicketyClient
 */
export interface ClientEvents {
    // Client
    [Events.Ready]: [ payload: ClientReadyPayload ];

    // Tickets
    [Events.TicketCreate]: [ payload: TicketCreatePayload ];
    [Events.TicketClose]: [ payload: TicketClosePayload ];
    [Events.TicketRename]: [ payload: TicketRenamePayload ];
    [Events.TicketPriority]: [ payload: TicketPriorityPayload ];
    [Events.TicketMove]: [ payload: TicketMovePayload ];
    [Events.TicketTransfer]: [ payload: TicketTransferPayload ];
    [Events.TicketClaim]: [ payload: TicketClaimPayload ];
    [Events.TicketUnclaim]: [ payload: TicketUnclaimPayload ];
    [Events.TicketAdd]: [ payload: TicketAddPayload ];
    [Events.TicketRemove]: [ payload: TicketRemovePayload ];

    // Applications
    [Events.ApplicationSubmit]: [ payload: ApplicationSubmitPayload ];
    [Events.ApplicationAccept]: [ payload: ApplicationAcceptPayload ];
    [Events.ApplicationDeny]: [ payload: ApplicationDenyPayload ];

    // Verification
    [Events.VerificationPass]: [ payload: VerificationPassPayload ];
    [Events.VerificationFail]: [ payload: VerificationFailPayload ];
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
    public config: Config;
    private app: Application;
    private port: number;

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
