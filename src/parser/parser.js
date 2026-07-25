import Events from "../objects/Events.js";
import { priorityChange } from "../objects/Priorities.js";
import { makeUploadFetch } from "../utils/uploads.js";

export default function parseBody(body, config) {
  const event = body.type;
  const payload = body.payload;

  if (!event || !payload) {
    throw new Error("Invalid body");
  }

  const ievent = Object.values(Events).find((e) => e === event);
  if (!ievent) {
    throw new Error(`Invalid event: ${event}`);
  }

  const eventCategory = event.split(".")[0];
  switch (eventCategory) {
    case "ticket":
      return { event: ievent, payload: parseTicketEvent(event, payload, config) };
    case "application":
      return { event: ievent, payload: parseApplicationEvent(event, payload, config) };
    case "verification":
      return { event: ievent, payload: parseVerificationEvent(event, payload) };
    case "member":
      return { event: ievent, payload: parseMemberEvent(event, payload) };
  }
}

/**
 * @return {import("../index.d.ts").AnyTicketPayload}
 * */
function parseTicketEvent(event, payload, config) {
  /**
   *
   * @type {import("../index.d.ts").TicketPayload}
   */
  const basePayload = {
    ticketId: payload.ticketId,
    panelId: payload.panelId,
    channel: payload.channel,
    creatorId: payload.creatorId,
    createdAt: new Date(payload.openDate),
  };

  switch (event) {
    case "ticket.create":
      return {
        ...basePayload,
        questions: payload.questions
          ? payload.questions.map((q) => ({
              question: q.question,
              answer: q.answer,
              required: q.required,
              upload: q.upload ? { ...q.upload, fetch: makeUploadFetch(q.upload, config) } : undefined,
            }))
          : [],
      };
    case "ticket.close":
      return {
        ...basePayload,
        closedBy: payload.closerId,
        reason: payload.closeReason,
        closedAt: new Date(payload.closeDate),
        transcriptUrl: payload.transcript,
      };
    case "ticket.rename":
      return {
        ...basePayload,
        oldName: payload.oldName,
        newName: payload.newName,
      };
    case "ticket.priority":
      return {
        ...basePayload,
        oldPriority: priorityChange(payload.oldPriority),
        newPriority: priorityChange(payload.newPriority),
      };
    case "ticket.move":
      return {
        ...basePayload,
        oldCategoryId: payload.oldCategoryId,
        newCategoryId: payload.newCategoryId,
      };
    case "ticket.transfer":
      return {
        ...basePayload,
        oldCategoryId: payload.oldCategoryId,
        newCategoryId: payload.newCategoryId,
        oldPanelId: payload.oldPanelId,
        newPanelId: payload.newPanelId,
      };
    case "ticket.claim":
      return {
        ...basePayload,
        staffId: payload.claimedBy,
      };
    case "ticket.unclaim":
      return {
        ...basePayload,
        staffId: payload.unclaimedBy,
      };
    case "ticket.add":
      return {
        ...basePayload,
        addedUserId: payload.addedUser,
      };
    case "ticket.remove":
      return {
        ...basePayload,
        removedUserId: payload.removedUser,
      };
  }
}

/**
 *
 * @return {import("../index.d.ts").AnyApplicationPayload}
 */
function parseApplicationEvent(event, payload) {
  /**
   * @type {import("../index.d.ts").ApplicationPayload}
   */
  const basePayload = {
    applicationId: payload.applicationId,
    panelId: payload.panelId,
    submitterId: payload.submitterId,
    submittedAt: new Date(payload.submitDate),
  };

  switch (event) {
    case "application.submit":
      return {
        ...basePayload,
        questions: payload.questions
          ? payload.questions.map((q) => ({
              question: q.question,
              description: q.description,
              required: q.required,
              type: q.type,
              choices: q.choices,
              skipped: q.skipped,
              answer: q.answer,
              answerRaw: q.answerRaw,
              upload: q.upload ? { ...q.upload, fetch: makeUploadFetch(q.upload, config) } : undefined,
            }))
          : [],
      };
    case "application.accept":
      return {
        ...basePayload,
        reviewedBy: payload.reviewerId,
        reviewedAt: new Date(payload.reviewDate),
        reason: payload.reason,
      };
    case "application.deny":
      return {
        ...basePayload,
        reviewedBy: payload.reviewerId,
        reviewedAt: new Date(payload.reviewDate),
        reason: payload.reason,
      };
  }
}

/**
 * @return {import("../index.d.ts").AnyVerificationPayload}
 */
function parseVerificationEvent(event, payload) {
  switch (event) {
    case "verification.pass":
      return {
        userId: payload.userId,
        verificationId: payload.verificationId,
        status: payload.status,
      };
    case "verification.fail":
      return {
        userId: payload.userId,
        verificationId: payload.verificationId,
        status: payload.status,
      };
  }
}

/**
 * @return {import("../index.d.ts").AnyMemberPayload}
 */
function parseMemberEvent(event, payload) {
  switch (event) {
    case "member.join":
      return {
        userId: payload.userId,
        username: payload.username,
        joinedAt: new Date(payload.joinedAt),
        memberCount: payload.memberCount,
      };
    case "member.leave":
      return {
        userId: payload.userId,
        username: payload.username,
        memberCount: payload.memberCount,
      };
  }
}