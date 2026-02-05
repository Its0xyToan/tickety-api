export default Object.freeze({
  // Client / System
  Ready: "ready",

  // Ticket Events
  TicketCreate: "ticket.create",
  TicketClose: "ticket.close",
  TicketRename: "ticket.rename",
  TicketPriority: "ticket.priority",
  TicketMove: "ticket.move",
  TicketTransfer: "ticket.transfer",
  TicketClaim: "ticket.claim",
  TicketUnclaim: "ticket.unclaim",
  TicketAdd: "ticket.add",
  TicketRemove: "ticket.remove",

  // Application Events
  ApplicationSubmit: "application.submit",
  ApplicationAccept: "application.accept",
  ApplicationDeny: "application.deny",

  // Verification Events
  VerificationPass: "verification.pass",
  VerificationFail: "verification.fail",
});
