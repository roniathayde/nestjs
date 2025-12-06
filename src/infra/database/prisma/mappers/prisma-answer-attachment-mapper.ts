import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import type { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export abstract class PrismaAnswerAttachmentMapper {
	static toDomain(attachmentPrisma: PrismaAttachment): AnswerAttachment {
		if (!attachmentPrisma.answerId) {
			throw new Error('Invalid Comment: Missing answerId')
		}

		return AnswerAttachment.create(
			{
				attachmentId: new UniqueEntityID(attachmentPrisma.id),
				answerId: new UniqueEntityID(attachmentPrisma.answerId),
			},
			new UniqueEntityID(attachmentPrisma.id),
		)
	}

	static toPrismaUpdateMany(
		attachments: AnswerAttachment[],
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentIds = attachments.map((attachment) =>
			attachment.attachmentId.toString(),
		)

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				answerId: attachments[0].answerId.toString(),
			},
		}
	}
}
