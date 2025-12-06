import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import type { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export abstract class PrismaQuestionAttachmentMapper {
	static toDomain(attachmentPrisma: PrismaAttachment): QuestionAttachment {
		if (!attachmentPrisma.questionId) {
			throw new Error('Invalid Comment: Missing questionId')
		}

		return QuestionAttachment.create(
			{
				attachmentId: new UniqueEntityID(attachmentPrisma.id),
				questionId: new UniqueEntityID(attachmentPrisma.questionId),
			},
			new UniqueEntityID(attachmentPrisma.id),
		)
	}

	static toPrismaUpdateMany(
		attachments: QuestionAttachment[],
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
				questionId: attachments[0].questionId.toString(),
			},
		}
	}
}
