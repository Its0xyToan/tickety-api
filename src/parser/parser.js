import Events from "../objects/Events.js"
import { priorityChange } from "../objects/Priorities.js"

export default function parseBody (body) {
	const event = body.type;
	const payload = body.payload;

	if (!event || !payload) {
		throw new Error("Invalid body");
	}

	const ievent = Events[event]
	if (!ievent) {
		throw new Error(`Invalid event: ${event}`);
	}

	const eventCategory = event.split(".")[0]
	switch (eventCategory) {
		case "ticket":
			return { event: ievent, payload: parseTicketEvent(event, payload) }
		case "application":
			return { event: ievent, payload: parseApplicationEvent(event, payload) }
		case "verification":
			return { event: ievent, payload: parseVerificationEvent(event, payload) }
	}

}

/**
 * @return {import("../index.d.ts").AnyTicketPayload}
 * */
function parseTicketEvent (event, payload) {
	/**
	 *
	 * @type {import("../index.d.ts").TicketPayload}
	 */
	const basePayload = {
		ticketId: payload.ticketId,
		panelId: payload.panelId,
		channel: payload.channel,
		creatorId: payload.creatorId,
		createdAt: new Date(payload.openDate)
	}

	switch (event) {
		case "ticket.create":
			return {
				...basePayload,
				questions: payload.questions.map(q => ({
					question: q.question,
					answer: q.answer
				}))
			}
		case "ticket.close":
			return {
				...basePayload,
				closedBy: payload.closerId,
				reason: payload.closeReason,
				closedAt: new Date(payload.closeDate),
				transcriptUrl: payload.transcript
			}
		case "ticket.rename":
			return {
				...basePayload,
				oldName: payload.oldName,
				newName: payload.newName
			}
		case "ticket.priority":
			return {
				...basePayload,
				oldPriority: priorityChange(payload.oldPriority),
				newPriority: priorityChange(payload.newPriority)
			}
		case "ticket.move":
			return {
				...basePayload,
				oldCategoryId: payload.oldCategoryId,
				newCategoryId: payload.newCategoryId
			}
		case "ticket.transfer":
			return {
				...basePayload,
				oldCategoryId: payload.oldCategoryId,
				newCategoryId: payload.newCategoryId,
				oldPanelId: payload.oldPanelId,
				newPanelId: payload.newPanelId
			}
		case "ticket.claim":
			return {
				...basePayload,
				staffId: payload.claimedBy
			}
		case "ticket.unclaim":
			return {
				...basePayload,
				staffId: payload.unclaimedBy
			}
		case "ticket.add":
			return {
				...basePayload,
				addedUserId: payload.addedUser
			}
		case "ticket.remove":
			return {
				...basePayload,
				removedUserId: payload.removedUser
			}
	}
}

/**
 *
 * @return {import("../index.d.ts").AnyApplicationPayload}
 */
function parseApplicationEvent (event, payload) {
	/**
	 * @type {import("../index.d.ts").ApplicationPayload}
	 */
	const basePayload = {
		applicationId: payload.applicationId,
		panelId: payload.panelId,
		submitterId: payload.submitterId,
		submittedAt: new Date(payload.submitDate)
	}

	switch (event) {
		case "application.submit":
			return basePayload
		case "application.accept":
			return {
				...basePayload,
				reviewedBy: payload.reviewerId,
				reviewedAt: new Date(payload.reviewDate),
				reason: payload.reason
			}
		case "application.deny":
			return {
				...basePayload,
				reviewedBy: payload.reviewerId,
				reviewedAt: new Date(payload.reviewDate),
				reason: payload.reason
			}
	}
}

/**
 * @return {import("../index.d.ts").AnyVerificationPayload}
 */
function parseVerificationEvent (event, payload) {
	switch (event) {
		case "verification.pass":
			return {
				userId: payload.userId,
				verificationId: payload.verificationId,
				status: payload.status
			}
		case "verification.fail":
			return {
				userId: payload.userId,
				verificationId: payload.verificationId,
				status: payload.status
			}
	}
}